'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFetchFAQsQuery, useDeleteFAQMutation, useUpdateFAQStatusMutation } from '@/lib/services/modules/faqService';
import { Button } from '@/core/shadcn/components/ui/button';
import { Badge } from '@/core/shadcn/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/core/shadcn/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/core/shadcn/components/ui/card';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/core/shadcn/components/ui/dialog';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/core/shadcn/components/ui/dropdown-menu';
import { UIPagination, UIPaginationResuft } from '@/core/ui/UIPagination';
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { parseAsInteger, parseAsString, useQueryStates } from 'nuqs';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  MoreVertical,
  Filter,
  CheckCircle2,
  XCircle,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { toast } from 'sonner';
import { useAppNavigation } from '@/common/hooks';
import { routerApp } from '@/router';

const formatDate = (dateString?: string) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export default function FAQTable() {
  const router = useRouter();
  const { getRouteWithRole } = useAppNavigation();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedFAQ, setSelectedFAQ] = useState<any>(null);

  const [{ page, size, categoryId, tagId, status, sort, direction }, setQuery] = useQueryStates({
    page: parseAsInteger.withDefault(0),
    size: parseAsInteger.withDefault(12),
    categoryId: parseAsString.withDefault(''),
    tagId: parseAsString.withDefault(''),
    status: parseAsString.withDefault(''),
    sort: parseAsString.withDefault('id'),
    direction: parseAsString.withDefault('desc'),
  });

  const { data: faqsData, isLoading, refetch } = useFetchFAQsQuery({
    page,
    size,
    categoryId: categoryId ? parseInt(categoryId) : undefined,
    tagId: tagId ? parseInt(tagId) : undefined,
    status: status === 'true' ? true : status === 'false' ? false : undefined,
  });

  const [deleteFAQ, { isLoading: isDeleting }] = useDeleteFAQMutation();
  const [updateStatus] = useUpdateFAQStatusMutation();

  const faqs = faqsData?.data || [];
  const totalElements = faqsData?.pagination?.totalElements || 0;
  const totalPages = faqsData?.pagination?.totalPages || 0;

  const handleCreate = () => {
    router.push(getRouteWithRole(routerApp.faq.new));
  };

  const handleEdit = (faq: any) => {
    router.push(getRouteWithRole(routerApp.faq.edit({ id: faq.id.toString() })));
  };

  const handleView = (faq: any) => {
    router.push(getRouteWithRole(routerApp.faq.view({ id: faq.id.toString() })));
  };

  const handleDeleteClick = (faq: any) => {
    setSelectedFAQ(faq);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedFAQ) return;
    try {
      await deleteFAQ(selectedFAQ.id).unwrap();
      toast.success('Xóa FAQ thành công');
      setDeleteDialogOpen(false);
      setSelectedFAQ(null);
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || 'Có lỗi xảy ra khi xóa FAQ');
    }
  };

  const handleToggleStatus = async (faq: any) => {
    try {
      await updateStatus({ id: faq.id, status: !faq.status }).unwrap();
      toast.success(`Đã ${faq.status ? 'ẩn' : 'hiển thị'} FAQ thành công`);
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || 'Có lỗi xảy ra');
    }
  };

  const clearFilters = () => {
    setQuery({ categoryId: '', tagId: '', status: '', page: 0 });
  };

  const hasActiveFilters = categoryId !== '' || tagId !== '' || status !== '';

  const handleSortChange = (column: string) => {
    setQuery({
      sort: column,
      direction: sort === column && direction === 'asc' ? 'desc' : 'asc',
    });
  };

  const getSortIcon = (column: string) => {
    if (sort !== column) {
      return null;
    }
    return direction === 'asc' ? (
      <ArrowUp className="inline-block w-3 h-3 ml-1" />
    ) : (
      <ArrowDown className="inline-block w-3 h-3 ml-1" />
    );
  };

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
      accessorKey: 'question',
      header: () => (
        <div className="cursor-pointer flex items-center text-left">
          Câu hỏi
        </div>
      ),
      cell: ({ row }: any) => (
        <div className="text-left font-medium max-w-xs truncate" title={row.getValue('question')}>
          {row.getValue('question')}
        </div>
      ),
    },
    {
      accessorKey: 'category',
      header: () => (
        <div className="cursor-pointer flex items-center text-left">
          Danh mục
        </div>
      ),
      cell: ({ row }: any) => {
        const category = row.original.category;
        return (
          <div className="text-left">
            {category ? (
              <Badge variant="outline">{category.name}</Badge>
            ) : (
              <span className="text-gray-400">-</span>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: 'tag',
      header: () => (
        <div className="cursor-pointer flex items-center text-left">
          Tag
        </div>
      ),
      cell: ({ row }: any) => {
        const tag = row.original.tag;
        return (
          <div className="text-left">
            {tag ? (
              <Badge variant="outline">{tag.name}</Badge>
            ) : (
              <span className="text-gray-400">-</span>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: 'status',
      header: () => (
        <div className="cursor-pointer flex items-center text-left">
          Trạng thái
        </div>
      ),
      cell: ({ row }: any) => {
        const status = row.getValue('status') as boolean;
        return (
          <div className="text-left">
            <Badge variant={status ? 'default' : 'secondary'}>
              {status ? (
                <><CheckCircle2 className="h-3 w-3 mr-1 inline" /> Hiển thị</>
              ) : (
                <><XCircle className="h-3 w-3 mr-1 inline" /> Ẩn</>
              )}
            </Badge>
          </div>
        );
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
        <div className="text-left text-sm text-gray-600">
          {formatDate(row.original.updatedAt || row.original.createdAt)}
        </div>
      ),
    },
    {
      id: 'actions',
      header: 'Hành động',
      cell: ({ row }: any) => {
        const faq = row.original;
        return (
          <div className="flex items-center justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleView(faq)}>
                  <Eye className="h-4 w-4 mr-2" />
                  Xem chi tiết
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleEdit(faq)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Chỉnh sửa
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleToggleStatus(faq)}>
                  {faq.status ? (
                    <>
                      <XCircle className="h-4 w-4 mr-2" />
                      Ẩn FAQ
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Hiển thị FAQ
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => handleDeleteClick(faq)}
                  className="text-red-600"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Xóa
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: faqs,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quản lý FAQ</h1>
          <p className="text-muted-foreground mt-2">
            Quản lý các câu hỏi thường gặp
          </p>
        </div>
        <Button onClick={handleCreate} size="lg" className="gap-2">
          <Plus className="h-5 w-5" />
          Tạo FAQ Mới
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Bộ lọc
            </CardTitle>
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Xóa bộ lọc
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Trạng thái</label>
              <select
                value={status}
                onChange={(e) => setQuery({ status: e.target.value, page: 0 })}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="">Tất cả</option>
                <option value="true">Đang hiển thị</option>
                <option value="false">Đã ẩn</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {faqs.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <h3 className="text-lg font-semibold mb-2">Chưa có FAQ</h3>
            <p className="text-muted-foreground mb-6 text-center max-w-md">
              Bắt đầu bằng cách tạo FAQ mới
            </p>
            <Button onClick={handleCreate} className="gap-2">
              <Plus className="h-4 w-4" />
              Tạo FAQ Đầu Tiên
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
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
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4">
              <UIPaginationResuft
                currentPage={page + 1}
                totalPage={totalPages}
                totalCount={totalElements}
              />
              <UIPagination
                currentPage={page + 1}
                totalPage={totalPages}
                onChange={(newPage: number) => setQuery({ page: newPage - 1 })}
              />
            </div>
          )}
        </>
      )}

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa FAQ</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa FAQ này? Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDeleteDialogOpen(false);
                setSelectedFAQ(null);
              }}
              disabled={isDeleting}
            >
              Hủy
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
            >
              {isDeleting ? 'Đang xóa...' : 'Xóa'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

