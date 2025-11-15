'use client';

import { Button } from '@/core/shadcn/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/core/shadcn/components/ui/table';
import { UITextField } from '@/core/ui';
import { UISingleSelect } from '@/core/ui/UISingleSelect';
import { ESize } from '@/core/ui/Helpers/UIsize.enum';
import { useFetchProductDetailsQuery, useDeleteProductDetailMutation } from '@/lib/services/modules/productDetailService';
import { useFetchColorsQuery } from '@/lib/services/modules/colorService';
import { useFetchCapacitiesQuery } from '@/lib/services/modules/capacityService';
import { useAppNavigation, useDebounce } from '@/common/hooks';
import { getStatusEnumString } from '@/common/utils/statusOption';
import { getStatusDisplay } from '@/common/utils/statusColor';
import { EStatusEnumString } from '@/common/enums/status';
import { ArrowLeft, ArrowUp, ArrowDown, Plus, SquarePen, Trash2, ImageIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { parseAsInteger, parseAsString, useQueryStates } from 'nuqs';
import { useState } from 'react';
import { toast } from 'sonner';
import { ConfirmModal } from '@/common/components/ConfirmModal';
import { ColorImageGalleryModal } from '@/common/components/ColorImageGalleryModal';

interface ProductDetailTableProps {
  productId: number;
}

const ProductDetailTable = ({ productId }: ProductDetailTableProps) => {
  const router = useRouter();
  const { getRouteWithRole } = useAppNavigation();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedDetailId, setSelectedDetailId] = useState<number | null>(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedColorId, setSelectedColorId] = useState<number | null>(null);

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

  const [deleteProductDetail, { isLoading: isDeleting }] = useDeleteProductDetailMutation();

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

  const handleDeleteClick = (detailId: number) => {
    setSelectedDetailId(detailId);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedDetailId) return;
    try {
      await deleteProductDetail(selectedDetailId).unwrap();
      toast.success('Đã xóa thành công sản phẩm chi tiết');
      refetch();
      setDeleteModalOpen(false);
      setSelectedDetailId(null);
    } catch (error: any) {
      toast.error('Đã xảy ra lỗi khi xóa sản phẩm chi tiết: ' + error.message);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
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
    <div className="py-8 px-6">
      <div className="mb-6 flex items-center gap-4">
        <Button
          variant="outline"
          onClick={() => router.push(getRouteWithRole('/products'))}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Quay lại danh sách sản phẩm
        </Button>
        <div className="text-xl font-semibold text-gray-900">
          <span className="gap-2 flex">
            Chi tiết sản phẩm:
            <span className="font-semibold text-primary">
              {productName}
            </span>
          </span>
        </div>
      </div>

      <div className="flex justify-between items-end mb-5">
        <div className="flex gap-4 flex-wrap">
          <div className="w-[200px]">
            <UITextField
              placeholder="Tìm kiếm SKU..."
              value={queryStates.search}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
          </div>
          <div className="w-[150px]">
            <UISingleSelect
              options={colorOptions}
              onChange={handleColorChange}
              selected={colorOptions.find(option => option.value === queryStates.colorId)}
              bindLabel="label"
              bindValue="value"
              size={ESize.M}
              className="rounded-md border border-gray-300"
              renderOption={(props) => <UISingleSelect.Option {...props} />}
              renderSelected={(props) => <UISingleSelect.Selected {...props} />}
            />
          </div>
          <div className="w-[170px]">
            <UISingleSelect
              options={capacityOptions}
              onChange={handleCapacityChange}
              selected={capacityOptions.find(option => option.value === queryStates.capacityId)}
              bindLabel="label"
              bindValue="value"
              size={ESize.M}
              className="rounded-md border border-gray-300"
              renderOption={(props) => <UISingleSelect.Option {...props} />}
              renderSelected={(props) => <UISingleSelect.Selected {...props} />}
            />
          </div>
          <div className="w-[150px]">
            <UISingleSelect
              options={statusOptions}
              onChange={handleStatusChange}
              selected={statusOptions.find(option => option.value === queryStates.status)}
              bindLabel="label"
              bindValue="value"
              size={ESize.M}
              className="rounded-md border border-gray-300"
              renderOption={(props) => <UISingleSelect.Option {...props} />}
              renderSelected={(props) => <UISingleSelect.Selected {...props} />}
            />
          </div>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={() => router.push(getRouteWithRole(`/products/${productId}/product-details/new`))}
          >
            <Plus className="w-4 h-4 mr-2" />
            Thêm sản phẩm chi tiết
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="text-gray-700 font-semibold text-sm">
                <div
                  className="cursor-pointer flex items-center text-left"
                  onClick={() => handleSortChange('id')}
                >
                  ID {getSortIcon('id')}
                </div>
              </TableHead>
              <TableHead className="text-gray-700 font-semibold text-sm">
                <div
                  className="cursor-pointer flex items-center text-left"
                  onClick={() => handleSortChange('sku')}
                >
                  SKU {getSortIcon('sku')}
                </div>
              </TableHead>
              <TableHead className="text-gray-700 font-semibold text-sm">
                <div className="flex items-center text-left">
                  Tên sản phẩm
                </div>
              </TableHead>
              <TableHead className="text-gray-700 font-semibold text-sm">
                <div className="flex items-center text-left">
                  Màu sắc
                </div>
              </TableHead>
              <TableHead className="text-gray-700 font-semibold text-sm">
                <div className="flex items-center text-left">
                  Ảnh
                </div>
              </TableHead>
              <TableHead className="text-gray-700 font-semibold text-sm">
                <div className="flex items-center text-left">
                  Dung tích
                </div>
              </TableHead>
              <TableHead className="text-gray-700 font-semibold text-sm">
                <div
                  className="cursor-pointer flex items-center text-left"
                  onClick={() => handleSortChange('price')}
                >
                  Giá {getSortIcon('price')}
                </div>
              </TableHead>
              <TableHead className="text-gray-700 font-semibold text-sm">
                <div
                  className="cursor-pointer flex items-center text-left"
                  onClick={() => handleSortChange('stock')}
                >
                  Tồn kho {getSortIcon('stock')}
                </div>
              </TableHead>
              <TableHead className="text-gray-700 font-semibold text-sm">
                <div
                  className="cursor-pointer flex items-center text-left"
                  onClick={() => handleSortChange('status')}
                >
                  Trạng thái {getSortIcon('status')}
                </div>
              </TableHead>
              <TableHead className="text-gray-700 font-semibold text-sm text-right">
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
                  <TableRow key={detail.id} className="hover:bg-gray-50">
                    <TableCell className="text-gray-900 text-sm py-4">
                      <div className="text-left">{detail.id}</div>
                    </TableCell>
                    <TableCell className="text-gray-900 text-sm py-4">
                      <div className="text-left font-medium">{detail.sku}</div>
                    </TableCell>
                    <TableCell className="text-gray-900 text-sm py-4">
                      <div className="line-clamp-2 text-left">{detail.productName}</div>
                    </TableCell>
                    <TableCell className="text-gray-900 text-sm py-4">
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
                    <TableCell className="text-gray-900 text-sm py-4">
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
                    <TableCell className="text-gray-900 text-sm py-4">
                      <div className="text-left">{capacityName}</div>
                    </TableCell>
                    <TableCell className="text-gray-900 text-sm py-4">
                      <div className="text-left font-medium">{formatPrice(detail.price)}</div>
                    </TableCell>
                    <TableCell className="text-gray-900 text-sm py-4">
                      <div className="text-left">{detail.stock}</div>
                    </TableCell>
                    <TableCell className="text-gray-900 text-sm py-4">
                      <div className="text-left">{getStatusDisplay(detail.status)}</div>
                    </TableCell>
                    <TableCell className="text-gray-900 text-sm py-4">
                      <div className="flex gap-2 text-right justify-end">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(getRouteWithRole(`/products/${productId}/product-details/edit/${detail.id}`))}
                          title="Chỉnh sửa"
                        >
                          <SquarePen className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteClick(detail.id)}
                          className="text-red-600 hover:text-red-700 hover:border-red-300"
                          title="Xóa"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={10} className="h-24 text-center text-gray-500">
                  Không có dữ liệu sản phẩm chi tiết cho sản phẩm này.
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
          setSelectedDetailId(null);
        }}
        onConfirm={handleDelete}
        title="Xác nhận xóa sản phẩm chi tiết"
        message="Bạn có chắc chắn muốn xóa sản phẩm chi tiết này không? Hành động này không thể hoàn tác."
        type="danger"
        isLoading={isDeleting}
        confirmText="Xóa"
        cancelText="Hủy"
      />

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


