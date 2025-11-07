'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/core/shadcn/components/ui/table";
import { Button } from "@/core/shadcn/components/ui/button";
import { flexRender, getCoreRowModel, getPaginationRowModel, useReactTable } from "@tanstack/react-table";
import { SquarePen, ArrowUp, ArrowDown, Plus, Trash2 } from "lucide-react";
import { useAppNavigation } from "@/common/hooks";
import { useFetchProductsQuery, useDeleteProductMutation } from "@/lib/services/modules/productService";
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
import { ConfirmModal } from "@/common/components/ConfirmModal";
import { useState } from "react";

const ProductTable = () => {
  const router = useRouter();
  const { getRouteWithRole } = useAppNavigation();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  
  const [queryStates, setQueryStates] = useQueryStates({
    page: parseAsInteger.withDefault(0),
    brandId: parseAsString.withDefault(""),
    categoryId: parseAsString.withDefault(""),
    materialId: parseAsString.withDefault(""),
    strapTypeId: parseAsString.withDefault(""),
    status: parseAsString.withDefault(""),
    sort: parseAsString.withDefault("id"),
    direction: parseAsString.withDefault("desc"),
  });

  const { data, refetch } = useFetchProductsQuery({
    page: queryStates.page,
    isAll: false,
    size: 10,
    sort: queryStates.sort,
    direction: (queryStates.direction === "asc" || queryStates.direction === "desc") ? queryStates.direction : undefined,
    brandId: queryStates.brandId ? parseInt(queryStates.brandId) : undefined,
    categoryId: queryStates.categoryId ? parseInt(queryStates.categoryId) : undefined,
    materialId: queryStates.materialId ? parseInt(queryStates.materialId) : undefined,
    strapTypeId: queryStates.strapTypeId ? parseInt(queryStates.strapTypeId) : undefined,
    status: queryStates.status as EStatusEnumString || undefined,
  }, { refetchOnMountOrArgChange: true });

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

  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

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

  const handleDeleteClick = (productId: number) => {
    setSelectedProductId(productId);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedProductId) return;
    try {
      await deleteProduct(selectedProductId).unwrap();
      toast.success('Đã xóa thành công sản phẩm');
      refetch();
      setDeleteModalOpen(false);
      setSelectedProductId(null);
    } catch (error: any) {
      toast.error('Đã xảy ra lỗi khi xóa sản phẩm: ' + error.message);
    }
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
              onClick={() => router.push(getRouteWithRole(`/products/${id}/edit`))}
            >
              <SquarePen className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDeleteClick(id)}
              className="text-red-600 hover:text-red-700 hover:border-red-300"
            >
              <Trash2 className="w-4 h-4" />
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

  return (
    <div className="py-8 px-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Quản lý sản phẩm</h1>
        <Button
          onClick={() => router.push(getRouteWithRole('/products/new'))}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm sản phẩm</span>
        </Button>
      </div>

      <div className="mb-5 flex items-center gap-4 flex-wrap">
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

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="bg-gray-50">
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="text-gray-700 font-semibold text-sm"
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
                <TableRow key={row.id} className="hover:bg-gray-50">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="text-gray-900 text-sm py-4"
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-gray-500">
                  Không có dữ liệu
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {data?.pagination && data.pagination.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Hiển thị {data.pagination.page * data.pagination.size + 1} - {Math.min((data.pagination.page + 1) * data.pagination.size, data.pagination.totalElements)} của {data.pagination.totalElements} kết quả
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(data.pagination.page)}
                disabled={data.pagination.page === 0}
              >
                Trước
              </Button>
              <span className="px-3 py-1 text-sm text-gray-700">
                Trang {data.pagination.page + 1} / {data.pagination.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(data.pagination.page + 2)}
                disabled={data.pagination.page + 1 >= data.pagination.totalPages}
              >
                Sau
              </Button>
            </div>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setSelectedProductId(null);
        }}
        onConfirm={handleDelete}
        title="Xác nhận xóa sản phẩm"
        message="Bạn có chắc chắn muốn xóa sản phẩm này không? Hành động này không thể hoàn tác."
        type="danger"
        isLoading={isDeleting}
        confirmText="Xóa"
        cancelText="Hủy"
      />
    </div>
  );
};

export default ProductTable;

