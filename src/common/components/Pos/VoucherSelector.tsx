"use client"

import { formatCurrencyDisplay } from "@/common/utils/inutFormat"
import { Badge } from "@/core/shadcn/components/ui/badge"
import { Button } from "@/core/shadcn/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/core/shadcn/components/ui/dialog"
import { Input } from "@/core/shadcn/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/core/shadcn/components/ui/table"
import { useFetchVouchersQuery } from "@/lib/services/modules/voucherService"
import type { Voucher } from "@/lib/services/modules/voucherService/type"
import { Loader2, Search, Ticket, X } from "lucide-react"
import { useCallback, useEffect, useMemo, useState } from "react"

interface VoucherSelectorProps {
  selectedVoucher: Voucher | null
  onVoucherSelect: (voucher: Voucher | null) => void
  orderTotal: number
  customerId?: number | null
}

export function VoucherSelector({ selectedVoucher, onVoucherSelect, orderTotal, customerId }: VoucherSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(0)
  const [pageSize] = useState(20)
  const [hasMore, setHasMore] = useState(true)
  const [allVouchers, setAllVouchers] = useState<Voucher[]>([])

  const {
    data: vouchersResponse,
    isLoading,
    isFetching,
    refetch,
  } = useFetchVouchersQuery(
    {
      page: currentPage,
      size: pageSize,
      keyword: searchTerm,
      status: "ACTIVE",
      customerId: customerId ?? undefined,
    },
    {
      refetchOnMountOrArgChange: true,
    },
  )

  useEffect(() => {
    if (isOpen) {
      setCurrentPage(0)
      setHasMore(true)
      setSearchTerm("")
      if (searchTerm) {
        setAllVouchers([])
      }
      refetch()
    }
  }, [isOpen, refetch, searchTerm])

  useEffect(() => {
    if (searchTerm !== undefined) {
      setCurrentPage(0)
      setAllVouchers([])
      setHasMore(true)
    }
  }, [searchTerm])

  const vouchers = useMemo(() => vouchersResponse?.data || [], [vouchersResponse])
  const pagination = vouchersResponse?.pagination

  useEffect(() => {
    if (vouchers && vouchers.length > 0) {
      if (currentPage === 0) {
        setAllVouchers(vouchers)
      } else {
        setAllVouchers(prev => {
          const existingIds = new Set(prev.map(v => v.id))
          const newVouchers = vouchers.filter(v => !existingIds.has(v.id))
          return [...prev, ...newVouchers]
        })
      }

      if (pagination) {
        setHasMore(currentPage < pagination.totalPages - 1)
      } else {
        setHasMore(vouchers.length === pageSize)
      }
    } else if (currentPage === 0) {
      setAllVouchers([])
      setHasMore(false)
    }
  }, [vouchers, currentPage, pagination, pageSize])

  const loadMore = useCallback(() => {
    if (hasMore && !isFetching) {
      setCurrentPage(prev => prev + 1)
    }
  }, [hasMore, isFetching])

  const applicableVouchers = allVouchers.filter((voucher) => {
    const now = new Date()
    const startDate = new Date(voucher.startDate)
    const endDate = new Date(voucher.endDate)

    return (
      voucher.status === "ACTIVE" &&
      now >= startDate &&
      now <= endDate &&
      (!voucher.minOrderValue || orderTotal >= voucher.minOrderValue) &&
      voucher.quantity > 0
    )
  })

  const handleSelectVoucher = (voucher: Voucher) => {
    onVoucherSelect(voucher)
    setIsOpen(false)
  }

  const calculateDiscount = (voucher: Voucher) => {
    if (voucher.discountType === "percentage") {
      const discount = (orderTotal * voucher.discountValue) / 100
      return voucher.maxDiscount ? Math.min(discount, voucher.maxDiscount) : discount
    } else {
      return voucher.discountValue
    }
  }

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }, [])

  return (
    <div className="space-y-1">
      <label htmlFor="voucher-select" className="block text-xs font-medium text-gray-700">
        Voucher giảm giá
      </label>
      <div className="flex gap-2">
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button id="voucher-select" variant="outline" className="flex-1 justify-start bg-transparent h-9 text-sm">
              <Ticket className="w-3.5 h-3.5 mr-2" aria-hidden="true" />
              <span className="truncate">
                {selectedVoucher
                  ? `${selectedVoucher.code} (-${formatCurrencyDisplay(calculateDiscount(selectedVoucher))})`
                  : "Chọn voucher"}
              </span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh]">
            <DialogHeader>
              <DialogTitle>Chọn voucher giảm giá</DialogTitle>
              <DialogDescription>
                Chọn voucher phù hợp để áp dụng giảm giá cho đơn hàng
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" aria-hidden="true" />
                <Input
                  placeholder="Tìm kiếm voucher..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="pl-10"
                  aria-label="Tìm kiếm voucher"
                />
              </div>

              <div className="max-h-96 overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Mã voucher</TableHead>
                      <TableHead>Loại</TableHead>
                      <TableHead>Giá trị</TableHead>
                      <TableHead>Đơn tối thiểu</TableHead>
                      <TableHead>Số lượng</TableHead>
                      <TableHead className="w-24"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(isLoading || isFetching) && currentPage === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          <div
                            className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"
                            role="status"
                            aria-label="Đang tải voucher"
                          ></div>
                          <p className="mt-2 text-sm text-gray-500">Đang tải...</p>
                        </TableCell>
                      </TableRow>
                    ) : applicableVouchers.length === 0 && !isLoading && !isFetching ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                          {searchTerm ? "Không tìm thấy voucher" : "Không có voucher khả dụng"}
                        </TableCell>
                      </TableRow>
                    ) : (
                      <>
                        {applicableVouchers.map((voucher) => (
                          <TableRow key={voucher.id} className="hover:bg-gray-50">
                            <TableCell>
                              <div>
                                <Badge variant="outline">{voucher.code}</Badge>
                                <div className="text-xs text-gray-500 mt-1 max-w-xs truncate">{voucher.description}</div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant={voucher.discountType === "percentage" ? "default" : "secondary"}>
                                {voucher.discountType === "percentage" ? "%" : "VNĐ"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div>
                                {voucher.discountType === "percentage"
                                  ? `${voucher.discountValue}%`
                                  : formatCurrencyDisplay(voucher.discountValue)}
                                {voucher.maxDiscount && voucher.discountType === "percentage" && (
                                  <div className="text-xs text-gray-500">
                                    Giảm tối đa {formatCurrencyDisplay(voucher.maxDiscount)}
                                  </div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              {voucher.minOrderValue ? formatCurrencyDisplay(voucher.minOrderValue) : "0"}
                            </TableCell>
                            <TableCell>
                              <Badge variant={voucher.quantity > 0 ? "default" : "destructive"}>{voucher.quantity}</Badge>
                            </TableCell>
                            <TableCell>
                              <Button
                                size="sm"
                                onClick={() => handleSelectVoucher(voucher)}
                                className="w-full"
                                aria-label={`Chọn voucher ${voucher.code}`}
                              >
                                Chọn
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}

                        {hasMore && (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-4">
                              <Button
                                onClick={loadMore}
                                disabled={isFetching}
                                variant="outline"
                                size="sm"
                                className="flex items-center gap-2 mx-auto"
                              >
                                {isFetching ? (
                                  <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Đang tải...
                                  </>
                                ) : (
                                  "Tải thêm voucher"
                                )}
                              </Button>
                            </TableCell>
                          </TableRow>
                        )}
                      </>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {selectedVoucher && (
          <Button
            variant="outline"
            size="icon"
            onClick={() => onVoucherSelect(null)}
            className="flex-shrink-0 h-9 w-9"
            aria-label="Xóa voucher đã chọn"
          >
            <X className="w-3.5 h-3.5" aria-hidden="true" />
          </Button>
        )}
      </div>
    </div>
  )
}

