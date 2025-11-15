"use client"

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
}

export function DialogProductTable({ onProductSelect }: ProductTableProps) {
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
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" aria-hidden="true" />
            Danh sách sản phẩm
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" aria-hidden="true" />
              <Input
                placeholder="Tìm kiếm sản phẩm..."
                value={searchProduct}
                onChange={handleSearchChange}
                className="pl-10"
                aria-label="Tìm kiếm sản phẩm"
              />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="max-h-96 overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên sản phẩm</TableHead>
                <TableHead>Thương hiệu</TableHead>
                <TableHead>Danh mục</TableHead>
                <TableHead className="w-24"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && currentPage === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <div
                      className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"
                      role="status"
                      aria-label="Đang tải sản phẩm"
                    ></div>
                    <p className="mt-2 text-sm text-gray-500">Đang tải...</p>
                  </TableCell>
                </TableRow>
              ) : allProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                    Không tìm thấy sản phẩm
                  </TableCell>
                </TableRow>
              ) : (
                <>
                  {allProducts.map((product) => (
                    <TableRow key={product.id} className="hover:bg-gray-50">
                      <TableCell>
                        <div>
                          <div className="font-medium">{product.name}</div>
                          {product.description && (
                            <div className="text-sm text-gray-500 truncate max-w-xs">{product.description}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{product.brand?.name || "N/A"}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{product.category?.name || "N/A"}</Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          onClick={() => onProductSelect(product.id)}
                          disabled={product.status !== "ACTIVE"}
                          className="w-full"
                          aria-label={`Chọn sản phẩm ${product.name}`}
                        >
                          <Plus className="w-4 h-4" aria-hidden="true" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}

                  {hasMore && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4">
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

