'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/core/shadcn/components/ui/table';
import { Button } from '@/core/shadcn/components/ui/button';
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { SquarePen, ArrowUp, ArrowDown, Plus } from 'lucide-react';
import { useAppNavigation } from '@/common/hooks';
import {
  useFetchContentCategoriesQuery,
  useDeleteContentCategoryMutation,
} from '@/lib/services/modules/contentCategoryService';
import { parseAsInteger, parseAsString, useQueryStates } from 'nuqs';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { UISingleSelect } from '@/core/ui/UISingleSelect';
import { ESize } from '@/core/ui/Helpers/UIsize.enum';
import { ConfirmModal } from '@/common/components/ConfirmModal';
import { useState } from 'react';
import { EContentType } from '@/lib/services/modules/contentTagService/type';

const ContentCategoryTable = () => {
  const router = useRouter();
  const { getRouteWithRole } = useAppNavigation();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedContentCategoryId, setSelectedContentCategoryId] = useState<number | null>(null);

  const [queryStates, setQueryStates] = useQueryStates({
    page: parseAsInteger.withDefault(0),
    type: parseAsString.withDefault(''),
    sort: parseAsString.withDefault('id'),
    direction: parseAsString.withDefault('desc'),
  });

  const { data, refetch } = useFetchContentCategoriesQuery(
    {
      page: queryStates.page,
      isAll: false,
      size: 10,
      sort: queryStates.sort,
      direction:
        queryStates.direction === 'asc' || queryStates.direction === 'desc'
          ? queryStates.direction
          : undefined,
      type: (queryStates.type as EContentType) || undefined,
    },
    { refetchOnMountOrArgChange: true }
  );

  const [deleteContentCategory, { isLoading: isDeleting }] = useDeleteContentCategoryMutation();

  const handlePageChange = (newPage: number) => {
    setQueryStates((prev) => ({
      ...prev,
      page: newPage - 1,
    }));
  };

  const handleTypeChange = (type: { value: string; label: string }) => {
    setQueryStates((prev) => ({
      ...prev,
      type: type.value || '',
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
    return queryStates.direction === 'asc' ? (
      <ArrowUp className="inline-block w-3 h-3 ml-1" />
    ) : (
      <ArrowDown className="inline-block w-3 h-3 ml-1" />
    );
  };

  const handleDeleteClick = (contentCategoryId: number) => {
    setSelectedContentCategoryId(contentCategoryId);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedContentCategoryId) return;
    try {
      await deleteContentCategory(selectedContentCategoryId).unwrap();
      toast.success('Đã xóa thành công content category');
      refetch();
      setDeleteModalOpen(false);
      setSelectedContentCategoryId(null);
    } catch (error: any) {
      toast.error('Đã xảy ra lỗi khi xóa content category: ' + error.message);
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

  const typeOptions = [
    { value: '', label: 'Tất cả loại' },
    { value: EContentType.BLOG, label: 'Blog' },
    { value: EContentType.FAQ, label: 'FAQ' },
  ];

  const columns = [
    {
      accessorKey: 'id',
      header: () => (
        <div
          className="cursor-pointer flex items-center text-left"
          onClick={() => handleSortChange('id')}
        >
          ID {getSortIcon('id')}
        </div>
      ),
      cell: ({ row }: any) => <div className="text-left">{row.getValue('id')}</div>,
    },
    {
      accessorKey: 'name',
      header: () => (
        <div
          className="cursor-pointer flex items-center text-left"
          onClick={() => handleSortChange('name')}
        >
          Tên danh mục {getSortIcon('name')}
        </div>
      ),
      cell: ({ row }: any) => <div className="text-left font-medium">{row.getValue('name')}</div>,
    },
    {
      accessorKey: 'slug',
      header: () => (
        <div
          className="cursor-pointer flex items-center text-left"
          onClick={() => handleSortChange('slug')}
        >
          Slug {getSortIcon('slug')}
        </div>
      ),
      cell: ({ row }: any) => <div className="text-left">{row.getValue('slug')}</div>,
    },
    {
      accessorKey: 'description',
      header: () => (
        <div className="cursor-pointer flex items-center text-left">Mô tả</div>
      ),
      cell: ({ row }: any) => {
        const description = row.getValue('description') as string;
        return (
          <div className="text-left max-w-xs truncate" title={description}>
            {description || '-'}
          </div>
        );
      },
    },
    {
      accessorKey: 'type',
      header: () => (
        <div
          className="cursor-pointer flex items-center text-left"
          onClick={() => handleSortChange('type')}
        >
          Loại {getSortIcon('type')}
        </div>
      ),
      cell: ({ row }: any) => {
        const type = row.getValue('type') as EContentType;
        const typeLabel = typeOptions.find((opt) => opt.value === type)?.label || type;
        return <div className="text-left">{typeLabel}</div>;
      },
    },
    {
      accessorKey: 'updatedAt',
      header: () => (
        <div
          className="cursor-pointer flex items-center text-left"
          onClick={() => handleSortChange('updatedAt')}
        >
          Ngày cập nhật {getSortIcon('updatedAt')}
        </div>
      ),
      cell: ({ row }: any) => (
        <div className="text-left text-sm text-gray-600">{formatDate(row.getValue('updatedAt'))}</div>
      ),
    },
    {
      id: 'actions',
      header: 'Hành động',
      cell: ({ row }: any) => {
        const id = row.original.id;
        return (
          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(getRouteWithRole(`/content-categories/${id}/edit`))}
            >
              <SquarePen className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDeleteClick(id)}
              className="text-red-600 hover:text-red-700 hover:border-red-300"
            >
              Xóa
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
        <h1 className="text-2xl font-semibold text-gray-900">Quản lý content category</h1>
        <Button
          onClick={() => router.push(getRouteWithRole('/content-categories/new'))}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm content category</span>
        </Button>
      </div>

      <div className="mb-5 flex items-center gap-4">
        <div className="w-[220px]">
          <UISingleSelect
            options={typeOptions}
            selected={
              queryStates.type
                ? typeOptions.find((item) => item.value === queryStates.type) || typeOptions[0]
                : typeOptions[0]
            }
            onChange={(selected) =>
              handleTypeChange(selected as { value: string; label: string })
            }
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
                  <TableHead key={header.id} className="text-gray-700 font-semibold text-sm">
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
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
                    <TableCell key={cell.id} className="text-gray-900 text-sm py-4">
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
              Hiển thị {data.pagination.page * data.pagination.size + 1} -{' '}
              {Math.min(
                (data.pagination.page + 1) * data.pagination.size,
                data.pagination.totalElements
              )}{' '}
              của {data.pagination.totalElements} kết quả
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
          setSelectedContentCategoryId(null);
        }}
        onConfirm={handleDelete}
        title="Xác nhận xóa content category"
        message="Bạn có chắc chắn muốn xóa content category này không? Hành động này không thể hoàn tác."
        type="danger"
        isLoading={isDeleting}
        confirmText="Xóa"
        cancelText="Hủy"
      />
    </div>
  );
};

export default ContentCategoryTable;

