'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/core/shadcn/components/ui/table";
import { Button } from "@/core/shadcn/components/ui/button";
import { Input } from "@/core/shadcn/components/ui/input";
import { flexRender, getCoreRowModel, getPaginationRowModel, useReactTable } from "@tanstack/react-table";
import { SquarePen, ArrowUp, ArrowDown, Plus, Eye, Loader2, Search, Download } from "lucide-react";
import { useAppNavigation } from "@/common/hooks";
import { useFetchProductsQuery, useExportProductsToExcelMutation } from "@/lib/services/modules/productService";
import { useFetchBrandsQuery } from "@/lib/services/modules/brandService";
import { useFetchCategoriesQuery } from "@/lib/services/modules/categoryService";
import { useFetchMaterialsQuery } from "@/lib/services/modules/materialService";
import { useFetchStrapTypesQuery } from "@/lib/services/modules/strapTypeService";
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { getStatusEnumString } from "@/common/utils/statusOption";
import { UISingleSelect } from "@/core/ui/UISingleSelect";
import { EStatusEnumString } from "@/common/enums/status";
import { ESize } from "@/core/ui/Helpers/UIsize.enum";
import { getStatusDisplay } from "@/common/utils/statusColor";
import { useState, useEffect } from "react";

const ProductTable = () => {
  const router = useRouter();
  const { getRouteWithRole } = useAppNavigation();
  
  const [queryStates, setQueryStates] = useQueryStates({
    page: parseAsInteger.withDefault(0),
    brandId: parseAsString.withDefault(""),
    categoryId: parseAsString.withDefault(""),
    materialId: parseAsString.withDefault(""),
    strapTypeId: parseAsString.withDefault(""),
    status: parseAsString.withDefault(""),
    keyword: parseAsString.withDefault(""),
    sort: parseAsString.withDefault("id"),
    direction: parseAsString.withDefault("desc"),
  });

  const [searchInput, setSearchInput] = useState(queryStates.keyword);

  useEffect(() => {
    const timer = setTimeout(() => {
      setQueryStates((prev) => ({
        ...prev,
        keyword: searchInput,
        page: 0,
      }));
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    setSearchInput(queryStates.keyword);
  }, [queryStates.keyword]);

  const { data, refetch } = useFetchProductsQuery({
    page: queryStates.page,
    isAll: false,
    size: 10,
    sort: queryStates.sort,
    direction: (queryStates.direction === "asc" || queryStates.direction === "desc") ? queryStates.direction : undefined,
    keyword: queryStates.keyword || undefined,
    brandId: queryStates.brandId ? parseInt(queryStates.brandId) : undefined,
    categoryId: queryStates.categoryId ? parseInt(queryStates.categoryId) : undefined,
    materialId: queryStates.materialId ? parseInt(queryStates.materialId) : undefined,
    strapTypeId: queryStates.strapTypeId ? parseInt(queryStates.strapTypeId) : undefined,
    status: queryStates.status as EStatusEnumString || undefined,
  }, { refetchOnMountOrArgChange: true });

  const [exportProductsToExcel, { isLoading: isExporting }] = useExportProductsToExcelMutation();

  const { data: brandsData } = useFetchBrandsQuery({
    page: 0,
    size: 100,
    isAll: true,
  });

  const { data: categoriesData } = useFetchCategoriesQuery({
    page: 0,
    size: 100,
    isAll: true,
  });

  const { data: materialsData } = useFetchMaterialsQuery({
    page: 0,
    size: 100,
    isAll: true,
  });

  const { data: strapTypesData } = useFetchStrapTypesQuery({
    page: 0,
    size: 100,
    isAll: true,
  });

  const handlePageChange = (newPage: number) => {
    setQueryStates((prev) => ({
      ...prev,
      page: newPage - 1,
    }));
  };

  const handleBrandChange = (selected: { value: string; label: string } | null) => {
    setQueryStates((prev) => ({
      ...prev,
      brandId: selected?.value || "",
      page: 0,
    }));
  };

  const handleCategoryChange = (selected: { value: string; label: string } | null) => {
    setQueryStates((prev) => ({
      ...prev,
      categoryId: selected?.value || "",
      page: 0,
    }));
  };

  const handleMaterialChange = (selected: { value: string; label: string } | null) => {
    setQueryStates((prev) => ({
      ...prev,
      materialId: selected?.value || "",
      page: 0,
    }));
  };

  const handleStrapTypeChange = (selected: { value: string; label: string } | null) => {
    setQueryStates((prev) => ({
      ...prev,
      strapTypeId: selected?.value || "",
      page: 0,
    }));
  };

  const handleStatusChange = (selected: { value: string; label: string } | null) => {
    setQueryStates((prev) => ({
      ...prev,
      status: selected?.value || "",
      page: 0,
    }));
  };

  const handleSortChange = (column: string) => {
    setQueryStates((prev) => ({
      ...prev,
      sort: column,
      direction: prev.sort === column && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const getSortIcon = (column: string) => {
    if (queryStates.sort !== column) {
      return null;
    }
    return queryStates.direction === "asc" ?
      <ArrowUp className="inline-block w-3 h-3 ml-1" /> :
      <ArrowDown className="inline-block w-3 h-3 ml-1" />;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleExportExcel = async () => {
    try {
      const result = await exportProductsToExcel({
        keyword: queryStates.keyword || undefined,
        status: queryStates.status || undefined,
        categoryId: queryStates.categoryId || undefined,
        brandId: queryStates.brandId || undefined,
        materialId: queryStates.materialId || undefined,
        strapTypeId: queryStates.strapTypeId || undefined,
      }).unwrap();

      const timestamp = new Date().toISOString().slice(0, 19).replace(/[-:]/g, '').replace('T', '_');
      const filename = `DanhSachSanPham_${timestamp}.xlsx`;

      const url = window.URL.createObjectURL(result);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success('Xuất Excel thành công!');
    } catch (error) {
      toast.error('Có lỗi xảy ra khi xuất Excel');
    }
  };

  const brandOptions = [
    { value: "", label: "Tất cả thương hiệu" },
    ...(brandsData?.data?.map(brand => ({
      value: brand.id.toString(),
      label: brand.name,
    })) || [])
  ];

  const categoryOptions = [
    { value: "", label: "Tất cả danh mục" },
    ...(categoriesData?.data?.map(category => ({
      value: category.id.toString(),
      label: category.name,
    })) || [])
  ];

  const materialOptions = [
    { value: "", label: "Tất cả chất liệu" },
    ...(materialsData?.data?.map(material => ({
      value: material.id.toString(),
      label: material.name,
    })) || [])
  ];

  const strapTypeOptions = [
    { value: "", label: "Tất cả loại dây đeo" },
    ...(strapTypesData?.data?.map(strapType => ({
      value: strapType.id.toString(),
      label: strapType.name,
    })) || [])
  ];

  const statusOptions = [
    { value: "", label: "Tất cả trạng thái" },
    ...getStatusEnumString()
  ];

  const columns = [
    {
      accessorKey: "id",
      header: () => (
        <div
          className="cursor-pointer flex items-center text-left"
          onClick={() => handleSortChange("id")}
        >
          ID {getSortIcon("id")}
        </div>
      ),
      cell: ({ row }: any) => <div className="text-left">{row.getValue("id")}</div>,
    },
    {
      accessorKey: "name",
      header: () => (
        <div
          className="cursor-pointer flex items-center text-left"
          onClick={() => handleSortChange("name")}
        >
          Tên sản phẩm {getSortIcon("name")}
        </div>
      ),
      cell: ({ row }: any) => <div className="text-left font-medium line-clamp-2">{row.getValue("name")}</div>,
    },
    {
      accessorKey: "brand",
      header: () => (
        <div className="text-left">
          Thương hiệu
        </div>
      ),
      cell: ({ row }: any) => <div className="text-left">{row.original.brand?.name || "-"}</div>,
    },
    {
      accessorKey: "category",
      header: () => (
        <div className="text-left">
          Danh mục
        </div>
      ),
      cell: ({ row }: any) => <div className="text-left">{row.original.category?.name || "-"}</div>,
    },
    {
      accessorKey: "material",
      header: () => (
        <div className="text-left">
          Chất liệu
        </div>
      ),
      cell: ({ row }: any) => <div className="text-left">{row.original.material?.name || "-"}</div>,
    },
    {
      accessorKey: "strapType",
      header: () => (
        <div className="text-left">
          Loại dây đeo
        </div>
      ),
      cell: ({ row }: any) => <div className="text-left">{row.original.strapType?.name || "-"}</div>,
    },
    {
      accessorKey: "status",
      header: () => (
        <div
          className="cursor-pointer flex items-center text-left"
          onClick={() => handleSortChange("status")}
        >
          Trạng thái {getSortIcon("status")}
        </div>
      ),
      cell: ({ row }: any) => <div className="text-left">{getStatusDisplay(row.getValue("status"))}</div>,
    },
    {
      id: "actions",
      header: "Hành động",
      cell: ({ row }: any) => {
        const id = row.original.id;
        return (
          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(getRouteWithRole(`/products/${id}/product-details`))}
              className="text-blue-600 hover:text-blue-700 hover:border-blue-300"
              title="Xem chi tiết sản phẩm"
            >
              <Eye className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(getRouteWithRole(`/products/${id}/edit`))}
            >
              <SquarePen className="w-4 h-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: data?.data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const isLoading = !data;

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="mb-6">
        <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">Quản lý sản phẩm</h1>
            <div className="flex gap-2">
              <Button
                onClick={handleExportExcel}
                disabled={isExporting}
                className="flex items-center gap-2 bg-white hover:bg-gray-100 text-green-700 font-medium shadow-sm"
              >
                {isExporting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
                <span>{isExporting ? 'Đang xuất...' : 'Xuất Excel'}</span>
              </Button>
              <Button
                onClick={() => router.push(getRouteWithRole('/products/new'))}
                className="flex items-center gap-2 bg-white hover:bg-gray-100 text-green-700 font-medium shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Thêm sản phẩm</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-5 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Tìm kiếm theo tên sản phẩm, thương hiệu, danh mục..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-10 h-10 border-gray-300 focus:border-green-500 focus:ring-green-500"
          />
        </div>
        <div className="flex items-center gap-4 flex-wrap">
        <div className="w-[200px]">
          <UISingleSelect
            options={brandOptions}
            selected={brandOptions.find(item => item.value === queryStates.brandId) || brandOptions[0]}
            onChange={handleBrandChange}
            className="rounded-md border border-gray-300"
            size={ESize.M}
            renderSelected={(props) => <UISingleSelect.Selected {...props} />}
            renderOption={(props) => <UISingleSelect.Option {...props} />}
          />
        </div>
        <div className="w-[200px]">
          <UISingleSelect
            options={categoryOptions}
            selected={categoryOptions.find(item => item.value === queryStates.categoryId) || categoryOptions[0]}
            onChange={handleCategoryChange}
            className="rounded-md border border-gray-300"
            size={ESize.M}
            renderSelected={(props) => <UISingleSelect.Selected {...props} />}
            renderOption={(props) => <UISingleSelect.Option {...props} />}
          />
        </div>
        <div className="w-[200px]">
          <UISingleSelect
            options={materialOptions}
            selected={materialOptions.find(item => item.value === queryStates.materialId) || materialOptions[0]}
            onChange={handleMaterialChange}
            className="rounded-md border border-gray-300"
            size={ESize.M}
            renderSelected={(props) => <UISingleSelect.Selected {...props} />}
            renderOption={(props) => <UISingleSelect.Option {...props} />}
          />
        </div>
        <div className="w-[200px]">
          <UISingleSelect
            options={strapTypeOptions}
            selected={strapTypeOptions.find(item => item.value === queryStates.strapTypeId) || strapTypeOptions[0]}
            onChange={handleStrapTypeChange}
            className="rounded-md border border-gray-300"
            size={ESize.M}
            renderSelected={(props) => <UISingleSelect.Selected {...props} />}
            renderOption={(props) => <UISingleSelect.Option {...props} />}
          />
        </div>
        <div className="w-[200px]">
          <UISingleSelect
            options={statusOptions}
            selected={statusOptions.find(item => item.value === queryStates.status) || statusOptions[0]}
            onChange={handleStatusChange}
            className="rounded-md border border-gray-300"
            size={ESize.M}
            renderSelected={(props) => <UISingleSelect.Selected {...props} />}
            renderOption={(props) => <UISingleSelect.Option {...props} />}
          />
        </div>
      </div>
      </div>

      {isLoading ? (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-12">
          <div className="flex flex-col items-center justify-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-green-600" />
            <p className="text-sm text-muted-foreground">Đang tải dữ liệu...</p>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="border-t border-gray-200 overflow-x-auto">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id} className="border-b border-gray-200 hover:bg-transparent">
                    {headerGroup.headers.map((header) => (
                      <TableHead
                        key={header.id}
                        className="bg-gradient-to-b from-gray-100 to-gray-50 font-semibold text-gray-700 py-4 px-4 border-r last:border-r-0"
                      >
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow 
                      key={row.id} 
                      className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-green-50 hover:to-transparent transition-all duration-200"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell
                          key={cell.id}
                          className="py-4 px-4 border-r last:border-r-0"
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-48 text-center">
                      <div className="flex flex-col items-center justify-center space-y-3 py-8">
                        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                          <Search className="h-8 w-8 text-gray-400" />
                        </div>
                        <p className="text-gray-500 font-medium">Không tìm thấy dữ liệu</p>
                        <p className="text-sm text-gray-400">Thử điều chỉnh bộ lọc để xem kết quả khác</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {data?.pagination && data.pagination.totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between p-6 border-t border-gray-200 bg-gray-50 gap-4">
              <div className="text-sm text-gray-600">
                Hiển thị {data.pagination.page * data.pagination.size + 1} - {Math.min((data.pagination.page + 1) * data.pagination.size, data.pagination.totalElements)} của {data.pagination.totalElements} kết quả
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(data.pagination.page)}
                  disabled={data.pagination.page === 0}
                  className="border-gray-300"
                >
                  Trước
                </Button>
                <span className="px-3 py-1 text-sm text-gray-700 font-medium">
                  Trang {data.pagination.page + 1} / {data.pagination.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(data.pagination.page + 2)}
                  disabled={data.pagination.page + 1 >= data.pagination.totalPages}
                  className="border-gray-300"
                >
                  Sau
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductTable;

