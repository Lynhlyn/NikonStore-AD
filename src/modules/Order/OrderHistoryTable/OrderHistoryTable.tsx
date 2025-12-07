'use client';

import { useAppNavigation } from "@/common/hooks";
import { Badge } from "@/core/shadcn/components/ui/badge";
import { Button } from "@/core/shadcn/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/core/shadcn/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/core/shadcn/components/ui/dropdown-menu";
import { Input } from "@/core/shadcn/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/core/shadcn/components/ui/table";
import { ESize } from "@/core/ui/Helpers/UIsize.enum";
import { UIPagination, UIPaginationResuft } from "@/core/ui/UIPagination";
import { UISingleSelect } from "@/core/ui/UISingleSelect";
import { UITextField } from "@/core/ui/UITextField";
import { useSearchOrderHistoryQuery } from '@/lib/services/modules/orderService';
import { routerApp } from "@/router";
import { flexRender, getCoreRowModel, getPaginationRowModel, useReactTable } from "@tanstack/react-table";
import { Eye, Filter, MoreHorizontal, RotateCcw, Search, Loader2, History } from "lucide-react";
import { useRouter } from "next/navigation";
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";
import { useEffect, useState } from 'react';
import { toast } from "sonner";

const getStatusLabel = (status: number) => {
  const statusMap: { [key: number]: string } = {
    3: 'Chờ xác nhận',
    4: 'Đã xác nhận',
    5: 'Đang giao hàng',
    6: 'Đã hoàn thành',
    7: 'Đã hủy',
    8: 'Chờ thanh toán',
    12: 'Giao hàng thất bại',
    13: 'Đang chuẩn bị hàng'
  };
  return statusMap[status] || 'Không xác định';
};

const getStatusColor = (status: number) => {
  return (
    status === 3 ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
      status === 4 ? 'bg-blue-50 text-blue-700 border-blue-200' :
        status === 5 ? 'bg-orange-50 text-orange-700 border-orange-200' :
          status === 6 ? 'bg-green-50 text-green-700 border-green-200' :
            status === 7 ? 'bg-red-50 text-red-700 border-red-200' :
              status === 8 ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                status === 12 ? 'bg-red-50 text-red-700 border-red-200' :
                  status === 13 ? 'bg-purple-50 text-purple-700 border-purple-200' :
                    'bg-gray-50 text-gray-700 border-gray-200'
  );
};

