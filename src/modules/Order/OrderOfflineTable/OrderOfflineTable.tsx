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
import { Eye, Filter, MoreHorizontal, RotateCcw, Search } from "lucide-react";
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
    status === 6 ? 'bg-green-100 text-green-800' :
      status === 7 ? 'bg-red-100 text-red-800' :
        status === 8 ? 'bg-yellow-100 text-yellow-800' :
          'bg-gray-100 text-gray-800'
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
        <Badge className={getStatusColor(row.original.orderStatus)}>
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
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => {
              router.push(getRouteWithRole(routerApp.order.detail({ id: row.original.orderid.toString() })));
            }}>
              <Eye className="h-4 w-4 mr-2" />
              Xem chi tiết
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
    return <div className="flex justify-center items-center h-64">Đang tải...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border">
        <Collapsible open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">Danh sách đơn hàng offline</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {hasActiveFilters && (
                    <span className="text-blue-600">
                      Đang áp dụng {Object.values({ keyword, status: status !== "" ? status : "", fromDate, toDate }).filter(Boolean).length} bộ lọc
                    </span>
                  )}
                  {!hasActiveFilters && "Hiển thị tất cả đơn hàng offline"}
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

export default OrderOfflineTable;

