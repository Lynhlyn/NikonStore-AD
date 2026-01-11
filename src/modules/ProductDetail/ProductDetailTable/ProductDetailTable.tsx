'use client';

import { Button } from '@/core/shadcn/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/core/shadcn/components/ui/table';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/core/shadcn/components/ui/collapsible';
import { UITextField } from '@/core/ui';
import { UISingleSelect } from '@/core/ui/UISingleSelect';
import { ESize } from '@/core/ui/Helpers/UIsize.enum';
import { useFetchProductDetailsQuery, useExportProductDetailsToExcelMutation } from '@/lib/services/modules/productDetailService';
import { useFetchColorsQuery } from '@/lib/services/modules/colorService';
import { useFetchCapacitiesQuery } from '@/lib/services/modules/capacityService';
import { useAppNavigation, useDebounce } from '@/common/hooks';
import { getStatusEnumString } from '@/common/utils/statusOption';
import { getStatusDisplay } from '@/common/utils/statusColor';
import { EStatusEnumString } from '@/common/enums/status';
import { ArrowLeft, ArrowUp, ArrowDown, Plus, SquarePen, ImageIcon, Loader2, Download, Filter, RotateCcw, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { parseAsInteger, parseAsString, useQueryStates } from 'nuqs';
import { useState } from 'react';
import { toast } from 'sonner';
import { ColorImageGalleryModal } from '@/common/components/ColorImageGalleryModal';

interface ProductDetailTableProps {
  productId: number;
}

const ProductDetailTable = ({ productId }: ProductDetailTableProps) => {
  const router = useRouter();
  const { getRouteWithRole } = useAppNavigation();
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedColorId, setSelectedColorId] = useState<number | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  if (!productId || isNaN(productId)) {
    return (
      <div className="py-8 px-6">
        <div className="mb-6 flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => router.push(getRouteWithRole('/products'))}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại
          </Button>
          <div className="text-xl font-semibold text-gray-900">
            Lỗi: ID sản phẩm không hợp lệ
          </div>
        </div>
      </div>
    );
  }

  const [queryStates, setQueryStates] = useQueryStates({
    page: parseAsInteger.withDefault(0),
    search: parseAsString.withDefault(''),
    colorId: parseAsString.withDefault(''),
    capacityId: parseAsString.withDefault(''),
    status: parseAsString.withDefault(''),
    sort: parseAsString.withDefault('id'),
    direction: parseAsString.withDefault('desc'),
  });

  // Debounce search input to avoid too many API calls
  const debouncedSearch = useDebounce(queryStates.search, 500);

  const { data, refetch, isLoading, error } = useFetchProductDetailsQuery({
    page: queryStates.page,
    size: 10,
    sort: queryStates.sort,
    direction: (queryStates.direction === 'asc' || queryStates.direction === 'desc') ? queryStates.direction : undefined,
    productId: productId,
    sku: debouncedSearch || undefined,
    colorId: queryStates.colorId ? parseInt(queryStates.colorId) : undefined,
    capacityId: queryStates.capacityId ? parseInt(queryStates.capacityId) : undefined,
    status: queryStates.status as EStatusEnumString || undefined,
  }, { refetchOnMountOrArgChange: true });

  const { data: colorsData } = useFetchColorsQuery({
    page: 0,
    size: 100,
    isAll: true,
  });

  const { data: capacitiesData } = useFetchCapacitiesQuery({
    page: 0,
    size: 100,
    isAll: true,
  });

  const [exportProductDetailsToExcel, { isLoading: isExporting }] = useExportProductDetailsToExcelMutation();

  const handlePageChange = (newPage: number) => {
    setQueryStates((prev) => ({
      ...prev,
      page: newPage - 1,
    }));
  };

  const handleSearchChange = (search: string) => {
    setQueryStates((prev) => ({
      ...prev,
      search,
      page: 0,
    }));
  };

  const handleColorChange = (selected: { value: string; label: string } | null) => {
    setQueryStates((prev) => ({
      ...prev,
      colorId: selected?.value || '',
      page: 0,
    }));
  };

  const handleCapacityChange = (selected: { value: string; label: string } | null) => {
    setQueryStates((prev) => ({
      ...prev,
      capacityId: selected?.value || '',
      page: 0,
    }));
  };

  const handleStatusChange = (selected: { value: string; label: string } | null) => {
    setQueryStates((prev) => ({
      ...prev,
      status: selected?.value || '',
      page: 0,
    }));
  };

  const handleSortChange = (column: string) => {
    setQueryStates((prev) => ({
      ...prev,
      sort: column,
      direction: prev.sort === column && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const getSortIcon = (column: string) => {
    if (queryStates.sort !== column) {
      return null;
    }
    return queryStates.direction === 'asc' ?
      <ArrowUp className="inline-block w-3 h-3 ml-1" /> :
      <ArrowDown className="inline-block w-3 h-3 ml-1" />;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const clearAllFilters = () => {
    setQueryStates({
      page: 0,
      search: '',
      colorId: '',
      capacityId: '',
      status: '',
    });
    toast.success('Đã xóa tất cả bộ lọc!');
  };

  const hasActiveFilters = queryStates.search !== '' || queryStates.colorId !== '' || queryStates.capacityId !== '' || queryStates.status !== '';

  const handleExportExcel = async () => {
    try {
      const result = await exportProductDetailsToExcel({
        productId: productId,
        sku: debouncedSearch || undefined,
        colorId: queryStates.colorId || undefined,
        capacityId: queryStates.capacityId || undefined,
        status: queryStates.status || undefined,
      }).unwrap();

      const timestamp = new Date().toISOString().slice(0, 19).replace(/[-:]/g, '').replace('T', '_');
      const filename = `DanhSachSanPhamChiTiet_${timestamp}.xlsx`;

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

  const colorOptions = [
    { value: '', label: 'Tất cả màu sắc' },
    ...(colorsData?.data?.map(color => ({
      value: color.id.toString(),
      label: color.name,
    })) || [])
  ];

  const capacityOptions = [
    { value: '', label: 'Tất cả dung tích' },
    ...(capacitiesData?.data?.map(capacity => ({
      value: capacity.id.toString(),
      label: capacity.name,
    })) || [])
  ];

  const statusOptions = [
    { value: '', label: 'Tất cả trạng thái' },
    ...getStatusEnumString()
  ];

  const productName = data?.data?.[0]?.productName || 'Sản phẩm';
  const productDetails = data?.data || [];

  if (isLoading) {
    return (
      <div className="py-8 px-6">
        <div className="mb-6 flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => router.push(getRouteWithRole('/products'))}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại
          </Button>
          <div className="text-xl font-semibold text-gray-900">
            Đang tải...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8 px-6">
        <div className="mb-6 flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => router.push(getRouteWithRole('/products'))}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại
          </Button>
          <div className="text-xl font-semibold text-gray-900">
            Lỗi: Không thể tải dữ liệu sản phẩm chi tiết
          </div>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">
            Có lỗi xảy ra khi tải danh sách sản phẩm chi tiết. Vui lòng thử lại sau.
          </p>
          <Button
            onClick={() => refetch()}
            className="mt-2"
            variant="outline"
          >
            Thử lại
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <Collapsible open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <div className="bg-gradient-to-r from-rose-600 to-rose-700 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  onClick={() => router.push(getRouteWithRole('/products'))}
                  className="flex items-center gap-2 bg-white hover:bg-gray-100 text-rose-700 font-medium shadow-sm"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Quay lại
                </Button>
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">Chi tiết sản phẩm</h2>
                  <p className="text-sm text-rose-100">
                    {productName}
                    {hasActiveFilters && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-500 text-white ml-2">
                        Đang áp dụng {Object.values({ search: queryStates.search, colorId: queryStates.colorId, capacityId: queryStates.capacityId, status: queryStates.status }).filter(Boolean).length} bộ lọc
                      </span>
                    )}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <CollapsibleTrigger asChild>
                  <Button variant="secondary" size="sm" className="bg-white hover:bg-gray-100 text-rose-700 font-medium shadow-sm">
                    <Filter className="h-4 w-4 mr-2" />
                    {isFilterOpen ? 'Ẩn bộ lọc' : 'Hiện bộ lọc'}
                  </Button>
                </CollapsibleTrigger>
                {hasActiveFilters && (
                  <Button variant="secondary" size="sm" onClick={clearAllFilters} className="bg-white hover:bg-gray-100 text-rose-700 font-medium shadow-sm">
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Làm mới
                  </Button>
                )}
                <Button
                  onClick={handleExportExcel}
                  disabled={isExporting}
                  size="sm"
                  className="bg-white hover:bg-gray-100 text-rose-700 font-medium shadow-sm"
                >
                  {isExporting ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4 mr-2" />
                  )}
                  {isExporting ? 'Đang xuất...' : 'Xuất Excel'}
                </Button>
                <Button
                  onClick={() => router.push(getRouteWithRole(`/products/${productId}/product-details/new`))}
                  size="sm"
                  className="bg-white hover:bg-gray-100 text-rose-700 font-medium shadow-sm"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm sản phẩm chi tiết
                </Button>
              </div>
            </div>
          </div>

          <CollapsibleContent>
            <div className="p-6 bg-gradient-to-br from-gray-50 to-rose-50 border-b border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Tìm kiếm SKU</label>
                  <UITextField
                    placeholder="Tìm kiếm SKU..."
                    value={queryStates.search}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    leftIcon={<Search className="w-4 h-4" />}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Màu sắc</label>
                  <UISingleSelect
                    options={colorOptions}
                    onChange={handleColorChange}
                    selected={colorOptions.find(option => option.value === queryStates.colorId)}
                    bindLabel="label"
                    bindValue="value"
                    size={ESize.M}
                    placeholder="Tất cả màu sắc"
                    renderOption={(props) => <UISingleSelect.Option {...props} />}
                    renderSelected={(props) => <UISingleSelect.Selected {...props} />}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Dung tích</label>
                  <UISingleSelect
                    options={capacityOptions}
                    onChange={handleCapacityChange}
                    selected={capacityOptions.find(option => option.value === queryStates.capacityId)}
                    bindLabel="label"
                    bindValue="value"
                    size={ESize.M}
                    placeholder="Tất cả dung tích"
                    renderOption={(props) => <UISingleSelect.Option {...props} />}
                    renderSelected={(props) => <UISingleSelect.Selected {...props} />}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Trạng thái</label>
                  <UISingleSelect
                    options={statusOptions}
                    onChange={handleStatusChange}
                    selected={statusOptions.find(option => option.value === queryStates.status)}
                    bindLabel="label"
                    bindValue="value"
                    size={ESize.M}
                    placeholder="Tất cả trạng thái"
                    renderOption={(props) => <UISingleSelect.Option {...props} />}
                    renderSelected={(props) => <UISingleSelect.Selected {...props} />}
                  />
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        <div className="border-t border-gray-200 overflow-x-auto">

          <Table>
            <TableHeader>
              <TableRow className="border-b border-gray-200 hover:bg-transparent">
                <TableHead className="bg-gradient-to-b from-gray-100 to-gray-50 font-semibold text-gray-700 py-4 px-4 border-r last:border-r-0">
                  <div
                    className="cursor-pointer flex items-center text-left"
                    onClick={() => handleSortChange('id')}
                  >
                    ID {getSortIcon('id')}
                  </div>
                </TableHead>
                <TableHead className="bg-gradient-to-b from-gray-100 to-gray-50 font-semibold text-gray-700 py-4 px-4 border-r last:border-r-0">
                  <div
                    className="cursor-pointer flex items-center text-left"
                    onClick={() => handleSortChange('sku')}
                  >
                    SKU {getSortIcon('sku')}
                  </div>
                </TableHead>
                <TableHead className="bg-gradient-to-b from-gray-100 to-gray-50 font-semibold text-gray-700 py-4 px-4 border-r last:border-r-0">
                  <div className="flex items-center text-left">
                    Tên sản phẩm
                  </div>
                </TableHead>
                <TableHead className="bg-gradient-to-b from-gray-100 to-gray-50 font-semibold text-gray-700 py-4 px-4 border-r last:border-r-0">
                  <div className="flex items-center text-left">
                    Màu sắc
                  </div>
                </TableHead>
                <TableHead className="bg-gradient-to-b from-gray-100 to-gray-50 font-semibold text-gray-700 py-4 px-4 border-r last:border-r-0">
                  <div className="flex items-center text-left">
                    Ảnh
                  </div>
                </TableHead>
                <TableHead className="bg-gradient-to-b from-gray-100 to-gray-50 font-semibold text-gray-700 py-4 px-4 border-r last:border-r-0">
                  <div className="flex items-center text-left">
                    Dung tích
                  </div>
                </TableHead>
                <TableHead className="bg-gradient-to-b from-gray-100 to-gray-50 font-semibold text-gray-700 py-4 px-4 border-r last:border-r-0">
                  <div
                    className="cursor-pointer flex items-center text-left"
                    onClick={() => handleSortChange('price')}
                  >
                    Giá {getSortIcon('price')}
                  </div>
                </TableHead>
                <TableHead className="bg-gradient-to-b from-gray-100 to-gray-50 font-semibold text-gray-700 py-4 px-4 border-r last:border-r-0">
                  <div
                    className="cursor-pointer flex items-center text-left"
                    onClick={() => handleSortChange('stock')}
                  >
                    Tồn kho {getSortIcon('stock')}
                  </div>
                </TableHead>
                <TableHead className="bg-gradient-to-b from-gray-100 to-gray-50 font-semibold text-gray-700 py-4 px-4 border-r last:border-r-0">
                  <div
                    className="cursor-pointer flex items-center text-left"
                    onClick={() => handleSortChange('status')}
                  >
                    Trạng thái {getSortIcon('status')}
                  </div>
                </TableHead>
                <TableHead className="bg-gradient-to-b from-gray-100 to-gray-50 font-semibold text-gray-700 py-4 px-4 border-r last:border-r-0 text-right">
                  Hành động
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {productDetails.length > 0 ? (
                productDetails.map((detail) => {
                  const color = detail.color;
                  const colorName = color?.name || detail.colorName || '-';
                  const hexCode = color?.hexCode || '#000000';
                  const capacity = detail.capacity;
                  const capacityName = capacity?.name || detail.capacityName || '-';
                  return (
                    <TableRow 
                      key={detail.id}
                      className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-rose-50 hover:to-transparent transition-all duration-200"
                    >
                      <TableCell className="py-4 px-4 border-r last:border-r-0">
                        <div className="text-left">{detail.id}</div>
                      </TableCell>
                      <TableCell className="py-4 px-4 border-r last:border-r-0">
                        <div className="text-left font-medium">{detail.sku}</div>
                      </TableCell>
                      <TableCell className="py-4 px-4 border-r last:border-r-0">
                        <div className="line-clamp-2 text-left">{detail.productName}</div>
                      </TableCell>
                      <TableCell className="py-4 px-4 border-r last:border-r-0">
                        <div className="text-left flex items-center gap-2">
                          {colorName}
                          {color && (
                            <div
                              className="w-6 h-6 rounded border border-gray-300"
                              style={{ backgroundColor: hexCode }}
                            />
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="py-4 px-4 border-r last:border-r-0">
                        <div className="text-left flex items-center gap-2">
                          <div className="relative">
                            {detail.colorImageUrl ? (
                              <img
                                src={detail.colorImageUrl}
                                alt={`${detail.productName} - ${colorName}`}
                                className="w-16 h-16 object-cover rounded border border-gray-200 cursor-pointer hover:opacity-80 transition-opacity"
                                onClick={() => {
                                  setSelectedColorId(detail.colorId || null);
                                  setIsImageModalOpen(true);
                                }}
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = 'none';
                                  const parent = target.parentElement;
                                  if (parent) {
                                    const fallback = parent.querySelector('.image-placeholder') as HTMLElement;
                                    if (fallback) fallback.style.display = 'flex';
                                  }
                                }}
                              />
                            ) : null}
                            <div 
                              className={`image-placeholder w-16 h-16 items-center justify-center bg-gray-100 rounded border border-gray-200 ${detail.colorImageUrl ? 'hidden' : 'flex'}`}
                            >
                              <ImageIcon className="w-6 h-6 text-gray-400" />
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedColorId(detail.colorId || null);
                              setIsImageModalOpen(true);
                            }}
                            title="Quản lý ảnh"
                          >
                            <ImageIcon className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell className="py-4 px-4 border-r last:border-r-0">
                        <div className="text-left">{capacityName}</div>
                      </TableCell>
                      <TableCell className="py-4 px-4 border-r last:border-r-0">
                        <div className="text-left font-medium">{formatPrice(detail.price)}</div>
                      </TableCell>
                      <TableCell className="py-4 px-4 border-r last:border-r-0">
                        <div className="text-left">{detail.stock}</div>
                      </TableCell>
                      <TableCell className="py-4 px-4 border-r last:border-r-0">
                        <div className="text-left">{getStatusDisplay(detail.status)}</div>
                      </TableCell>
                      <TableCell className="py-4 px-4 border-r last:border-r-0">
                        <div className="flex gap-2 text-right justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.push(getRouteWithRole(`/products/${productId}/product-details/edit/${detail.id}`))}
                            title="Chỉnh sửa"
                          >
                            <SquarePen className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={10} className="h-48 text-center">
                    <div className="flex flex-col items-center justify-center space-y-3 py-8">
                      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                        <ImageIcon className="h-8 w-8 text-gray-400" />
                      </div>
                      <p className="text-sm font-medium text-gray-500">Không có dữ liệu sản phẩm chi tiết cho sản phẩm này</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {data?.pagination && data.pagination.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-white flex items-center justify-between">
            <div className="text-sm text-gray-600 font-medium">
              Hiển thị <span className="font-semibold text-gray-900">{data.pagination.page * data.pagination.size + 1}</span> - <span className="font-semibold text-gray-900">{Math.min((data.pagination.page + 1) * data.pagination.size, data.pagination.totalElements)}</span> của <span className="font-semibold text-gray-900">{data.pagination.totalElements}</span> kết quả
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(data.pagination.page)}
                disabled={data.pagination.page === 0}
                className="border-gray-300 hover:bg-gray-50"
              >
                Trước
              </Button>
              <span className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 rounded-md border border-gray-200">
                Trang {data.pagination.page + 1} / {data.pagination.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(data.pagination.page + 2)}
                disabled={data.pagination.page + 1 >= data.pagination.totalPages}
                className="border-gray-300 hover:bg-gray-50"
              >
                Sau
              </Button>
            </div>
          </div>
        )}
      </div>

      {selectedColorId && (
        <ColorImageGalleryModal
          isOpen={isImageModalOpen}
          onClose={() => {
            setIsImageModalOpen(false);
            setSelectedColorId(null);
          }}
          productId={productId}
          colorId={selectedColorId}
          onSuccess={() => refetch()}
        />
      )}
    </div>
  );
};

export default ProductDetailTable;


