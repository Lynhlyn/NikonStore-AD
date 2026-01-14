'use client';

import { Plus } from "lucide-react";
import { EStatusEnumString } from "@/common/enums/status";
import { useAppNavigation, useModal } from "@/common/hooks";
import { getSimpleError } from "@/common/utils/handleForm";
import { getStatusColor } from "@/common/utils/statusColor";
import { getStatusEnumStringWithAll } from "@/common/utils/statusOption";
import { Button } from "@/core/shadcn/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/core/shadcn/components/ui/table";
import { ESize } from "@/core/ui/Helpers/UIsize.enum";
import { UIPagination, UIPaginationResuft } from "@/core/ui/UIPagination";
import { UISingleSelect } from "@/core/ui/UISingleSelect";
import { useDeleteVoucherMutation, useFetchVouchersQuery } from "@/lib/services/modules/voucherService";
import { CustomerManagementModal } from "@/modules/Voucher/VoucherForm/components/CustomerManagementModal";
import { routerApp } from "@/router";
import { flexRender, getCoreRowModel, getPaginationRowModel, useReactTable } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, Eye, SquarePen, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";
import { useState } from "react";
import { toast } from "sonner";

const VoucherTable = () => {
  const router = useRouter();
  const { getRouteWithRole } = useAppNavigation();
  const { Modal, openModal } = useModal();
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [selectedVoucherId, setSelectedVoucherId] = useState<number | null>(null);
  const [selectedVoucherCode, setSelectedVoucherCode] = useState<string | null>(null);

  const [queryStates, setQueryStates] = useQueryStates({
    page: parseAsInteger.withDefault(0),
    status: parseAsString.withDefault(""),
    sortBy: parseAsString.withDefault("id"),
    sortDir: parseAsString.withDefault("desc"),
  });

  const { data, refetch } = useFetchVouchersQuery({
    page: queryStates.page,
    isAll: false,
    size: 10,
    sortBy: queryStates.sortBy || "id",
    sortDir: (queryStates.sortDir === "asc" || queryStates.sortDir === "desc") ? queryStates.sortDir : undefined,
    status: queryStates.status || undefined,
  }, {
    refetchOnMountOrArgChange: true,
    pollingInterval: 60000,
  });

  const [deleteVoucher, { isLoading: isDeleting }] = useDeleteVoucherMutation();

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
      sortBy: column,
      sortDir: prev.sortBy === column && prev.sortDir === "asc" ? "desc" : "asc",
    }));
  };

  const getSortIcon = (column: string) => {
    if (queryStates.sortBy !== column) {
      return null;
    }
    return queryStates.sortDir === "asc" ?
      <ArrowUp className="inline-block w-3 h-3 ml-1" /> :
      <ArrowDown className="inline-block w-3 h-3 ml-1" />;
  };

  const handleDeleteClick = (voucherId: number) => {
    openModal({
      title: "Bạn có chắc chắn muốn xóa voucher này không?",
      description: "Hành động này không thể hoàn tác.",
      onSubmit: () => handleDelete(voucherId),
      submitClassName: "w-[100px] bg-[#4CD596]",
      dialogContentProps: {
        className: "max-w-md",
      }
    });
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteVoucher(id).unwrap();
      toast.success('Đã xóa thành công voucher');
      refetch();
    } catch (error: any) {
      const errorMessage = getSimpleError(error);
      toast.error(errorMessage);
    }
  };

  const handleCustomerModalOpen = (voucherId: number, voucherCode: string) => {
    setSelectedVoucherId(voucherId);
    setSelectedVoucherCode(voucherCode);
    setIsCustomerModalOpen(true);
  };

  const handleCustomerModalClose = () => {
    setIsCustomerModalOpen(false);
    setSelectedVoucherId(null);
    setSelectedVoucherCode(null);
    refetch();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const columns = [
    {
      accessorKey: "id",
      header: "ID",
      meta: { width: "w-[80px]" },
    },
    {
      accessorKey: "code",
      header: () => (
        <div className="cursor-pointer" onClick={() => handleSortChange("code")}>
          Mã voucher {getSortIcon("code")}
        </div>
      ),
      meta: { width: "w-[150px]" },
    },
    {
      accessorKey: "description",
      header: "Mô tả",
      meta: { width: "w-[200px]" },
      cell: ({ row }: any) => (
        <div className="truncate max-w-[200px]" title={row.getValue("description")}>
          {row.getValue("description") || "Không có mô tả"}
        </div>
      ),
    },
    {
      accessorKey: "quantity",
      header: () => (
        <div className="cursor-pointer" onClick={() => handleSortChange("quantity")}>
          Số lượng {getSortIcon("quantity")}
        </div>
      ),
      meta: { width: "w-[150px]" },
      cell: ({ row }: any) => {
        const quantity = row.original.quantity;
        const usedCount = row.original.usedCount || 0;
        const remaining = quantity - usedCount;
        return (
          <div className="flex flex-col">
            <span className="font-medium">{quantity}</span>
            <span className={`text-xs ${remaining > 0 ? 'text-green-600' : 'text-red-600'}`}>
              (còn lại: {remaining})
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "discountValue",
      header: () => (
        <div className="cursor-pointer" onClick={() => handleSortChange("discountValue")}>
          Giá trị giảm {getSortIcon("discountValue")}
        </div>
      ),
      meta: { width: "w-[120px]" },
      cell: ({ row }: any) => {
        const discountType = row.original.discountType;
        const discountValue = row.original.discountValue;
        return (
          <div>
            {discountType === "percentage" ? `${discountValue}%` : formatCurrency(discountValue)}
          </div>
        );
      },
    },
    {
      accessorKey: "usedCount",
      header: () => (
        <div className="cursor-pointer" onClick={() => handleSortChange("usedCount")}>
          Đã sử dụng {getSortIcon("usedCount")}
        </div>
      ),
      meta: { width: "w-[100px]" },
    },
    {
      accessorKey: "status",
      header: () => (
        <div className="cursor-pointer" onClick={() => handleSortChange("status")}>
          Trạng thái {getSortIcon("status")}
        </div>
      ),
      meta: { width: "w-[140px]" },
      cell: ({ row }: any) => {
        const status = row.getValue("status");
        const statusLabel = getStatusEnumStringWithAll().find(item => item.value === status)?.label || "";
        return (
          <div className={`font-medium ${getStatusColor(status as EStatusEnumString)}`}>
            {statusLabel}
          </div>
        );
      },
    },
    {
      accessorKey: "isPublic",
      header: "Công khai",
      meta: { width: "w-[80px]" },
      cell: ({ row }: any) => (
        <div>
          {row.getValue("isPublic") ? "Có" : "Không"}
        </div>
      ),
    },
    {
      id: "actions",
      header: "Hành động",
      meta: { width: "w-[140px]" },
      cell: ({ row }: any) => {
        const id = row.getValue("id");
        const isPublic = row.getValue("isPublic");
        const code = row.getValue("code");
        const endDate = row.original.endDate;
        const isExpired = endDate ? new Date(endDate) < new Date() || row.getValue("status") === EStatusEnumString.INACTIVE : row.getValue("status") === EStatusEnumString.INACTIVE;

        return (
          <div className="flex gap-2 justify-end">
            {!isPublic && (
              <Button
                onClick={() => handleCustomerModalOpen(id, code)}
                title="Quản lý khách hàng"
              >
                <Users className="w-4 h-4 text-white" />
              </Button>
            )}
            <Button
              className="bg-outline hover:bg-outline-hover"
              onClick={() => router.push(getRouteWithRole(routerApp.voucher.formView({ id })))}
              title="Xem voucher"
            >
              <Eye className="w-4 h-4 text-black" />
            </Button>
            {!isExpired && (
              <Button
                className="bg-outline hover:bg-outline-hover"
                onClick={() => router.push(getRouteWithRole(routerApp.voucher.formEdit({ id })))}
                title="Chỉnh sửa"
              >
                <SquarePen className="w-4 h-4 text-black" />
              </Button>
            )}
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
        <div className="bg-gradient-to-r from-orange-600 to-orange-700 rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">Quản lý voucher</h1>
            <div className="flex gap-3">
              <Button
                className="bg-gray-600 hover:bg-gray-700 text-white"
                onClick={() => refetch()}
                title="Làm mới dữ liệu"
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span className="ml-2">Làm mới</span>
              </Button>
              <Button
                onClick={() => router.push(getRouteWithRole(routerApp.voucher.form))}
                className="flex items-center gap-2 bg-white hover:bg-gray-100 text-orange-700 font-medium shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Thêm voucher</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-5 flex items-center gap-4">
        <div className="w-[200px]">
          <UISingleSelect
            options={[
              { value: "", label: "Tất cả trạng thái" },
              ...getStatusEnumStringWithAll()
            ]}
            selected={
              queryStates.status
                ? { value: queryStates.status, label: getStatusEnumStringWithAll().find(item => item.value === queryStates.status)?.label || "" }
                : { value: "", label: "Tất cả trạng thái" }
            }
            onChange={handleStatusChange}
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
                  {headerGroup.headers.map((header) => {
                    const widthClass = (header.column.columnDef.meta as any)?.width ?? "";
                    const isActionsColumn = header.id === "actions";
                    return (
                      <TableHead
                        key={header.id}
                        className={`bg-gradient-to-b from-gray-100 to-gray-50 font-semibold text-gray-700 py-4 px-4 border-r last:border-r-0 ${widthClass} ${isActionsColumn ? 'text-right' : ''}`}
                      >
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow 
                    key={row.id}
                    className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-orange-50 hover:to-transparent transition-all duration-200"
                  >
                    {row.getVisibleCells().map((cell) => {
                      const widthClass = (cell.column.columnDef.meta as any)?.width ?? "";
                      const isActionsColumn = cell.column.id === "actions";
                      return (
                        <TableCell
                          key={cell.id}
                          className={`py-4 px-4 border-r last:border-r-0 ${widthClass} ${isActionsColumn ? 'text-right' : ''}`}
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-48 text-center">
                    <div className="flex flex-col items-center justify-center space-y-3 py-8">
                      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                        <ArrowUp className="h-8 w-8 text-gray-400" />
                      </div>
                      <p className="text-sm font-medium text-gray-500">Không có kết quả nào</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {data?.pagination && data.pagination.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-white">
            <UIPaginationResuft
              currentPage={queryStates.page + 1}
              totalCount={data?.pagination?.totalElements || 0}
              totalPage={data?.pagination?.totalPages || 1}
            />
            <UIPagination
              currentPage={queryStates.page + 1}
              totalPage={data?.pagination?.totalPages || 1}
              onChange={handlePageChange}
              displayPage={5}
            />
          </div>
        )}
      </div>

      <Modal />

      {selectedVoucherId && (
        <CustomerManagementModal
          isOpen={isCustomerModalOpen}
          onClose={handleCustomerModalClose}
          voucherId={selectedVoucherId}
          voucherCode={selectedVoucherCode || undefined}
        />
      )}
    </div>
  );
};

export default VoucherTable;

