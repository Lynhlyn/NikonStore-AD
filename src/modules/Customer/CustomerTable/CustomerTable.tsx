'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/core/shadcn/components/ui/table";
import { Button } from "@/core/shadcn/components/ui/button";
import { flexRender, getCoreRowModel, getPaginationRowModel, useReactTable } from "@tanstack/react-table";
import { Eye, Filter, MapPin, MoreHorizontal, RotateCcw, Slash, UserCheck, UserPlus, UserX, Loader2, Search, Users } from "lucide-react";
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
import { Customer } from "@/lib/services/modules/customerService/type";
import { useState } from "react";
import {
  useDeleteCustomerMutation,
  useFetchCustomersQuery,
  useToggleCustomerStatusMutation,
  useUnblockCustomerMutation
} from "@/lib/services/modules/customerService";
import { UIPagination, UIPaginationResuft } from "@/core/ui/UIPagination";
import { BlockCustomerModal } from "../BlockCustomerModal/BlockCustomerModal";
import { CustomerDetailModal } from "../CustomerDetailModal/CustomerDetailModal";
import { CustomerFormModal } from "../CustomerFormModal/CustomerFormModal";
import { mapGenderToEnglish, mapGenderToVietnamese } from "@/common/utils/genderMapper";

export const CustomerTable = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
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

  const [{ page, size, keyword, status, email, phoneNumber, gender, isGuest, createdFromDate, createdToDate }, setQuery] = useQueryStates({
    page: parseAsInteger.withDefault(1),
    size: parseAsInteger.withDefault(10),
    keyword: parseAsString.withDefault(""),
    status: parseAsString.withDefault("all"),
    email: parseAsString.withDefault(""),
    phoneNumber: parseAsString.withDefault(""),
    gender: parseAsString.withDefault("all"),
    isGuest: parseAsString.withDefault("all"),
    createdFromDate: parseAsString.withDefault(""),
    createdToDate: parseAsString.withDefault(""),
  });



  const { data: customersData, isLoading, refetch: refetchCustomers } = useFetchCustomersQuery({
    page: page - 1,
    size,
    keyword: keyword || undefined,
    status: status === "all" ? undefined : parseInt(status),
    email: email || undefined,
    phoneNumber: phoneNumber || undefined,
    gender: mapGenderToEnglish(gender),
    isGuest: isGuest === "all" ? undefined : isGuest === "true",
    createdFromDate: createdFromDate || undefined,
    createdToDate: createdToDate || undefined,
  });

  const [deleteCustomer] = useDeleteCustomerMutation();
  const [toggleCustomerStatus] = useToggleCustomerStatusMutation();
  const [unblockCustomer] = useUnblockCustomerMutation();

  const customers = customersData?.data || [];
  const totalElements = customersData?.pagination?.totalElements || 0;
  const totalPages = customersData?.pagination?.totalPages || 0;

  const handleCustomerDataChange = () => {
    refetchCustomers();
  };

  const clearAllFilters = () => {
    setQuery({
      page: 1,
      keyword: "",
      status: "all",
      email: "",
      phoneNumber: "",
      gender: "all",
      isGuest: "all",
      createdFromDate: "",
      createdToDate: "",
    });
    toast.success('Đã xóa tất cả bộ lọc');
  };

  const hasActiveFilters = keyword !== "" || status !== "all" || email !== "" ||
    phoneNumber !== "" || gender !== "all" ||
    isGuest !== "all" || createdFromDate !== "" || createdToDate !== "";

  const handleEdit = (customer: Customer) => {
    if (customer.isGuest) return;
    setSelectedCustomer(customer);
    setIsEditModalOpen(true);
  };

  const handleViewDetails = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsDetailModalOpen(true);
  };

  const handleBlockCustomer = (customer: Customer) => {
    if (customer.isGuest) return;
    setSelectedCustomer(customer);
    setIsBlockModalOpen(true);
  };

  const handleBlockSuccess = () => {
    setIsBlockModalOpen(false);
    refetchCustomers();
    toast.success('Khoá tài khoản thành công');
  };

  const handleUnblockCustomer = async (customer: Customer) => {
    if (customer.isGuest) return;
    setConfirmModalConfig({
      title: 'Xác nhận mở khoá tài khoản',
      message: `Bạn có chắc chắn muốn mở khoá tài khoản "${customer.fullName}"?`,
      type: 'success',
      confirmText: 'Mở khoá',
      onConfirm: async () => {
        setConfirmModalConfig(prev => ({ ...prev, isLoading: true }));
        try {
          await unblockCustomer({ id: customer.id }).unwrap();
          toast.success('Mở khoá tài khoản thành công');
          setIsConfirmModalOpen(false);
          refetchCustomers();
        } catch (error: any) {
          toast.error(error?.data?.message || 'Mở khoá tài khoản thất bại');
        } finally {
          setConfirmModalConfig(prev => ({ ...prev, isLoading: false }));
        }
      },
      isLoading: false,
    });
    setIsConfirmModalOpen(true);
  };

  const handleDelete = async (customerId: number) => {
    setConfirmModalConfig({
      title: 'Xác nhận xóa khách hàng',
      message: 'Bạn có chắc chắn muốn xóa khách hàng này? Hành động này không thể hoàn tác.',
      type: 'danger',
      confirmText: 'Xóa',
      onConfirm: async () => {
        setConfirmModalConfig(prev => ({ ...prev, isLoading: true }));
        try {
          await deleteCustomer({ id: customerId, reason: "Xóa bởi admin" }).unwrap();
          toast.success('Xóa khách hàng thành công');
          setIsConfirmModalOpen(false);
          refetchCustomers();
        } catch (error: any) {
          toast.error(error?.data?.message || 'Xóa khách hàng thất bại');
        } finally {
          setConfirmModalConfig(prev => ({ ...prev, isLoading: false }));
        }
      },
      isLoading: false,
    });
    setIsConfirmModalOpen(true);
  };

  const handleToggleStatus = async (customer: Customer, targetStatus: number) => {
    if (customer.isGuest) return;
    let action: string;
    let actionText: string;
    let type: 'success' | 'warning' | 'danger';

    if (targetStatus === 1) {
      action = "kích hoạt";
      actionText = "Kích hoạt";
      type = 'success';
    } else if (targetStatus === 0) {
      action = "vô hiệu hóa";
      actionText = "Vô hiệu hóa";
      type = 'warning';
    } else {
      return;
    }

    setConfirmModalConfig({
      title: `Xác nhận ${action} tài khoản`,
      message: `Bạn có chắc chắn muốn ${action} tài khoản "${customer.fullName}"?`,
      type: type,
      confirmText: actionText,
      onConfirm: async () => {
        setConfirmModalConfig(prev => ({ ...prev, isLoading: true }));
        try {
          await toggleCustomerStatus({ id: customer.id, status: targetStatus }).unwrap();
          toast.success(`${actionText} tài khoản thành công`);
          setIsConfirmModalOpen(false);
          refetchCustomers();
        } catch (error: any) {
          toast.error(error?.data?.message || `${actionText} tài khoản thất bại`);
        } finally {
          setConfirmModalConfig(prev => ({ ...prev, isLoading: false }));
        }
      },
      isLoading: false,
    });
    setIsConfirmModalOpen(true);
  };

  const getStatusText = (status: number | string) => {
    if (status === 1 || status === "ACTIVE") {
      return "Hoạt động";
    } else if (status === 0 || status === "INACTIVE") {
      return "Không hoạt động";
    } else if (status === 11 || status === "BLOCKED") {
      return "Khoá";
    } else {
      return `Không xác định (${status})`;
    }
  };

  const getStatusColor = (status: number | string) => {
    if (status === 1 || status === "ACTIVE") {
      return "bg-green-50 text-green-700 border-green-200";
    } else if (status === 0 || status === "INACTIVE") {
      return "bg-red-50 text-red-700 border-red-200";
    } else if (status === 11 || status === "BLOCKED") {
      return "bg-orange-50 text-orange-700 border-orange-200";
    } else {
      return "bg-gray-50 text-gray-700 border-gray-200";
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
      accessorKey: "fullName",
      header: () => <div className="text-center">Khách hàng</div>,
      cell: ({ row }: any) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
            <span className="text-sm font-medium">
              {row.original.fullName?.charAt(0)?.toUpperCase() || "U"}
            </span>
          </div>
          <div>
            <div className="font-medium">{row.original.fullName}</div>
            <div className="text-sm text-gray-500">@{row.original.username}</div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "email",
      header: () => <div className="text-center">Liên hệ</div>,
      cell: ({ row }: any) => (
        <div>
          <div className="text-sm">{row.original.email}</div>
          <div className="text-sm text-gray-500">{row.original.phoneNumber}</div>
        </div>
      ),
    },
    {
      accessorKey: "gender",
      header: () => <div className="text-center w-full">Giới tính</div>,
      cell: ({ row }: any) => (
        <div className="text-center">{mapGenderToVietnamese(row.original.gender)}</div>
      ),
    },
    {
      accessorKey: "isGuest",
      header: () => <div className="text-center">Phân loại</div>,
      cell: ({ row }: any) => (
        <div className="w-full flex justify-center">
          <Badge
            className={`${
              row.original.isGuest
                ? "bg-amber-50 text-amber-700 border-amber-200"
                : "bg-indigo-50 text-indigo-700 border-indigo-200"
            } border font-medium px-2.5 py-0.5 rounded-full pointer-events-none`}
          >
            {row.original.isGuest ? "Vãng lai" : "Thành viên"}
          </Badge>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: () => <div className="text-center w-full">Trạng thái</div>,
      cell: ({ row }: any) => (
        <div className="flex justify-center">
          <Badge className={`${getStatusColor(row.original.status)} border font-medium px-2.5 py-0.5 rounded-full pointer-events-none`}>
            {getStatusText(row.original.status)}
          </Badge>
        </div>
      ),
    },
    {
      accessorKey: "actions",
      header: () => <div className="text-center">Thao tác</div>,
      cell: ({ row }: any) => {
        const isGuestAccount = row.original.isGuest;
        if (isGuestAccount) {
          return (
            <div className="relative flex justify-center">
              <button
                type="button"
                disabled
                className="h-8 w-8 inline-flex items-center justify-center rounded-md text-gray-400 border border-dashed border-gray-300 cursor-not-allowed bg-gray-50 relative"
                title="Tài khoản vãng lai - không khả dụng"
              >
                <MoreHorizontal className="h-4 w-4" />
                <Slash className="h-4 w-4 text-red-500 absolute" />
              </button>
            </div>
          );
        }
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
            <DropdownMenuContent align="end" className="w-56 border border-gray-200 shadow-lg">
              <DropdownMenuItem 
                onClick={() => handleEdit(row.original)}
                className="cursor-pointer hover:bg-slate-50"
              >
                <Eye className="h-4 w-4 mr-2 text-slate-600" />
                <span className="font-medium">Thông tin khách hàng</span>
              </DropdownMenuItem>
              {(row.original.status === 0 || row.original.status === "INACTIVE") && (
                <DropdownMenuItem onClick={() => handleToggleStatus(row.original, 1)}>
                  <UserCheck className="h-4 w-4 mr-2 text-teal-600" />
                  <span className="text-teal-600">Kích hoạt</span>
                </DropdownMenuItem>
              )}
              {(row.original.status === 11 || row.original.status === "BLOCKED") && (
                <DropdownMenuItem onClick={() => handleUnblockCustomer(row.original)}>
                  <RotateCcw className="h-4 w-4 mr-2 text-green-600" />
                  <span className="text-green-600">Mở khoá tài khoản</span>
                </DropdownMenuItem>
              )}
              {(row.original.status === 1 || row.original.status === "ACTIVE") && (
                <DropdownMenuItem onClick={() => handleBlockCustomer(row.original)}>
                  <UserX className="h-4 w-4 mr-2 text-orange-600" />
                  <span className="text-orange-600">Khoá tài khoản</span>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={() => handleViewDetails(row.original)}>
                <MapPin className="h-4 w-4 mr-2" />
                Xem địa chỉ
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data: customers,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    pageCount: totalPages,
  });

  if (isLoading) {
    return (
      <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
        <div className="flex flex-col items-center justify-center h-96 space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen space-y-6">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <Collapsible open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <div className="bg-gradient-to-r from-slate-600 to-slate-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Users className="h-6 w-6 text-white" />
                  <h2 className="text-2xl font-bold text-white">Danh sách khách hàng</h2>
                </div>
                <p className="text-sm text-slate-100">
                  {hasActiveFilters && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-500 text-white">
                      Đang áp dụng {Object.values({ keyword, status: status !== "all" ? status : "", email, phoneNumber, gender: gender !== "all" ? gender : "", isGuest: isGuest !== "all" ? isGuest : "", createdFromDate, createdToDate }).filter(Boolean).length} bộ lọc
                    </span>
                  )}
                  {!hasActiveFilters && <span className="text-slate-100">Hiển thị tất cả khách hàng trong hệ thống</span>}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <CollapsibleTrigger asChild>
                  <Button variant="secondary" size="sm" className="bg-white hover:bg-gray-100 text-slate-700 font-medium shadow-sm">
                    <Filter className="h-4 w-4 mr-2" />
                    {isFilterOpen ? "Ẩn bộ lọc" : "Hiện bộ lọc"}
                  </Button>
                </CollapsibleTrigger>
                {hasActiveFilters && (
                  <Button variant="secondary" size="sm" onClick={clearAllFilters} className="bg-white hover:bg-gray-100 text-slate-700 font-medium shadow-sm">
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Làm mới
                  </Button>
                )}
                <Button onClick={() => setIsCreateModalOpen(true)} size="sm" className="bg-white hover:bg-gray-100 text-slate-700 font-medium shadow-sm">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Thêm khách hàng
                </Button>
              </div>
            </div>
          </div>

          <CollapsibleContent>
            <div className="p-6 bg-gradient-to-br from-gray-50 to-slate-50 border-b border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Tìm kiếm tổng hợp</Label>
                  <Input
                    placeholder="Tên, email, số điện thoại..."
                    value={keyword}
                    onChange={(e) => setQuery({ keyword: e.target.value, page: 1 })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Lọc theo Email</Label>
                  <Input
                    placeholder="Nhập email hoặc một phần..."
                    value={email}
                    onChange={(e) => setQuery({ email: e.target.value, page: 1 })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Lọc theo SĐT</Label>
                  <Input
                    placeholder="Nhập số điện thoại..."
                    value={phoneNumber}
                    inputMode="numeric"
                    pattern="\\d*"
                    maxLength={11}
                    onChange={(e) => {
                      const digits = e.target.value.replace(/\D/g,'').slice(0,11);
                      setQuery({ phoneNumber: digits, page: 1 });
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Trạng thái</Label>
                  <Select value={status} onValueChange={(value) => setQuery({ status: value, page: 1 })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tất cả trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả trạng thái</SelectItem>
                      <SelectItem value="1">Hoạt động</SelectItem>
                      <SelectItem value="0">Không hoạt động</SelectItem>
                      <SelectItem value="11">Khoá</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Giới tính</Label>
                  <Select value={gender} onValueChange={(value) => setQuery({ gender: value, page: 1 })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tất cả giới tính" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả giới tính</SelectItem>
                      <SelectItem value="Nam">Nam</SelectItem>
                      <SelectItem value="Nữ">Nữ</SelectItem>
                      <SelectItem value="Khác">Khác</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Loại tài khoản</Label>
                  <Select value={isGuest} onValueChange={(value) => setQuery({ isGuest: value, page: 1 })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tất cả loại" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả</SelectItem>
                      <SelectItem value="false">Thành viên</SelectItem>
                      <SelectItem value="true">Khách vãng lai</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Ngày tạo từ</Label>
                  <Input
                    type="date"
                    value={createdFromDate}
                    onChange={(e) => setQuery({ createdFromDate: e.target.value, page: 1 })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Ngày tạo đến</Label>
                  <Input
                    type="date"
                    value={createdToDate}
                    onChange={(e) => setQuery({ createdToDate: e.target.value, page: 1 })}
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
                    data-state={row.getIsSelected() && "selected"} 
                    className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-slate-50 hover:to-transparent transition-all duration-200 cursor-pointer"
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

      <CustomerFormModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        customer={null}
        onSuccess={handleCustomerDataChange}
      />

      <CustomerFormModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedCustomer(null);
        }}
        customer={selectedCustomer}
        onSuccess={handleCustomerDataChange}
      />

      <CustomerDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedCustomer(null);
        }}
        customer={selectedCustomer}
        onCustomerDataChange={handleCustomerDataChange}
      />

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

      <BlockCustomerModal
        isOpen={isBlockModalOpen}
        onClose={() => {
          setIsBlockModalOpen(false);
          setSelectedCustomer(null);
        }}
        customer={selectedCustomer}
        onSuccess={handleBlockSuccess}
      />
    </div>
  );
};

