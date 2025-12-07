"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/core/shadcn/components/ui/table";
import { Button } from "@/core/shadcn/components/ui/button";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { UIPagination, UIPaginationResuft } from "@/core/ui/UIPagination";
import {
  SquarePen,
  Trash2,
  ArrowUp,
  ArrowDown,
  ToggleLeft,
  ToggleRight,
  Plus,
} from "lucide-react";
import { useAppNavigation } from "@/common/hooks";
import {
  useFetchPromotionsQuery,
  useDeletePromotionMutation,
  useTogglePromotionStatusMutation,
} from "@/lib/services/modules/promotionService";
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { routerApp } from "@/router";
import {
  getStatusEnumString,
  getStatusEnumStringWithAll,
} from "@/common/utils/statusOption";
import { useModal } from "@/common/hooks/useModal";
import { UISingleSelect } from "@/core/ui/UISingleSelect";
import { EStatusEnumString } from "@/common/enums/status";
import { ESize } from "@/core/ui/Helpers/UIsize.enum";
import { formatLocalDateTime } from "@/common/utils/formatDateToVN";
import React from "react";

const PromotionTable: React.FC = () => {
  const router = useRouter();
  const { getRouteWithRole } = useAppNavigation();
  const { Modal, openModal } = useModal();
  const [queryStates, setQueryStates] = useQueryStates({
    page: parseAsInteger.withDefault(0),
    status: parseAsString.withDefault(""),
    sortBy: parseAsString.withDefault("id"),
    sortDir: parseAsString.withDefault("desc"),
  });

  const { data, refetch } = useFetchPromotionsQuery(
    {
      page: queryStates.page,
      size: 10,
      sortBy: queryStates.sortBy || "id",
      sortDir:
        queryStates.sortDir === "asc" || queryStates.sortDir === "desc"
          ? queryStates.sortDir
          : undefined,
      status: queryStates.status || undefined,
    },
    { refetchOnMountOrArgChange: true }
  );

  const [deletePromotion, { isLoading: isDeleting }] =
    useDeletePromotionMutation();
  const [togglePromotionStatus, { isLoading: isToggling }] =
    useTogglePromotionStatusMutation();

  const handlePageChange = (newPage: number) => {
    setQueryStates((prev) => ({
      ...prev,
      page: newPage - 1,
    }));
  };

  const handleStatusChange = (status: { value: string; label: string }) => {
    setQueryStates((prev) => ({
      ...prev,
      status: (status.value as EStatusEnumString) || "",
      page: 0,
    }));
  };

  const handleSortChange = (column: string) => {
    setQueryStates((prev) => ({
      ...prev,
      sortBy: column,
      sortDir:
        prev.sortBy === column && prev.sortDir === "asc" ? "desc" : "asc",
    }));
  };

  const getSortIcon = (column: string) => {
    if (queryStates.sortBy !== column) {
      return null;
    }
    return queryStates.sortDir === "asc" ? (
      <ArrowUp className="inline-block w-3 h-3 ml-1" />
    ) : (
      <ArrowDown className="inline-block w-3 h-3 ml-1" />
    );
  };

  const handleDeleteClick = (promotionId: number) => {
    openModal({
      title: "Bạn có chắc chắn muốn xóa chương trình khuyến mãi này không?",
      description: "Hành động này không thể hoàn tác.",
      onSubmit: () => handleDelete(promotionId),
      submitClassName: "w-[100px] bg-[#4CD596]",
      dialogContentProps: {
        className: "max-w-md",
      },
    });
  };

  const handleToggleStatusClick = (
    promotionId: number,
    currentStatus: EStatusEnumString
  ) => {
    const newStatus =
      currentStatus === EStatusEnumString.ACTIVE ? "vô hiệu hóa" : "kích hoạt";
    openModal({
      title: `Bạn có chắc chắn muốn ${newStatus} chương trình khuyến mãi này không?`,
      description: "Bạn có thể thay đổi trạng thái này bất cứ lúc nào.",
      onSubmit: () => handleToggleStatus(promotionId),
      submitClassName: "w-[100px] bg-[#4CD596]",
      dialogContentProps: {
        className: "max-w-md",
      },
    });
  };

  const handleDelete = async (id: number) => {
    try {
      await deletePromotion(id).unwrap();
      toast.success("Đã xóa thành công chương trình khuyến mãi");
      refetch();
    } catch (error: any) {
      toast.error(
        "Đã xảy ra lỗi khi xóa chương trình khuyến mãi: " + error.message
      );
    }
  };

  const handleToggleStatus = async (id: number) => {
    try {
      await togglePromotionStatus(id).unwrap();
      toast.success("Đã cập nhật trạng thái chương trình khuyến mãi");
      refetch();
    } catch (error: any) {
      toast.error("Đã xảy ra lỗi khi cập nhật trạng thái: " + error.message);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const getStatusColor = (status: EStatusEnumString) => {
    switch (status) {
      case EStatusEnumString.ACTIVE:
        return "text-green-600";
      case EStatusEnumString.INACTIVE:
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const columns = [
    {
      accessorKey: "id",
      header: () => (
        <div
          className="cursor-pointer flex items-center"
          onClick={() => handleSortChange("id")}
        >
          ID {getSortIcon("id")}
        </div>
      ),
      meta: { width: "w-[80px]" },
      cell: ({ row }: any) => <div>{row.getValue("id")}</div>,
    },
    {
      accessorKey: "name",
      header: () => (
        <div
          className="cursor-pointer flex items-center"
          onClick={() => handleSortChange("name")}
        >
          Tên chương trình {getSortIcon("name")}
        </div>
      ),
      meta: { width: "w-[200px]" },
      cell: ({ row }: any) => (
        <div className="font-medium text-blue-600 text-left">
          {row.getValue("name")}
        </div>
      ),
    },
    {
      accessorKey: "title",
      header: "Tiêu đề",
      meta: { width: "w-[200px]" },
      cell: ({ row }: any) => (
        <div className="line-clamp-2 text-left">{row.getValue("title")}</div>
      ),
    },
    {
      accessorKey: "code",
      header: () => (
        <div
          className="cursor-pointer flex items-center"
          onClick={() => handleSortChange("code")}
        >
          Mã khuyến mãi {getSortIcon("code")}
        </div>
      ),
      meta: { width: "w-[150px]" },
      cell: ({ row }: any) => {
        const code = row.getValue("code");
        return (
          <div className="font-medium text-purple-600">{code || "N/A"}</div>
        );
      },
    },
    {
      accessorKey: "discountValue",
      header: "Giá trị giảm",
      meta: { width: "w-[120px]" },
      cell: ({ row }: any) => {
        const value = row.getValue("discountValue");
        const type = row.original.discountType;
        return (
          <div className="font-medium">
            {type === "percentage" ? `${value}%` : formatCurrency(value)}
          </div>
        );
      },
    },
    {
      accessorKey: "startDate",
      header: () => (
        <div
          className="cursor-pointer flex items-center"
          onClick={() => handleSortChange("startDate")}
        >
          Ngày bắt đầu {getSortIcon("startDate")}
        </div>
      ),
      meta: { width: "w-[120px]" },
      cell: ({ row }: any) => {
        const startDate = row.getValue("startDate");
        if (!startDate) return <div></div>;
        const date = new Date(startDate);
        return (
          <div>
            {date.toLocaleDateString("vi-VN", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        );
      },
    },
    {
      accessorKey: "endDate",
      header: () => (
        <div
          className="cursor-pointer flex items-center"
          onClick={() => handleSortChange("endDate")}
        >
          Ngày kết thúc {getSortIcon("endDate")}
        </div>
      ),
      meta: { width: "w-[120px]" },
      cell: ({ row }: any) => {
        const endDate = row.getValue("endDate");
        if (!endDate) return <div></div>;
        const date = new Date(endDate);
        return (
          <div>
            {date.toLocaleDateString("vi-VN", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: () => (
        <div
          className="cursor-pointer flex items-center"
          onClick={() => handleSortChange("status")}
        >
          Trạng thái {getSortIcon("status")}
        </div>
      ),
      meta: { width: "w-[120px]" },
      cell: ({ row }: any) => {
        const status = row.getValue("status");
        const statusLabel =
          getStatusEnumStringWithAll().find((item) => item.value === status)
            ?.label || "";
        return (
          <div className={`font-medium ${getStatusColor(status)}`}>
            {statusLabel}
          </div>
        );
      },
    },
    {
      id: "actions",
      header: () => <div className="text-center">Hành động</div>,
      meta: { width: "w-[200px]" },
      cell: ({ row }: any) => {
        const id = row.getValue("id");
        const status = row.original.status;
        const isActive = status === EStatusEnumString.ACTIVE;
        const isPendingStart = status === EStatusEnumString.PENDING_START;

        return (
          <div className="flex gap-2 justify-end">
            <Button
              className="bg-outline hover:bg-outline-hover"
              size="sm"
              onClick={() =>
                router.push(
                  getRouteWithRole(routerApp.promotion.formEdit({ id }))
                )
              }
            >
              <SquarePen className="w-4 h-4 text-black" />
            </Button>
            {!isPendingStart && (
              <Button
                className={`${isActive ? "bg-red-100 hover:bg-red-200" : "bg-green-100 hover:bg-green-200"}`}
                size="sm"
                disabled={isToggling}
                onClick={() => handleToggleStatusClick(id, status)}
                title={isActive ? "Vô hiệu hóa" : "Kích hoạt"}
              >
                {isActive ? (
                  <ToggleRight className="w-4 h-4 text-red-600" />
                ) : (
                  <ToggleLeft className="w-4 h-4 text-green-600" />
                )}
              </Button>
            )}
            <Button
              className="bg-red-100 hover:bg-red-200"
              size="sm"
              disabled={isDeleting}
              onClick={() => handleDeleteClick(id)}
            >
              <Trash2 className="w-4 h-4 text-red-600" />
            </Button>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: data?.content || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="mb-6">
        <div className="bg-gradient-to-r from-pink-600 to-pink-700 rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">Quản lý chương trình khuyến mãi</h1>
            <Button
              onClick={() => router.push(getRouteWithRole(routerApp.promotion.form))}
              className="flex items-center gap-2 bg-white hover:bg-gray-100 text-pink-700 font-medium shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm chương trình khuyến mãi</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="mb-5 flex items-center gap-4">
        <div className="w-[200px]">
          <UISingleSelect
            options={[
              { value: "", label: "Tất cả trạng thái" },
              ...getStatusEnumString(),
            ]}
            selected={
              queryStates.status
                ? {
                    value: queryStates.status,
                    label:
                      getStatusEnumString().find(
                        (item) => item.value === queryStates.status
                      )?.label || "",
                  }
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
                    const widthClass =
                      (header.column.columnDef.meta as any)?.width ?? "";
                    return (
                      <TableHead
                        key={header.id}
                        className={`bg-gradient-to-b from-gray-100 to-gray-50 font-semibold text-gray-700 py-4 px-4 border-r last:border-r-0 ${widthClass}`}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
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
                    className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-pink-50 hover:to-transparent transition-all duration-200"
                  >
                    {row.getVisibleCells().map((cell) => {
                      const widthClass =
                        (cell.column.columnDef.meta as any)?.width ?? "";
                      const isActionsColumn = cell.column.id === "actions";
                      return (
                        <TableCell
                          key={cell.id}
                          className={`py-4 px-4 border-r last:border-r-0 ${widthClass} ${isActionsColumn ? "text-right" : ""}`}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-48 text-center"
                  >
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

        {data?.totalPages && data.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-white">
            <UIPaginationResuft
              currentPage={queryStates.page + 1}
              totalCount={data?.totalItems || 0}
              totalPage={data?.totalPages || 1}
            />
            <UIPagination
              currentPage={queryStates.page + 1}
              totalPage={data?.totalPages || 1}
              onChange={handlePageChange}
              displayPage={5}
            />
          </div>
        )}
      </div>
      <Modal />
    </div>
  );
};

export default PromotionTable;
