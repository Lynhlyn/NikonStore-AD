'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/core/shadcn/components/ui/table";
import { Button } from "@/core/shadcn/components/ui/button";
import { Input } from "@/core/shadcn/components/ui/input";
import { flexRender, getCoreRowModel, getPaginationRowModel, useReactTable } from "@tanstack/react-table";
import { SquarePen, Plus, ArrowUp, ArrowDown, Loader2, Search } from "lucide-react";
import { useAppNavigation, useDebounce } from "@/common/hooks";
import { useFetchStaffsQuery, useDeleteStaffMutation } from "@/lib/services/modules/staffService";
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { routerApp } from "@/router";
import { getStatusEnumString } from "@/common/utils/statusOption";
import { UISingleSelect } from "@/core/ui/UISingleSelect";
import { EStatusEnumString } from "@/common/enums/status";
import { ESize } from "@/core/ui/Helpers/UIsize.enum";
import { EUserRole } from "@/common/enums/role";
import { ConfirmModal } from "@/common/components/ConfirmModal";
import { useState } from "react";

const StaffTable = () => {
  const router = useRouter();
  const { getRouteWithRole } = useAppNavigation();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedStaffId, setSelectedStaffId] = useState<number | null>(null);
  
  const [queryStates, setQueryStates] = useQueryStates({
    page: parseAsInteger.withDefault(0),
    keyword: parseAsString.withDefault(""),
    role: parseAsString.withDefault(""),
    status: parseAsString.withDefault(""),
    sort: parseAsString.withDefault("id"),
    direction: parseAsString.withDefault("desc"),
  });

  const debouncedKeyword = useDebounce(queryStates.keyword, 500);

  const { data, refetch } = useFetchStaffsQuery({
    page: queryStates.page,
    size: 10,
    sort: queryStates.sort,
    direction: (queryStates.direction === "asc" || queryStates.direction === "desc") ? queryStates.direction : undefined,
    fullName: debouncedKeyword || undefined,
    phoneNumber: debouncedKeyword || undefined,
    role: queryStates.role || undefined,
    status: queryStates.status as EStatusEnumString || undefined,
  }, { refetchOnMountOrArgChange: true });

  const [deleteStaff, { isLoading: isDeleting }] = useDeleteStaffMutation();

  const handlePageChange = (newPage: number) => {
    setQueryStates((prev) => ({
      ...prev,
      page: newPage - 1,
    }));
  };

  const handleKeywordChange = (value: string) => {
    setQueryStates((prev) => ({
      ...prev,
      keyword: value,
      page: 0,
    }));
  };

  const handleRoleChange = (role: { value: string; label: string }) => {
    setQueryStates((prev) => ({
      ...prev,
      role: role.value || "",
      page: 0,
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

  const handleDeleteClick = (staffId: number) => {
    setSelectedStaffId(staffId);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedStaffId) return;
    try {
      await deleteStaff(selectedStaffId).unwrap();
      toast.success("Đã xóa nhân viên thành công");
      refetch();
      setDeleteModalOpen(false);
      setSelectedStaffId(null);
    } catch (error: any) {
      toast.error("Lỗi khi xóa nhân viên: " + error.message);
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

  const roleOptions = [
    { label: 'Quản lý', value: EUserRole.ADMIN },
    { label: 'Nhân viên', value: EUserRole.STAFF },
  ];

  const roleFilterOptions = [
    { value: "", label: "Tất cả vai trò" },
    ...roleOptions
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
      accessorKey: "fullName",
      header: "Họ tên",
      cell: ({ row }: any) => <div className="text-left font-medium">{row.getValue("fullName")}</div>,
    },
    {
      accessorKey: "phoneNumber",
      header: "SĐT",
      cell: ({ row }: any) => <div className="text-left">{row.getValue("phoneNumber")}</div>,
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }: any) => <div className="text-left">{row.getValue("email")}</div>,
    },
    {
      accessorKey: "role",
      header: "Vai trò",
      cell: ({ row }: any) => {
        const value = row.getValue("role");
        const roleLabel = roleOptions.find(option => option.value === value)?.label || value;
        return <div className="text-left font-medium">{roleLabel}</div>;
      },
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
      cell: ({ row }: any) => <div className="text-left">{getStatusEnumString().find(item => item.value === row.getValue("status"))?.label || row.getValue("status")}</div>,
    },
    {
      accessorKey: "updatedAt",
      header: "Ngày cập nhật",
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
              onClick={() => router.push(getRouteWithRole(routerApp.staff.formEdit({ id })))}
            >
              <SquarePen className="w-4 h-4" />
            </Button>
            {/* <Button
              variant="outline"
              size="sm"
              onClick={() => handleDeleteClick(id)}
              className="text-red-600 hover:text-red-700 hover:border-red-300"
            >
              Xóa
            </Button> */}
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
        <div className="bg-gradient-to-r from-sky-600 to-sky-700 rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">Quản lý nhân viên</h1>
            <Button
              onClick={() => router.push(getRouteWithRole(routerApp.staff.form))}
              className="flex items-center gap-2 bg-white hover:bg-gray-100 text-sky-700 font-medium shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm nhân viên</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="mb-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="relative flex-1 w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Tìm kiếm theo họ tên hoặc số điện thoại..."
            value={queryStates.keyword}
            onChange={(e) => handleKeywordChange(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border-gray-300 focus:border-sky-500 focus:ring-sky-500"
          />
        </div>
        <div className="w-full sm:w-[200px]">
          <UISingleSelect
            options={roleFilterOptions}
            selected={
              queryStates.role
                ? roleFilterOptions.find(item => item.value === queryStates.role) || roleFilterOptions[0]
                : roleFilterOptions[0]
            }
            onChange={(selected) => handleRoleChange(selected as { value: string; label: string })}
            className="rounded-md border border-gray-300"
            size={ESize.M}
            renderSelected={(props) => <UISingleSelect.Selected {...props} />}
            renderOption={(props) => <UISingleSelect.Option {...props} />}
          />
        </div>
        <div className="w-full sm:w-[200px]">
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

      {isLoading ? (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-12">
          <div className="flex flex-col items-center justify-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-sky-600" />
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
                      className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-sky-50 hover:to-transparent transition-all duration-200"
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

      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setSelectedStaffId(null);
        }}
        onConfirm={handleDelete}
        title="Xác nhận xóa nhân viên"
        message="Bạn có chắc chắn muốn xóa nhân viên này không? Hành động này không thể hoàn tác."
        type="danger"
        isLoading={isDeleting}
        confirmText="Xóa"
        cancelText="Hủy"
      />
    </div>
  );
};

export default StaffTable;

