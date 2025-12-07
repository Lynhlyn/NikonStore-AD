'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/core/shadcn/components/ui/table";
import { Button } from "@/core/shadcn/components/ui/button";
import { flexRender, getCoreRowModel, getPaginationRowModel, useReactTable } from "@tanstack/react-table";
import { Eye, Filter, MoreHorizontal, RotateCcw, Trash2, Mail } from "lucide-react";
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";
import { toast } from "sonner";
import { ConfirmModal } from "@/common/components/ConfirmModal";
import { Badge } from "@/core/shadcn/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/core/shadcn/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/core/shadcn/components/ui/dropdown-menu";
import { Input } from "@/core/shadcn/components/ui/input";
import { Label } from "@/core/shadcn/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/core/shadcn/components/ui/select";
import { Contact } from "@/lib/services/modules/contactService/type";
import { useState } from "react";
import {
  useDeleteContactMutation,
  useFetchContactsQuery,
  useUpdateContactMutation,
} from "@/lib/services/modules/contactService";
import { UIPagination, UIPaginationResuft } from "@/core/ui/UIPagination";
import { useRouter } from "next/navigation";
import { useAppNavigation } from "@/common/hooks";
import { routerApp } from "@/router";

export const ContactTable = () => {
  const router = useRouter();
  const { getRouteWithRole } = useAppNavigation();
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmModalConfig, setConfirmModalConfig] = useState({
    title: '',
    message: '',
    onConfirm: () => {},
    type: 'warning' as 'warning' | 'danger' | 'info' | 'success',
    confirmText: 'Xác nhận',
    isLoading: false,
  });

  const [{ page, size, status }, setQuery] = useQueryStates({
    page: parseAsInteger.withDefault(1),
    size: parseAsInteger.withDefault(10),
    status: parseAsString.withDefault("all"),
  });

  const { data: contactsData, isLoading, refetch: refetchContacts } = useFetchContactsQuery({
    page: page - 1,
    size,
    status: status === "all" ? undefined : status,
  });

  const [deleteContact] = useDeleteContactMutation();
  const [updateContact] = useUpdateContactMutation();

  const contacts = contactsData?.data || [];
  const totalElements = contactsData?.pagination?.totalElements || 0;
  const totalPages = contactsData?.pagination?.totalPages || 0;

  const handleContactDataChange = () => {
    refetchContacts();
  };

  const clearAllFilters = () => {
    setQuery({
      page: 1,
      status: "all",
    });
    toast.success('Đã xóa tất cả bộ lọc');
  };

  const hasActiveFilters = status !== "all";

  const handleViewDetails = (contact: Contact) => {
    router.push(getRouteWithRole(routerApp.contact.detail({ id: contact.id })));
  };

  const handleDelete = async (contactId: number) => {
    setConfirmModalConfig({
      title: 'Xác nhận xóa liên hệ',
      message: 'Bạn có chắc chắn muốn xóa liên hệ này? Hành động này không thể hoàn tác.',
      type: 'danger',
      confirmText: 'Xóa',
      onConfirm: async () => {
        setConfirmModalConfig(prev => ({ ...prev, isLoading: true }));
        try {
          await deleteContact(contactId).unwrap();
          toast.success('Xóa liên hệ thành công');
          setIsConfirmModalOpen(false);
          refetchContacts();
        } catch (error: any) {
          toast.error(error?.data?.message || 'Xóa liên hệ thất bại');
        } finally {
          setConfirmModalConfig(prev => ({ ...prev, isLoading: false }));
        }
      },
      isLoading: false,
    });
    setIsConfirmModalOpen(true);
  };

  const getStatusText = (status: string) => {
    if (status === "INACTIVE") {
      return "Chưa xem";
    } else if (status === "ACTIVE") {
      return "Đã xem";
    } else if (status === "COMPLETED") {
      return "Đã hỗ trợ";
    } else {
      return status;
    }
  };

  const getStatusColor = (status: string) => {
    if (status === "INACTIVE") {
      return "bg-gray-100 text-gray-800";
    } else if (status === "ACTIVE") {
      return "bg-blue-100 text-blue-800";
    } else if (status === "COMPLETED") {
      return "bg-green-100 text-green-800";
    } else {
      return "bg-gray-100 text-gray-800";
    }
  };

  const columns = [
    {
      accessorKey: "index",
      header: () => <div className="w-full flex justify-center">STT</div>,
      cell: ({ row }: any) => {
        const index = (page - 1) * size + row.index + 1;
        return <div className="w-full text-center">{index}</div>;
      },
    },
    {
      accessorKey: "name",
      header: () => <div className="text-center">Tên khách hàng</div>,
      cell: ({ row }: any) => (
        <div className="font-medium">{row.original.name}</div>
      ),
    },
    {
      accessorKey: "phone",
      header: () => <div className="text-center">Số điện thoại</div>,
      cell: ({ row }: any) => (
        <div>{row.original.phone}</div>
      ),
    },
    {
      accessorKey: "content",
      header: () => <div className="text-center">Nội dung</div>,
      cell: ({ row }: any) => (
        <div className="max-w-md truncate" title={row.original.content}>
          {row.original.content}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: () => <div className="text-center w-full">Trạng thái</div>,
      cell: ({ row }: any) => (
        <div className="flex justify-center">
          <Badge className={getStatusColor(row.original.status) + " pointer-events-none"}>
            {getStatusText(row.original.status)}
          </Badge>
        </div>
      ),
    },
    {
      accessorKey: "createdAt",
      header: () => <div className="text-center">Ngày gửi</div>,
      cell: ({ row }: any) => (
        <div className="text-sm">
          {new Date(row.original.createdAt).toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>
      ),
    },
    {
      accessorKey: "actions",
      header: () => <div className="text-center">Thao tác</div>,
      cell: ({ row }: any) => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex justify-center">
                <button
                  type="button"
                  className="h-8 w-8 inline-flex items-center justify-center rounded-md text-gray-400 border border-dashed border-gray-300 cursor-allowed bg-gray-50"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleViewDetails(row.original)}>
                <Eye className="h-4 w-4 mr-2" />
                Xem chi tiết
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data: contacts,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    pageCount: totalPages,
  });

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Đang tải</div>;
  }

  return (
    <div className="py-8 px-6 space-y-6">
      <div className="bg-white rounded-lg border">
        <Collapsible open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">Quản lý liên hệ</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {hasActiveFilters && (
                    <span className="text-blue-600">
                      Đang áp dụng bộ lọc
                    </span>
                  )}
                  {!hasActiveFilters && "Hiển thị tất cả liên hệ"}
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
                  <Label>Trạng thái</Label>
                  <Select value={status} onValueChange={(value) => setQuery({ status: value, page: 1 })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tất cả trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả trạng thái</SelectItem>
                      <SelectItem value="INACTIVE">Chưa xem</SelectItem>
                      <SelectItem value="ACTIVE">Đã xem</SelectItem>
                      <SelectItem value="COMPLETED">Đã hỗ trợ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        <div className="border-t w-full overflow-auto">
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
                  <TableRow key={row.id} data-state={row.getIsSelected() && "selected"} className="border-b hover:bg-gray-50">
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
            currentPage={page}
            totalPage={totalPages}
            totalCount={totalElements}
          />
          <UIPagination
            currentPage={page}
            totalPage={totalPages}
            onChange={(newPage: number) => setQuery({ page: newPage })}
          />
        </div>
      </div>

      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={confirmModalConfig.onConfirm}
        title={confirmModalConfig.title}
        message={confirmModalConfig.message}
        type={confirmModalConfig.type}
        confirmText={confirmModalConfig.confirmText}
        isLoading={confirmModalConfig.isLoading}
      />
    </div>
  );
};

