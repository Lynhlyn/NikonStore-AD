'use client';

import { Checkbox } from '@/core/shadcn/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/core/shadcn/components/ui/table';
import { UISingleSelect, UITextField } from '@/core/ui';
import { ESize } from '@/core/ui/Helpers/UIsize.enum';
import { UIPagination, UIPaginationResuft } from '@/core/ui/UIPagination';
import { useFetchCapacitiesQuery } from '@/lib/services/modules/capacityService';
import { useFetchColorsQuery } from '@/lib/services/modules/colorService';
import { useFetchProductDetailsQuery } from '@/lib/services/modules/productDetailService';
import { EStatusEnumString } from '@/common/enums/status';
import { getStatusEnumString } from '@/common/utils/statusOption';
import { flexRender, getCoreRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { parseAsInteger, parseAsString, useQueryStates } from 'nuqs';
import { useCallback, useMemo } from 'react';

interface ProductDetailSelectorProps {
  selectedIds: number[];
  onSelectChange: (selectedIds: number[]) => void;
  currentPromotionId?: number;
}

const ProductDetailSelector = ({
  selectedIds,
  onSelectChange,
  currentPromotionId,
}: ProductDetailSelectorProps) => {
  const [queryStates, setQueryStates] = useQueryStates({
    page: parseAsInteger.withDefault(0),
    search: parseAsString.withDefault(''),
    colorId: parseAsString.withDefault(''),
    capacityId: parseAsString.withDefault(''),
    status: parseAsString.withDefault(''),
    sort: parseAsString.withDefault('id'),
    direction: parseAsString.withDefault('desc'),
  });

  const { data, isLoading, error } = useFetchProductDetailsQuery({
    page: queryStates.page,
    size: 10,
    sort: queryStates.sort,
    direction: queryStates.direction === 'asc' || queryStates.direction === 'desc' ? queryStates.direction : undefined,
    promotionId: currentPromotionId,
    sku: queryStates.search || undefined,
    colorId: queryStates.colorId ? Number.parseInt(queryStates.colorId) : undefined,
    capacityId: queryStates.capacityId ? Number.parseInt(queryStates.capacityId) : undefined,
    status: (queryStates.status as EStatusEnumString) || undefined,
  }, {
    refetchOnMountOrArgChange: true,
  });

  const { data: colorsData } = useFetchColorsQuery({
    page: 0,
    size: 100,
  });

  const { data: capacitiesData } = useFetchCapacitiesQuery({
    page: 0,
    size: 100,
  });

  const rowSelection = useMemo(() => {
    return selectedIds.reduce((acc, id) => {
      acc[id.toString()] = true;
      return acc;
    }, {} as Record<string, boolean>);
  }, [selectedIds]);

  const handleRowSelectionChange = useCallback((updater: any) => {
    const newRowSelection = typeof updater === 'function' ? updater(rowSelection) : updater;
    const newSelectedIds = Object.keys(newRowSelection)
      .filter(key => newRowSelection[key])
      .map(Number);
    onSelectChange(newSelectedIds);
  }, [rowSelection, onSelectChange]);

  const handlePageChange = (newPage: number) => {
    setQueryStates((prev) => ({
      ...prev,
      page: newPage - 1,
    }));
  };

  const handleSearchChange = (search: string) => {
    setQueryStates((prev) => ({
      ...prev,
      search,
      page: 0,
    }));
  };

  const handleColorChange = (colorId: string) => {
    setQueryStates((prev) => ({
      ...prev,
      colorId,
      page: 0,
    }));
  };

  const handleCapacityChange = (capacityId: string) => {
    setQueryStates((prev) => ({
      ...prev,
      capacityId,
      page: 0,
    }));
  };

  const handleStatusChange = (status: string) => {
    setQueryStates((prev) => ({
      ...prev,
      status,
      page: 0,
    }));
  };

  const handleSortChange = (column: string) => {
    setQueryStates((prev) => ({
      ...prev,
      sort: column,
      direction: prev.sort === column && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const getSortIcon = (column: string) => {
    if (queryStates.sort !== column) {
      return null;
    }
    return queryStates.direction === 'asc' ? (
      <ArrowUp className="inline-block w-3 h-3 ml-1" />
    ) : (
      <ArrowDown className="inline-block w-3 h-3 ml-1" />
    );
  };

  const getStatusDisplay = (status: EStatusEnumString) => {
    switch (status) {
      case EStatusEnumString.ACTIVE:
        return <span className="text-green-600 font-medium text-left">Hoạt động</span>;
      case EStatusEnumString.INACTIVE:
        return <span className="text-red-600 font-medium text-left">Không hoạt động</span>;
      default:
        return <span className="text-gray-600 font-medium text-left">{status}</span>;
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const colorOptions = [
    { value: '', label: 'Tất cả màu sắc' },
    ...(colorsData?.data?.map((color) => ({
      value: color.id.toString(),
      label: color.name,
    })) || []),
  ];

  const capacityOptions = [
    { value: '', label: 'Tất cả dung tích' },
    ...(capacitiesData?.data?.map((capacity) => ({
      value: capacity.id.toString(),
      label: capacity.name,
    })) || []),
  ];

  const statusOptions = [{ value: '', label: 'Tất cả trạng thái' }, ...getStatusEnumString()];

  const columns = [
    {
      id: 'select',
      header: ({ table }: any) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Chọn tất cả"
        />
      ),
      cell: ({ row }: any) => {
        return (
          <div className="flex justify-center items-center gap-2">
            <Checkbox
              checked={row.getIsSelected()}
              onCheckedChange={(value) => row.toggleSelected(!!value)}
              aria-label="Chọn dòng"
            />
          </div>
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'id',
      header: () => (
        <div className="cursor-pointer flex items-center text-left" onClick={() => handleSortChange('id')}>
          ID {getSortIcon('id')}
        </div>
      ),
      cell: ({ row }: any) => <div className="text-left">{row.getValue('id')}</div>,
    },
    {
      accessorKey: 'sku',
      header: () => (
        <div className="cursor-pointer flex items-center text-left" onClick={() => handleSortChange('sku')}>
          SKU {getSortIcon('sku')}
        </div>
      ),
      cell: ({ row }: any) => {
        return (
          <div className="text-left font-medium">
            {row.getValue('sku')}
          </div>
        );
      },
    },
    {
      accessorKey: 'productName',
      header: () => (
        <div className="cursor-pointer flex items-center text-left" onClick={() => handleSortChange('productName')}>
          Tên sản phẩm {getSortIcon('productName')}
        </div>
      ),
      cell: ({ row }: any) => <div className="line-clamp-2 text-left align-top">{row.getValue('productName')}</div>,
    },
    {
      accessorKey: 'color',
      header: () => <div className="flex items-center text-left">Màu sắc</div>,
      cell: ({ row }: any) => {
        const color = row.original.color;
        const colorName = color?.name || row.original.colorName || '-';
        const hexCode = color?.hexCode || '#000000';
        return (
          <div className="text-left flex items-center gap-2">
            <span>{colorName}</span>
            <div className="w-6 h-6 rounded border border-gray-300" style={{ backgroundColor: hexCode }} />
          </div>
        );
      },
    },
    {
      accessorKey: 'capacity',
      header: () => <div className="flex items-center text-left">Dung tích</div>,
      cell: ({ row }: any) => {
        const capacity = row.original.capacity;
        return <div className="text-left">{capacity?.name || row.original.capacityName || '-'}</div>;
      },
    },
    {
      accessorKey: 'price',
      header: () => (
        <div className="cursor-pointer flex items-center text-left" onClick={() => handleSortChange('price')}>
          Giá {getSortIcon('price')}
        </div>
      ),
      cell: ({ row }: any) => <div className="text-left font-medium">{formatPrice(row.getValue('price'))}</div>,
    },
    {
      accessorKey: 'stock',
      header: () => (
        <div className="cursor-pointer flex items-center text-left" onClick={() => handleSortChange('stock')}>
          Tồn kho {getSortIcon('stock')}
        </div>
      ),
      cell: ({ row }: any) => <div className="text-left">{row.getValue('stock')}</div>,
    },
    {
      accessorKey: 'status',
      header: () => (
        <div className="cursor-pointer flex items-center text-left" onClick={() => handleSortChange('status')}>
          Trạng thái {getSortIcon('status')}
        </div>
      ),
      cell: ({ row }: any) => {
        const status = row.getValue('status');
        return <div className="text-left">{getStatusDisplay(status)}</div>;
      },
    },
  ];

  const table = useReactTable({
    data: data?.data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onRowSelectionChange: handleRowSelectionChange,
    state: {
      rowSelection,
    },
    enableRowSelection: (row) => true,
    getRowId: (row) => row.id.toString(),
  });

  if (isLoading) {
    return (
      <div className="p-5">
        <div className="text-xl font-normal">Đang tải dữ liệu...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-5">
        <div className="text-xl font-normal text-red-500">Lỗi: Không thể tải dữ liệu sản phẩm chi tiết</div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
          <p className="text-red-800">Có lỗi xảy ra khi tải danh sách sản phẩm chi tiết. Vui lòng thử lại sau.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-5">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-lg font-medium">Sản phẩm chi tiết</span>
        <span className="text-sm text-gray-600">Đã chọn: {selectedIds.length} sản phẩm chi tiết</span>
      </div>

      <div className="flex gap-5 flex-wrap mb-5">
        <div className="w-[200px]">
          <UITextField
            placeholder="Tìm kiếm SKU..."
            value={queryStates.search}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </div>
        <div className="w-[150px]">
          <UISingleSelect
            options={colorOptions}
            onChange={(selected) => handleColorChange(selected?.value || '')}
            selected={colorOptions.find((option) => option.value === queryStates.colorId)}
            bindLabel="label"
            bindValue="value"
            size={ESize.M}
            className="rounded-lg border border-gray-300"
            renderOption={(props) => <UISingleSelect.Option {...props} />}
            renderSelected={(props) => <UISingleSelect.Selected {...props} />}
          />
        </div>
        <div className="w-[170px]">
          <UISingleSelect
            options={capacityOptions}
            onChange={(selected) => handleCapacityChange(selected?.value || '')}
            selected={capacityOptions.find((option) => option.value === queryStates.capacityId)}
            bindLabel="label"
            bindValue="value"
            size={ESize.M}
            className="rounded-lg border border-gray-300"
            renderOption={(props) => <UISingleSelect.Option {...props} />}
            renderSelected={(props) => <UISingleSelect.Selected {...props} />}
          />
        </div>
        <div className="w-[150px]">
          <UISingleSelect
            options={statusOptions}
            onChange={(selected) => handleStatusChange(selected?.value || '')}
            selected={statusOptions.find((option) => option.value === queryStates.status)}
            bindLabel="label"
            bindValue="value"
            size={ESize.M}
            className="rounded-lg border border-gray-300"
            renderOption={(props) => <UISingleSelect.Option {...props} />}
            renderSelected={(props) => <UISingleSelect.Selected {...props} />}
          />
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 px-6 pt-5 pb-10">
        <Table className="table-auto mt-3">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="text-gray-500 font-normal leading-[130%] text-sm text-center">
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="text-gray-900 font-normal leading-[130%] text-sm text-center p-5"
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Không có dữ liệu sản phẩm chi tiết.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <div className="mt-8">
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
      </div>
    </div>
  );
};

export default ProductDetailSelector;

