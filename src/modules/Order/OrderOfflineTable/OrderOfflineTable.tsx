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
import { useFetchOrdersQuery } from '@/lib/services/modules/orderService';
import { routerApp } from "@/router";
import { flexRender, getCoreRowModel, getPaginationRowModel, useReactTable } from "@tanstack/react-table";
import { Eye, Filter, MoreHorizontal, RotateCcw, Search, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";
import { useEffect, useState } from 'react';
import { toast } from "sonner";

const getStatusLabel = (status: number) => {
  const statusMap: { [key: number]: string } = {
    6: 'Đã hoàn thành',
    7: 'Đã hủy',
    8: 'Chờ thanh toán',
  };
  return statusMap[status] || 'Không xác định';
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount);
};

const getStatusColor = (status: number) => {
  return (
    status === 6 ? 'bg-green-50 text-green-700 border-green-200' :
      status === 7 ? 'bg-red-50 text-red-700 border-red-200' :
        status === 8 ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
          'bg-gray-50 text-gray-700 border-gray-200'
  );
};

const OrderOfflineTable = () => {
  const router = useRouter();
  const { getRouteWithRole } = useAppNavigation();

  const [{ page, size, keyword, status, fromDate, toDate }, setQuery] = useQueryStates({
    page: parseAsInteger.withDefault(0),
    size: parseAsInteger.withDefault(10),
    keyword: parseAsString.withDefault(""),
    status: parseAsString.withDefault(""),
    fromDate: parseAsString.withDefault(""),
    toDate: parseAsString.withDefault(""),
  });

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const { data: ordersResponse, isLoading, refetch } = useFetchOrdersQuery({
    page,
    size,
    keyword: keyword || undefined,
    type: 'IN_STORE',
    status: status ? parseInt(status) : undefined,
    fromDate: fromDate || undefined,
    toDate: toDate || undefined,
  }, {
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    refetch();
  }, []);

  const orders = ordersResponse?.data || [];
  const totalElements = ordersResponse?.pagination?.totalElements || 0;
  const totalPages = ordersResponse?.pagination?.totalPages || 0;

  const statusOptions = [
    { value: '', label: 'Tất cả' },
    { value: '6', label: 'Đã hoàn thành' },
    { value: '7', label: 'Đã hủy' },
    { value: '8', label: 'Chờ thanh toán' },
  ];

  const clearAllFilters = () => {
    setQuery({
      page: 0,
      keyword: "",
      status: "",
      fromDate: "",
      toDate: "",
    });
    toast.success("Đã xóa tất cả bộ lọc!");
  };

  const hasActiveFilters = keyword !== "" || status !== "" || fromDate !== "" || toDate !== "";

  const columns = [
    {
      accessorKey: "trackingNumber",
      header: "Mã đơn hàng",
    },
    {
      accessorKey: "customerName",
      header: "Tên khách hàng",
      cell: ({ row }: any) => row.original.customerName || '-',
    },
    {
      accessorKey: "orderDate",
      header: "Ngày tạo đơn",
      cell: ({ row }: any) => row.original.orderDate ? new Date(row.original.orderDate).toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-',
    },
    {
      accessorKey: "totalAmount",
      header: "Tổng tiền",
      cell: ({ row }: any) => {
        const totalAmount = row.original.totalAmount
        return formatCurrency(totalAmount);
      },
    },
    {
      accessorKey: "orderStatus",
      header: "Trạng thái",
      cell: ({ row }: any) => (
        <Badge className={`${getStatusColor(row.original.orderStatus)} border font-medium px-2.5 py-0.5 rounded-full`}>
          {getStatusLabel(row.original.orderStatus)}
        </Badge>
      ),
    },
    {
      accessorKey: "actions",
      header: "Thao tác",
      cell: ({ row }: any) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-indigo-50 hover:text-indigo-600">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 border border-gray-200 shadow-lg">
            <DropdownMenuItem 
              onClick={() => {
                router.push(getRouteWithRole(routerApp.order.detail({ id: row.original.orderid.toString() })));
              }}
              className="cursor-pointer hover:bg-indigo-50"
            >
              <Eye className="h-4 w-4 mr-2 text-indigo-600" />
              <span className="font-medium">Xem chi tiết</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const table = useReactTable({
    data: orders,
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
          <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Danh sách đơn hàng offline</h2>
                <p className="text-sm text-indigo-100">
                  {hasActiveFilters && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-500 text-white">
                      Đang áp dụng {Object.values({ keyword, status: status !== "" ? status : "", fromDate, toDate }).filter(Boolean).length} bộ lọc
                    </span>
                  )}
                  {!hasActiveFilters && <span className="text-indigo-100">Hiển thị tất cả đơn hàng tại quầy trong hệ thống</span>}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <CollapsibleTrigger asChild>
                  <Button variant="secondary" size="sm" className="bg-white hover:bg-gray-100 text-indigo-700 font-medium shadow-sm">
                    <Filter className="h-4 w-4 mr-2" />
                    {isFilterOpen ? "Ẩn bộ lọc" : "Hiện bộ lọc"}
                  </Button>
                </CollapsibleTrigger>
                {hasActiveFilters && (
                  <Button variant="secondary" size="sm" onClick={clearAllFilters} className="bg-white hover:bg-gray-100 text-indigo-700 font-medium shadow-sm">
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Làm mới
                  </Button>
                )}
              </div>
            </div>
          </div>

          <CollapsibleContent>
            <div className="p-6 bg-gradient-to-br from-gray-50 to-indigo-50 border-b border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Tìm kiếm tổng hợp</label>
                  <UITextField
                    placeholder="Mã đơn hàng, tên khách hàng, số điện thoại..."
                    value={keyword}
                    onChange={(e) => setQuery({ keyword: e.target.value, page: 0 })}
                    leftIcon={<Search className="w-4 h-4" />}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Từ ngày</label>
                  <Input
                    type="date"
                    value={fromDate}
                    onChange={(e) => setQuery({ fromDate: e.target.value, page: 0 })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Đến ngày</label>
                  <Input
                    type="date"
                    value={toDate}
                    onChange={(e) => setQuery({ toDate: e.target.value, page: 0 })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Trạng thái</label>
                  <UISingleSelect
                    options={statusOptions.map(opt => ({ value: opt.value, label: opt.label }))}
                    selected={statusOptions.find(opt => opt.value === status) || null}
                    onChange={(value) => setQuery({ status: value?.value || "", page: 0 })}
                    placeholder="Tất cả trạng thái"
                    size={ESize.M}
                    bindLabel="label"
                    bindValue="value"
                    renderSelected={(props) => <UISingleSelect.Selected {...props} />}
                    renderOption={(props) => <UISingleSelect.Option {...props} />}
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
                    className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-transparent transition-all duration-200 cursor-pointer"
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

export default OrderOfflineTable;

