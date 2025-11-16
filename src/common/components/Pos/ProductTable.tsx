"use client"

import { BarcodeScanner } from "@/common/components/Pos/BarcodeScanner"
import type { ProductDetailPosResponse } from "@/lib/services/modules/posService/type"
import { Badge } from "@/core/shadcn/components/ui/badge"
import { Button } from "@/core/shadcn/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/core/shadcn/components/ui/card"
import { Input } from "@/core/shadcn/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/core/shadcn/components/ui/table"
import { useGetPosProductsQuery } from "@/lib/services/modules/posService"
import { Loader2, Package, Plus, Search } from "lucide-react"
import { useCallback, useEffect, useMemo, useState } from "react"

interface ProductTableProps {
  onProductSelect: (productId: number) => void
  onScanSuccess?: (productDetail: ProductDetailPosResponse) => void
  scanDisabled?: boolean
}

export function DialogProductTable({ onProductSelect, onScanSuccess, scanDisabled }: ProductTableProps) {
  const [searchProduct, setSearchProduct] = useState("")
  const [currentPage, setCurrentPage] = useState(0)
  const [pageSize] = useState(20)
  const [hasMore, setHasMore] = useState(true)
  const [allProducts, setAllProducts] = useState<any[]>([])

  const {
    data: productsResponse,
    isLoading,
    isFetching,
  } = useGetPosProductsQuery(
    {
      page: currentPage,
      size: pageSize,
      status: "ACTIVE",
      keyword: searchProduct,
    },
    {
      refetchOnMountOrArgChange: true,
    },
  )

  const products = useMemo(() => productsResponse?.data || [], [productsResponse])
  const pagination = productsResponse?.pagination

  useEffect(() => {
    if (searchProduct) {
      setCurrentPage(0)
      setAllProducts([])
      setHasMore(true)
    }
  }, [searchProduct])

  useEffect(() => {
    if (products.length > 0) {
      if (currentPage === 0) {
        setAllProducts(products)
      } else {
        setAllProducts(prev => {
          const existingIds = new Set(prev.map(p => p.id))
          const newProducts = products.filter(p => !existingIds.has(p.id))
          return [...prev, ...newProducts]
        })
      }

      if (pagination) {
        setHasMore(currentPage < pagination.totalPages - 1)
      } else {
        setHasMore(products.length === pageSize)
      }
    } else if (currentPage === 0) {
      setAllProducts([])
      setHasMore(false)
    }
  }, [products, currentPage, pagination, pageSize])

  const loadMore = useCallback(() => {
    if (hasMore && !isFetching) {
      setCurrentPage(prev => prev + 1)
    }
  }, [hasMore, isFetching])

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchProduct(e.target.value)
  }, [])

  return (
    <Card className="border-gray-200 shadow-sm flex flex-col h-auto">
      <CardHeader className="bg-white border-b border-gray-200 flex-shrink-0 px-2 sm:px-4 py-2 sm:py-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 sm:gap-3">
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <Package className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" aria-hidden="true" />
            <span className="text-sm sm:text-base font-semibold">Danh sách sản phẩm</span>
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:flex-none sm:w-64 lg:w-72">
              <Search className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" aria-hidden="true" />
              <Input
                placeholder="Tìm kiếm sản phẩm..."
                value={searchProduct}
                onChange={handleSearchChange}
                className="pl-8 sm:pl-10 h-8 sm:h-9 text-xs sm:text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                aria-label="Tìm kiếm sản phẩm"
              />
            </div>
            {onScanSuccess && (
              <BarcodeScanner
                onScanSuccess={onScanSuccess}
                disabled={scanDisabled}
              />
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-2 sm:p-4 flex-1 min-h-0 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 -mx-2 sm:-mx-4 px-2 sm:px-4">
          <Table className="min-w-full">
            <TableHeader className="sticky top-0 bg-gray-50 z-10">
              <TableRow className="bg-gray-50">
                <TableHead className="text-xs sm:text-sm text-gray-700 font-semibold">Tên sản phẩm</TableHead>
                <TableHead className="text-xs sm:text-sm text-gray-700 font-semibold hidden sm:table-cell">Thương hiệu</TableHead>
                <TableHead className="text-xs sm:text-sm text-gray-700 font-semibold hidden md:table-cell">Danh mục</TableHead>
                <TableHead className="w-16 sm:w-24 text-gray-700 font-semibold text-center">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && currentPage === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">
                    <div
                      className="animate-spin rounded-full h-6 w-6 border-2 border-gray-300 border-t-blue-600 mx-auto"
                      role="status"
                      aria-label="Đang tải sản phẩm"
                    ></div>
                    <p className="mt-2 text-sm text-gray-600">Đang tải...</p>
                  </TableCell>
                </TableRow>
              ) : allProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-gray-400 text-xs sm:text-sm">
                    Không tìm thấy sản phẩm
                  </TableCell>
                </TableRow>
              ) : (
                <>
                  {allProducts.map((product) => (
                    <TableRow key={product.id} className="hover:bg-gray-50 transition-colors">
                      <TableCell className="py-2 sm:py-3">
                        <div className="min-w-0">
                          <div className="font-semibold text-xs sm:text-sm text-gray-900 truncate">{product.name}</div>
                          {product.description && (
                            <div className="text-xs text-gray-500 truncate max-w-xs hidden sm:block">{product.description}</div>
                          )}
                          <div className="flex gap-1 sm:hidden mt-1">
                            {product.brand?.name && (
                              <Badge variant="outline" className="bg-gray-100 text-gray-700 border-gray-300 text-xs px-1 py-0">{product.brand.name}</Badge>
                            )}
                            {product.category?.name && (
                              <Badge variant="outline" className="bg-gray-100 text-gray-700 border-gray-300 text-xs px-1 py-0">{product.category.name}</Badge>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-2 sm:py-3 hidden sm:table-cell">
                        <Badge variant="outline" className="bg-gray-100 text-gray-700 border-gray-300 text-xs">{product.brand?.name || "N/A"}</Badge>
                      </TableCell>
                      <TableCell className="py-2 sm:py-3 hidden md:table-cell">
                        <Badge variant="outline" className="bg-gray-100 text-gray-700 border-gray-300 text-xs">{product.category?.name || "N/A"}</Badge>
                      </TableCell>
                      <TableCell className="py-2 sm:py-3">
                        <Button
                          size="sm"
                          onClick={() => onProductSelect(product.id)}
                          disabled={product.status !== "ACTIVE"}
                          className="w-full h-7 sm:h-8 text-xs"
                          aria-label={`Chọn sản phẩm ${product.name}`}
                        >
                          <Plus className="w-3 h-3 sm:w-4 sm:h-4" aria-hidden="true" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}

                  {hasMore && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-3 sm:py-4">
                        <Button
                          onClick={loadMore}
                          disabled={isFetching}
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-2 mx-auto border-gray-300 hover:bg-gray-100 text-xs sm:text-sm h-8 sm:h-9"
                        >
                          {isFetching ? (
                            <>
                              <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
                              <span className="hidden sm:inline">Đang tải...</span>
                              <span className="sm:hidden">Tải...</span>
                            </>
                          ) : (
                            "Tải thêm sản phẩm"
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
      </CardContent>
    </Card>
  )
}

