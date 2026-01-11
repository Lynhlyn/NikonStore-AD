"use client"

import { Button } from "@/core/shadcn/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/core/shadcn/components/ui/dialog"
import { Input } from "@/core/shadcn/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/core/shadcn/components/ui/table"
import { useFetchCustomersQuery } from "@/lib/services/modules/customerService"
import type { Customer } from "@/lib/services/modules/customerService/type"
import { useDebounce } from "@/common/hooks"
import { Loader2, Search, User, UserPlus } from "lucide-react"
import { useCallback, useEffect, useMemo, useState } from "react"

interface CustomerSelectorProps {
  selectedCustomer: Customer | null
  onCustomerSelect: (customer: Customer | null) => void
}

export function CustomerSelector({ selectedCustomer, onCustomerSelect }: CustomerSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const debouncedSearchTerm = useDebounce(searchTerm, 500)
  const [currentPage, setCurrentPage] = useState(0)
  const [pageSize] = useState(20)
  const [hasMore, setHasMore] = useState(true)
  const [allCustomers, setAllCustomers] = useState<Customer[]>([])

  const queryParams = useMemo(
    () => ({
      page: currentPage,
      size: pageSize,
      keyword: debouncedSearchTerm.trim() || undefined,
      status: "ACTIVE" as const,
    }),
    [currentPage, pageSize, debouncedSearchTerm]
  )

  const {
    data: customersResponse,
    isLoading,
    isFetching,
    refetch,
  } = useFetchCustomersQuery(queryParams, {
    refetchOnMountOrArgChange: true,
  })

  useEffect(() => {
    if (isOpen) {
      setCurrentPage(0)
      setHasMore(true)
      setSearchTerm("")
    }
  }, [isOpen])

  useEffect(() => {
    if (debouncedSearchTerm !== undefined) {
      setCurrentPage(0)
      setHasMore(true)
    }
  }, [debouncedSearchTerm])

  const customers = useMemo(() => customersResponse?.data || [], [customersResponse])
  const pagination = customersResponse?.pagination

  useEffect(() => {
    if (customers && customers.length > 0) {
      if (currentPage === 0) {
        setAllCustomers(customers)
      } else {
        setAllCustomers(prev => {
          const existingIds = new Set(prev.map(c => c.id))
          const newCustomers = customers.filter(c => !existingIds.has(c.id))
          return [...prev, ...newCustomers]
        })
      }

      if (pagination) {
        setHasMore(currentPage < pagination.totalPages - 1)
      } else {
        setHasMore(customers.length === pageSize)
      }
    } else if (currentPage === 0 && !isLoading && !isFetching) {
      setAllCustomers([])
      setHasMore(false)
    }
  }, [customers, currentPage, pagination, pageSize, isLoading, isFetching])

  const loadMore = useCallback(() => {
    if (hasMore && !isFetching) {
      setCurrentPage(prev => prev + 1)
    }
  }, [hasMore, isFetching])

  const handleSelectCustomer = (customer: Customer) => {
    onCustomerSelect(customer)
    setIsOpen(false)
  }

  const handleSelectGuest = () => {
    onCustomerSelect(null)
    setIsOpen(false)
  }

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }, [])

  return (
    <div className="space-y-1 min-w-0">
      <label htmlFor="customer-select" className="block text-xs font-medium text-gray-700">
        Khách hàng
      </label>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button id="customer-select" variant="outline" className="w-full justify-start bg-transparent h-8 sm:h-9 text-xs sm:text-sm min-w-0">
            <User className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1.5 sm:mr-2 flex-shrink-0" aria-hidden="true" />
            <span className="truncate min-w-0">{selectedCustomer ? selectedCustomer.fullName : "Khách vãng lai"}</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Chọn khách hàng</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" aria-hidden="true" />
                <Input
                  placeholder="Tìm theo tên, email, SĐT, username..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="pl-10"
                  aria-label="Tìm kiếm khách hàng"
                />
              </div>
              <Button onClick={handleSelectGuest} variant="outline" aria-label="Chọn khách vãng lai">
                <UserPlus className="w-4 h-4 mr-2" aria-hidden="true" />
                Khách vãng lai
              </Button>
            </div>

            <div className="max-h-96 overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tên khách hàng</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Số điện thoại</TableHead>
                    <TableHead className="w-24"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(isLoading || isFetching) && currentPage === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8">
                        <div
                          className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"
                          role="status"
                          aria-label="Đang tải khách hàng"
                        ></div>
                        <p className="mt-2 text-sm text-gray-500">Đang tải...</p>
                      </TableCell>
                    </TableRow>
                  ) : allCustomers.length === 0 && !isLoading && !isFetching ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                        {searchTerm ? "Không tìm thấy khách hàng" : "Không có khách hàng nào"}
                      </TableCell>
                    </TableRow>
                  ) : (
                    <>
                      {allCustomers
                        .filter((customer) => customer.fullName?.toLowerCase() !== "khách vãng lai")
                        .map((customer) => (
                          <TableRow key={customer.id} className="hover:bg-gray-50">
                            <TableCell className="font-medium">{customer.fullName}</TableCell>
                            <TableCell>{customer.email}</TableCell>
                            <TableCell>{customer.phoneNumber}</TableCell>
                            <TableCell>
                              <Button
                                size="sm"
                                onClick={() => handleSelectCustomer(customer)}
                                className="w-full"
                                aria-label={`Chọn khách hàng ${customer.fullName}`}
                              >
                                Chọn
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}

                      {hasMore && (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-4">
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
                                "Tải thêm khách hàng"
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
    </div>
  )
}

