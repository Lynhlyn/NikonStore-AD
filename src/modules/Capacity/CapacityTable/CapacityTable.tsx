'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/core/shadcn/components/ui/table";
import { Button } from "@/core/shadcn/components/ui/button";
import { flexRender, getCoreRowModel, getPaginationRowModel, useReactTable } from "@tanstack/react-table";
import { SquarePen, ArrowUp, ArrowDown, Plus, Loader2, Search } from "lucide-react";
import { useAppNavigation } from "@/common/hooks";
import { useFetchCapacitiesQuery } from "@/lib/services/modules/capacityService";
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { getStatusEnumString } from "@/common/utils/statusOption";
import { UISingleSelect } from "@/core/ui/UISingleSelect";
import { EStatusEnumString } from "@/common/enums/status";
import { ESize } from "@/core/ui/Helpers/UIsize.enum";
import { getStatusDisplay } from "@/common/utils/statusColor";

const CapacityTable = () => {
  const router = useRouter();
  const { getRouteWithRole } = useAppNavigation();
  
  const [queryStates, setQueryStates] = useQueryStates({
    page: parseAsInteger.withDefault(0),
    status: parseAsString.withDefault(""),
    sort: parseAsString.withDefault("id"),
    direction: parseAsString.withDefault("desc"),
  });

  const { data, refetch } = useFetchCapacitiesQuery({
    page: queryStates.page,
    isAll: false,
    size: 10,
    sort: queryStates.sort,
    direction: (queryStates.direction === "asc" || queryStates.direction === "desc") ? queryStates.direction : undefined,
    status: queryStates.status as EStatusEnumString || undefined,
  }, { refetchOnMountOrArgChange: true });

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
      accessorKey: "name",
      header: () => (
        <div
          className="cursor-pointer flex items-center text-left"
          onClick={() => handleSortChange("name")}
        >
          Tên dung tích {getSortIcon("name")}
        </div>
      ),
      cell: ({ row }: any) => <div className="text-left font-medium">{row.getValue("name")}</div>,
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
      cell: ({ row }: any) => <div className="text-left">{getStatusDisplay(row.getValue("status"))}</div>,
    },
    {
      accessorKey: "updatedAt",
      header: () => (
        <div
          className="cursor-pointer flex items-center text-left"
          onClick={() => handleSortChange("updatedAt")}
        >
          Ngày cập nhật {getSortIcon("updatedAt")}
        </div>
      ),
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
              onClick={() => router.push(getRouteWithRole(`/capacities/${id}/edit`))}
            >
              <SquarePen className="w-4 h-4" />
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

  const isLoading = !data;

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="mb-6">
        <div className="bg-gradient-to-r from-violet-600 to-violet-700 rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">Quản lý dung tích</h1>
            <Button
              onClick={() => router.push(getRouteWithRole('/capacities/new'))}
              className="flex items-center gap-2 bg-white hover:bg-gray-100 text-violet-700 font-medium shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm dung tích</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="mb-5 flex items-center gap-4">
        <div className="w-[220px]">
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
            <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
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
                      className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-violet-50 hover:to-transparent transition-all duration-200"
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
    </div>
  );
};

export default CapacityTable;

