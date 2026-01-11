"use client"

import { formatCurrencyDisplay } from "@/common/utils/inutFormat"
import { Badge } from "@/core/shadcn/components/ui/badge"
import { Button } from "@/core/shadcn/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/core/shadcn/components/ui/dialog"
import { Input } from "@/core/shadcn/components/ui/input"
import { useFetchVouchersQuery } from "@/lib/services/modules/voucherService"
import type { Voucher } from "@/lib/services/modules/voucherService/type"
import { Check, Loader2, Search, Sparkles, Ticket, X } from "lucide-react"
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

  const calculateDiscount = useCallback((voucher: Voucher, orderTotal: number) => {
    if (!voucher || voucher.status !== "ACTIVE") {
      return 0
    }
    const now = new Date()
    const startDate = new Date(voucher.startDate)
    const endDate = new Date(voucher.endDate)
    if (now < startDate || now > endDate) {
      return 0
    }
    if (voucher.minOrderValue && orderTotal < voucher.minOrderValue) {
      return 0
    }
    if (voucher.quantity <= 0) {
      return 0
    }
    let discount = 0
    if (voucher.discountType === "percentage") {
      discount = (orderTotal * voucher.discountValue) / 100
      if (voucher.maxDiscount && discount > voucher.maxDiscount) {
        discount = voucher.maxDiscount
      }
    } else {
      discount = voucher.discountValue
      if (discount > orderTotal) {
        discount = orderTotal
      }
    }
    return Math.round(discount)
  }, [])

  const isVoucherValid = useCallback((voucher: Voucher, orderTotal: number) => {
    if (!voucher || voucher.status !== "ACTIVE") {
      return false
    }
    const now = new Date()
    const startDate = new Date(voucher.startDate)
    const endDate = new Date(voucher.endDate)
    if (now < startDate || now > endDate) {
      return false
    }
    if (voucher.minOrderValue && orderTotal < voucher.minOrderValue) {
      return false
    }
    if (voucher.quantity <= 0) {
      return false
    }
    return true
  }, [])

  const vouchersWithDiscount = useMemo(() => {
    const processedVouchers = allVouchers.map((voucher) => {
      const isValid = isVoucherValid(voucher, orderTotal)
      const actualDiscount = isValid ? calculateDiscount(voucher, orderTotal) : 0
      const isSelected = selectedVoucher?.id === voucher.id
      return {
        voucher,
        isValid,
        actualDiscount,
        isSelected,
      }
    })

    const validVouchers = processedVouchers
      .filter((item) => item.isValid && item.actualDiscount > 0)
      .sort((a, b) => {
        if (a.isSelected && !b.isSelected) return -1
        if (!a.isSelected && b.isSelected) return 1
        
        if (b.actualDiscount !== a.actualDiscount) {
          return b.actualDiscount - a.actualDiscount
        }
        
        const aVoucher = a.voucher
        const bVoucher = b.voucher
        
        if (aVoucher.discountType === "percentage" && bVoucher.discountType === "percentage") {
          if (bVoucher.discountValue !== aVoucher.discountValue) {
            return bVoucher.discountValue - aVoucher.discountValue
          }
        }
        
        if (aVoucher.minOrderValue && bVoucher.minOrderValue) {
          return aVoucher.minOrderValue - bVoucher.minOrderValue
        }
        if (!aVoucher.minOrderValue && bVoucher.minOrderValue) return -1
        if (aVoucher.minOrderValue && !bVoucher.minOrderValue) return 1
        
        return 0
      })

    const selectedVoucherInList = processedVouchers.find((item) => item.isSelected)
    if (selectedVoucherInList && !validVouchers.find((item) => item.voucher.id === selectedVoucherInList.voucher.id)) {
      validVouchers.unshift(selectedVoucherInList)
    }

    return validVouchers
  }, [allVouchers, orderTotal, isVoucherValid, calculateDiscount, selectedVoucher])

  const handleSelectVoucher = (voucher: Voucher) => {
    onVoucherSelect(voucher)
    setIsOpen(false)
  }

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }, [])

  return (
    <div className="space-y-1">
      <label htmlFor="voucher-select" className="block text-xs font-medium text-gray-700">
        Voucher giảm giá
      </label>
      <div className="flex gap-2 min-w-0">
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button id="voucher-select" variant="outline" className="flex-1 justify-start bg-transparent h-8 sm:h-9 text-xs sm:text-sm min-w-0">
              <Ticket className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1.5 sm:mr-2 flex-shrink-0" aria-hidden="true" />
              <span className="truncate min-w-0">
                {selectedVoucher
                  ? `${selectedVoucher.code} (-${formatCurrencyDisplay(calculateDiscount(selectedVoucher, orderTotal))})`
                  : "Chọn voucher"}
              </span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[85vh]">
            <DialogHeader>
              <DialogTitle>Chọn voucher giảm giá</DialogTitle>
              <DialogDescription>
                Voucher được sắp xếp theo mức giảm giá tốt nhất
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" aria-hidden="true" />
                <Input
                  placeholder="Tìm theo mã voucher..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="pl-10"
                  aria-label="Tìm kiếm voucher"
                />
              </div>

              <div className="max-h-[60vh] overflow-y-auto space-y-2 pr-1">
                {(isLoading || isFetching) && currentPage === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Loader2 className="w-6 h-6 animate-spin text-blue-600 mb-2" />
                    <p className="text-sm text-gray-500">Đang tải voucher...</p>
                  </div>
                ) : vouchersWithDiscount.length === 0 && !isLoading && !isFetching ? (
                  <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                    <Ticket className="w-12 h-12 mb-3 opacity-30" />
                    <p className="text-sm font-medium">
                      {searchTerm ? "Không tìm thấy voucher" : "Không có voucher khả dụng"}
                    </p>
                  </div>
                ) : (
                  <>
                    {vouchersWithDiscount.map((item, index) => {
                      const { voucher, actualDiscount } = item
                      const isBest = index === 0 && actualDiscount > 0 && !item.isSelected
                      const isSelected = selectedVoucher?.id === voucher.id
                      return (
                        <div
                          key={voucher.id}
                          className={`relative p-4 rounded-lg border-2 transition-all ${
                            isSelected
                              ? "border-blue-500 bg-blue-50/50"
                              : isBest
                              ? "border-green-500 bg-green-50/30"
                              : "border-gray-200 bg-white hover:border-gray-300"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge variant="outline" className="font-semibold">
                                  {voucher.code}
                                </Badge>
                                {isBest && (
                                  <Badge variant="default" className="bg-green-600 text-white text-xs">
                                    <Sparkles className="w-3 h-3 mr-1" />
                                    Tốt nhất
                                  </Badge>
                                )}
                                {isSelected && (
                                  <Badge variant="default" className="bg-blue-600 text-white text-xs">
                                    <Check className="w-3 h-3 mr-1" />
                                    Đang dùng
                                  </Badge>
                                )}
                              </div>
                              {voucher.description && (
                                <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                                  {voucher.description}
                                </p>
                              )}
                              <div className="flex items-center gap-3 text-xs text-gray-500">
                                {voucher.minOrderValue && (
                                  <span>Đơn tối thiểu: {formatCurrencyDisplay(voucher.minOrderValue)}</span>
                                )}
                                <span className="text-gray-300">•</span>
                                <span>
                                  {voucher.discountType === "percentage"
                                    ? `Giảm ${voucher.discountValue}%`
                                    : `Giảm ${formatCurrencyDisplay(voucher.discountValue)}`}
                                  {voucher.maxDiscount && voucher.discountType === "percentage" && (
                                    <span className="text-gray-400">
                                      {" "}
                                      (tối đa {formatCurrencyDisplay(voucher.maxDiscount)})
                                    </span>
                                  )}
                                </span>
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              <div className="text-right">
                                <div className="text-xs text-gray-500 mb-1">Giảm giá</div>
                                <div className="text-xl font-bold text-green-600">
                                  -{formatCurrencyDisplay(actualDiscount)}
                                </div>
                              </div>
                              {isSelected ? (
                                <Button
                                  size="sm"
                                  disabled
                                  variant="default"
                                  className="bg-blue-600 text-white cursor-not-allowed min-w-[100px]"
                                  aria-label={`Voucher ${voucher.code} đã được chọn`}
                                >
                                  <Check className="w-4 h-4 mr-1" />
                                  Đã chọn
                                </Button>
                              ) : (
                                <Button
                                  size="sm"
                                  onClick={() => handleSelectVoucher(voucher)}
                                  className="min-w-[100px]"
                                  aria-label={`Chọn voucher ${voucher.code}`}
                                >
                                  Chọn
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    })}

                    {hasMore && (
                      <div className="pt-2 pb-4">
                        <Button
                          onClick={loadMore}
                          disabled={isFetching}
                          variant="outline"
                          size="sm"
                          className="w-full"
                        >
                          {isFetching ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin mr-2" />
                              Đang tải...
                            </>
                          ) : (
                            "Tải thêm voucher"
                          )}
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {selectedVoucher && (
          <Button
            variant="outline"
            size="icon"
            onClick={() => onVoucherSelect(null)}
            className="flex-shrink-0 h-8 w-8 sm:h-9 sm:w-9"
            aria-label="Xóa voucher đã chọn"
          >
            <X className="w-3 h-3 sm:w-3.5 sm:h-3.5" aria-hidden="true" />
          </Button>
        )}
      </div>
    </div>
  )
}

