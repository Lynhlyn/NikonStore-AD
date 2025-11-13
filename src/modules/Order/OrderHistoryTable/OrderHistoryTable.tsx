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
import { Eye, Filter, MoreHorizontal, RotateCcw, Search } from "lucide-react";
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
    status === 3 ? 'bg-yellow-100 text-yellow-800' :
      status === 4 ? 'bg-blue-100 text-blue-800' :
        status === 5 ? 'bg-orange-100 text-orange-800' :
          status === 6 ? 'bg-green-100 text-green-800' :
            status === 7 ? 'bg-red-100 text-red-800' :
              status === 8 ? 'bg-yellow-100 text-yellow-800' :
                status === 12 ? 'bg-red-100 text-red-800' :
                  status === 13 ? 'bg-purple-100 text-purple-800' :
                    'bg-gray-100 text-gray-800'
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
        <Badge className={getStatusColor(row.original.statusBefore)}>
          {getStatusLabel(row.original.statusBefore)}
        </Badge>
      ) : '-',
    },
    {
      accessorKey: "statusAfter",
      header: "Trạng thái sau",
      cell: ({ row }: any) => (
        <Badge className={getStatusColor(row.original.statusAfter)}>
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
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => {
              router.push(getRouteWithRole(routerApp.order.detail({ id: row.original.orderId.toString() })));
            }}>
              <Eye className="h-4 w-4 mr-2" />
              Xem đơn hàng
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
    return <div className="flex justify-center items-center h-64">Đang tải...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border">
        <Collapsible open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">Lịch sử thay đổi đơn hàng</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {hasActiveFilters && (
                    <span className="text-blue-600">
                      Đang áp dụng {Object.values({ trackingNumber, statusAfter, createdAtFrom, createdAtTo, changeByName, notes, orderType }).filter(Boolean).length} bộ lọc
                    </span>
                  )}
                  {!hasActiveFilters && "Hiển thị tất cả lịch sử thay đổi"}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <CollapsibleTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    {isFilterOpen ? "Ẩn bộ lọc" : "Hiện bộ lọc"}
                  </Button>
                </CollapsibleTrigger>
                {hasActiveFilters && (
                  <Button variant="outline" size="sm" onClick={clearAllFilters}>
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Làm mới
                  </Button>
                )}
              </div>
            </div>
          </div>

          <CollapsibleContent>
            <div className="p-6 bg-gray-50 border-b">
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

        <div className="border-t">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="border-b">
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className="border-r last:border-r-0 bg-gray-50 font-medium">
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
                  <TableRow key={row.id} className="border-b hover:bg-gray-50">
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="border-r last:border-r-0">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    Không có dữ liệu
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between p-6 border-t">
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