const OrderHistoryTable = () => {
  const router = useRouter();
  const { getRouteWithRole } = useAppNavigation();

  const [{ page, size, trackingNumber, statusAfter, createdAtFrom, createdAtTo, changeByName, notes, orderType }, setQuery] = useQueryStates({
    page: parseAsInteger.withDefault(0),
    size: parseAsInteger.withDefault(10),
    trackingNumber: parseAsString.withDefault(""),
    statusAfter: parseAsString.withDefault(""),
    createdAtFrom: parseAsString.withDefault(""),
    createdAtTo: parseAsString.withDefault(""),
    changeByName: parseAsString.withDefault(""),
    notes: parseAsString.withDefault(""),
    orderType: parseAsString.withDefault(""),
  });

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const { data: historyResponse, isLoading, refetch } = useSearchOrderHistoryQuery({
    page,
    size,
    trackingNumber: trackingNumber || undefined,
    statusAfter: statusAfter ? parseInt(statusAfter) : undefined,
    createdAtFrom: createdAtFrom || undefined,
    createdAtTo: createdAtTo || undefined,
    changeByName: changeByName || undefined,
    notes: notes || undefined,
    orderType: orderType || undefined,
  }, {
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    refetch();
  }, []);

  const histories = historyResponse?.data || [];
  const totalElements = historyResponse?.pagination?.totalElements || 0;
  const totalPages = historyResponse?.pagination?.totalPages || 0;

  const statusOptions = [
    { value: '', label: 'Tất cả' },
    { value: '3', label: 'Chờ xác nhận' },
    { value: '4', label: 'Đã xác nhận' },
    { value: '5', label: 'Đang giao hàng' },
    { value: '6', label: 'Đã hoàn thành' },
    { value: '7', label: 'Đã hủy' },
    { value: '8', label: 'Chờ thanh toán' },
    { value: '12', label: 'Giao hàng thất bại' },
    { value: '13', label: 'Đang chuẩn bị hàng' }
  ];

  const clearAllFilters = () => {
    setQuery({
      page: 0,
      trackingNumber: "",
      statusAfter: "",
      createdAtFrom: "",
      createdAtTo: "",
      changeByName: "",
      notes: "",
      orderType: "",
    });
    toast.success("Đã xóa tất cả bộ lọc!");
  };

  const hasActiveFilters = trackingNumber !== "" || statusAfter !== "" || createdAtFrom !== "" || createdAtTo !== "" || changeByName !== "" || notes !== "" || orderType !== "";

  const columns = [
    {
      accessorKey: "trackingNumber",
      header: "Mã đơn hàng",
    },
    {
      accessorKey: "orderType",
      header: "Loại đơn",
      cell: ({ row }: any) => row.original.orderType || '-',
    },
    {
      accessorKey: "changeByName",
      header: "Người thay đổi",
      cell: ({ row }: any) => row.original.changeByName || '-',
    },
    {
      accessorKey: "changeByType",
      header: "Loại người dùng",
      cell: ({ row }: any) => row.original.changeByType || '-',
    },
    {
      accessorKey: "statusBefore",
      header: "Trạng thái trước",
      cell: ({ row }: any) => row.original.statusBefore ? (
        <Badge className={`${getStatusColor(row.original.statusBefore)} border font-medium px-2.5 py-0.5 rounded-full`}>
          {getStatusLabel(row.original.statusBefore)}
        </Badge>
      ) : '-',
    },
    {
      accessorKey: "statusAfter",
      header: "Trạng thái sau",
      cell: ({ row }: any) => (
        <Badge className={`${getStatusColor(row.original.statusAfter)} border font-medium px-2.5 py-0.5 rounded-full`}>
          {getStatusLabel(row.original.statusAfter)}
        </Badge>
      ),
    },
    {
      accessorKey: "notes",
      header: "Ghi chú",
      cell: ({ row }: any) => row.original.notes || '-',
    },
    {
      accessorKey: "createdAt",
      header: "Thời gian",
      cell: ({ row }: any) => row.original.createdAt ? new Date(row.original.createdAt).toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-',
    },
    {
      accessorKey: "actions",
      header: "Thao tác",
      cell: ({ row }: any) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-purple-50 hover:text-purple-600">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 border border-gray-200 shadow-lg">
            <DropdownMenuItem 
              onClick={() => {
                router.push(getRouteWithRole(routerApp.order.detail({ id: row.original.orderId.toString() })));
              }}
              className="cursor-pointer hover:bg-purple-50"
            >
              <Eye className="h-4 w-4 mr-2 text-purple-600" />
              <span className="font-medium">Xem đơn hàng</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const table = useReactTable({
    data: histories,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    pageCount: totalPages,
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Đang tải dữ liệu...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <Collapsible open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <History className="h-6 w-6 text-white" />
                  <h2 className="text-2xl font-bold text-white">Lịch sử thay đổi đơn hàng</h2>
                </div>
                <p className="text-sm text-purple-100">
                  {hasActiveFilters && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-500 text-white">
                      Đang áp dụng {Object.values({ trackingNumber, statusAfter, createdAtFrom, createdAtTo, changeByName, notes, orderType }).filter(Boolean).length} bộ lọc
                    </span>
                  )}
                  {!hasActiveFilters && <span className="text-purple-100">Theo dõi tất cả các thay đổi trạng thái đơn hàng</span>}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <CollapsibleTrigger asChild>
                  <Button variant="secondary" size="sm" className="bg-white hover:bg-gray-100 text-purple-700 font-medium shadow-sm">
                    <Filter className="h-4 w-4 mr-2" />
                    {isFilterOpen ? "Ẩn bộ lọc" : "Hiện bộ lọc"}
                  </Button>
                </CollapsibleTrigger>
                {hasActiveFilters && (
                  <Button variant="secondary" size="sm" onClick={clearAllFilters} className="bg-white hover:bg-gray-100 text-purple-700 font-medium shadow-sm">
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Làm mới
                  </Button>
                )}
              </div>
            </div>
          </div>

          <CollapsibleContent>
            <div className="p-6 bg-gradient-to-br from-gray-50 to-purple-50 border-b border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Mã đơn hàng</label>
                  <UITextField
                    placeholder="Nhập mã đơn hàng..."
                    value={trackingNumber}
                    onChange={(e) => setQuery({ trackingNumber: e.target.value, page: 0 })}
                    leftIcon={<Search className="w-4 h-4" />}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Từ ngày</label>
                  <Input
                    type="date"
                    value={createdAtFrom}
                    onChange={(e) => setQuery({ createdAtFrom: e.target.value, page: 0 })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Đến ngày</label>
                  <Input
                    type="date"
                    value={createdAtTo}
                    onChange={(e) => setQuery({ createdAtTo: e.target.value, page: 0 })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Trạng thái sau</label>
                  <UISingleSelect
                    options={statusOptions.map(opt => ({ value: opt.value, label: opt.label }))}
                    value={statusAfter}
                    onChange={(value: { value: string; label: string } | null) => setQuery({ statusAfter: value?.value || "", page: 0 })}
                    placeholder="Tất cả trạng thái"
                    textFieldSize={ESize.M}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Người thay đổi</label>
                  <UITextField
                    placeholder="Nhập tên người thay đổi..."
                    value={changeByName}
                    onChange={(e) => setQuery({ changeByName: e.target.value, page: 0 })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Loại đơn hàng</label>
                  <UISingleSelect
                    options={[
                      { value: '', label: 'Tất cả' },
                      { value: 'ONLINE', label: 'Online' },
                      { value: 'IN_STORE', label: 'Tại quầy' },
                    ]}
                    value={orderType}
                    onChange={(value: { value: string; label: string } | null) => setQuery({ orderType: value?.value || "", page: 0 })}
                    placeholder="Tất cả loại đơn"
                    textFieldSize={ESize.M}
                  />
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        <div className="border-t border-gray-200 overflow-x-auto">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="border-b border-gray-200 hover:bg-transparent">
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className="bg-gradient-to-b from-gray-100 to-gray-50 font-semibold text-gray-700 py-4 px-4 border-r last:border-r-0">
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
                  <TableRow 
                    key={row.id} 
                    className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-purple-50 hover:to-transparent transition-all duration-200 cursor-pointer"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="py-4 px-4 border-r last:border-r-0">
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
                        <History className="h-8 w-8 text-gray-400" />
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

        <div className="flex flex-col sm:flex-row items-center justify-between p-6 border-t border-gray-200 bg-gray-50 gap-4">
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
      </div>
    </div>
  );
};

export default OrderHistoryTable;

