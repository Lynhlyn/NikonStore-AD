'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/core/shadcn/components/ui/table";
import { Button } from "@/core/shadcn/components/ui/button";
import { flexRender, getCoreRowModel, getPaginationRowModel, useReactTable } from "@tanstack/react-table";
import { SquarePen, ArrowUp, ArrowDown, Plus } from "lucide-react";
import { useAppNavigation } from "@/common/hooks";
import { useFetchTagsQuery, useDeleteTagMutation } from "@/lib/services/modules/tagService";
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

const TagTable = () => {
  const router = useRouter();
  const { getRouteWithRole } = useAppNavigation();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedTagId, setSelectedTagId] = useState<number | null>(null);
  
  const [queryStates, setQueryStates] = useQueryStates({
    page: parseAsInteger.withDefault(0),
    status: parseAsString.withDefault(""),
    sort: parseAsString.withDefault("id"),
    direction: parseAsString.withDefault("desc"),
  });

  const { data, refetch } = useFetchTagsQuery({
    page: queryStates.page,
    isAll: false,
    size: 10,
    sort: queryStates.sort,
    direction: (queryStates.direction === "asc" || queryStates.direction === "desc") ? queryStates.direction : undefined,
    status: queryStates.status as EStatusEnumString || undefined,
  }, { refetchOnMountOrArgChange: true });

  const [deleteTag, { isLoading: isDeleting }] = useDeleteTagMutation();

  const handlePageChange = (newPage: number) => {
    setQueryStates((prev) => ({
      ...prev,
      page: newPage - 1,
    }));
  };

  const handleStatusChange = (status: { value: string; label: string }) => {
    setQueryStates((prev) => ({
      ...prev, 
      status: status.value as EStatusEnumString || "",
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

  const handleDeleteClick = (tagId: number) => {
    setSelectedTagId(tagId);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedTagId) return;
    try {
      await deleteTag(selectedTagId).unwrap();
      toast.success('Đã xóa thành công thẻ');
      refetch();
      setDeleteModalOpen(false);
      setSelectedTagId(null);
    } catch (error: any) {
      toast.error('Đã xảy ra lỗi khi xóa thẻ: ' + error.message);
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
          Tên thẻ {getSortIcon("name")}
        </div>
      ),
      cell: ({ row }: any) => <div className="text-left font-medium">{row.getValue("name")}</div>,
    },
    {
      accessorKey: "slug",
      header: () => (
        <div
          className="cursor-pointer flex items-center text-left"
          onClick={() => handleSortChange("slug")}
        >
          Slug {getSortIcon("slug")}
        </div>
      ),
      cell: ({ row }: any) => <div className="text-left text-sm font-mono text-gray-600">{row.getValue("slug")}</div>,
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
      accessorKey: "updatedAt",
      header: () => (
        <div
          className="cursor-pointer flex items-center text-left"
          onClick={() => handleSortChange("updatedAt")}
        >
          Ngày cập nhật {getSortIcon("updatedAt")}
        </div>
      ),
      cell: ({ row }: any) => <div className="text-left text-sm text-gray-600">{formatDate(row.getValue("updatedAt"))}</div>,
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
              onClick={() => router.push(getRouteWithRole(`/tags/${id}/edit`))}
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
    <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="mb-6">
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">Quản lý thẻ</h1>
            <Button
              onClick={() => router.push(getRouteWithRole('/tags/new'))}
              className="flex items-center gap-2 bg-white hover:bg-gray-100 text-indigo-700 font-medium shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm thẻ</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="mb-5 flex items-center gap-4">
        <div className="w-[220px]">
          <UISingleSelect
            options={statusOptions}
            selected={
              queryStates.status
                ? statusOptions.find(item => item.value === queryStates.status) || statusOptions[0]
                : statusOptions[0]
            }
            onChange={(selected) => handleStatusChange(selected as { value: string; label: string })}
            className="rounded-md border border-gray-300"
            size={ESize.M}
            renderSelected={(props) => <UISingleSelect.Selected {...props} />}
            renderOption={(props) => <UISingleSelect.Option {...props} />}
          />
        </div>
      </div>

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
                    className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-transparent transition-all duration-200"
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
                        <ArrowUp className="h-8 w-8 text-gray-400" />
                      </div>
                      <p className="text-sm font-medium text-gray-500">Không có dữ liệu</p>
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

      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setSelectedTagId(null);
        }}
        onConfirm={handleDelete}
        title="Xác nhận xóa thẻ"
        message="Bạn có chắc chắn muốn xóa thẻ này không? Hành động này không thể hoàn tác."
        type="danger"
        isLoading={isDeleting}
        confirmText="Xóa"
        cancelText="Hủy"
      />
    </div>
  );
};

export default TagTable;

