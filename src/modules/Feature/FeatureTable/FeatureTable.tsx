'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/core/shadcn/components/ui/table";
import { Button } from "@/core/shadcn/components/ui/button";
import { flexRender, getCoreRowModel, getPaginationRowModel, useReactTable } from "@tanstack/react-table";
import { SquarePen, ArrowUp, ArrowDown, Plus } from "lucide-react";
import { useAppNavigation } from "@/common/hooks";
import { useFetchFeaturesQuery, useDeleteFeatureMutation } from "@/lib/services/modules/featureService";
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ConfirmModal } from "@/common/components/ConfirmModal";
import { useState } from "react";

const FeatureTable = () => {
  const router = useRouter();
  const { getRouteWithRole } = useAppNavigation();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedFeatureId, setSelectedFeatureId] = useState<number | null>(null);
  
  const [queryStates, setQueryStates] = useQueryStates({
    page: parseAsInteger.withDefault(0),
    sort: parseAsString.withDefault("id"),
    direction: parseAsString.withDefault("desc"),
  });

  const { data, refetch } = useFetchFeaturesQuery({
    page: queryStates.page,
    isAll: false,
    size: 10,
    sort: queryStates.sort,
    direction: (queryStates.direction === "asc" || queryStates.direction === "desc") ? queryStates.direction : undefined,
  }, { refetchOnMountOrArgChange: true });

  const [deleteFeature, { isLoading: isDeleting }] = useDeleteFeatureMutation();

  const handlePageChange = (newPage: number) => {
    setQueryStates((prev) => ({
      ...prev,
      page: newPage - 1,
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

  const handleDeleteClick = (featureId: number) => {
    setSelectedFeatureId(featureId);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedFeatureId) return;
    try {
      await deleteFeature(selectedFeatureId).unwrap();
      toast.success('Đã xóa thành công tính năng');
      refetch();
      setDeleteModalOpen(false);
      setSelectedFeatureId(null);
    } catch (error: any) {
      toast.error('Đã xảy ra lỗi khi xóa tính năng: ' + error.message);
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
          Tên tính năng {getSortIcon("name")}
        </div>
      ),
      cell: ({ row }: any) => <div className="text-left font-medium">{row.getValue("name")}</div>,
    },
    {
      accessorKey: "description",
      header: () => <div className="flex items-center text-left">Mô tả</div>,
      cell: ({ row }: any) => <div className="text-left text-sm text-gray-600 line-clamp-2">{row.getValue("description") || "-"}</div>,
    },
    {
      accessorKey: "featureGroup",
      header: () => (
        <div
          className="cursor-pointer flex items-center text-left"
          onClick={() => handleSortChange("featureGroup")}
        >
          Nhóm tính năng {getSortIcon("featureGroup")}
        </div>
      ),
      cell: ({ row }: any) => <div className="text-left text-sm text-gray-600">{row.getValue("featureGroup") || "-"}</div>,
    },
    {
      accessorKey: "createdAt",
      header: () => (
        <div
          className="cursor-pointer flex items-center text-left"
          onClick={() => handleSortChange("createdAt")}
        >
          Ngày tạo {getSortIcon("createdAt")}
        </div>
      ),
      cell: ({ row }: any) => <div className="text-left text-sm text-gray-600">{formatDate(row.getValue("createdAt"))}</div>,
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
              onClick={() => router.push(getRouteWithRole(`/features/${id}/edit`))}
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
        <h1 className="text-2xl font-semibold text-gray-900">Quản lý tính năng</h1>
        <Button
          onClick={() => router.push(getRouteWithRole('/features/new'))}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm tính năng</span>
        </Button>
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
          setSelectedFeatureId(null);
        }}
        onConfirm={handleDelete}
        title="Xác nhận xóa tính năng"
        message="Bạn có chắc chắn muốn xóa tính năng này không? Hành động này không thể hoàn tác."
        type="danger"
        isLoading={isDeleting}
        confirmText="Xóa"
        cancelText="Hủy"
      />
    </div>
  );
};

export default FeatureTable;

