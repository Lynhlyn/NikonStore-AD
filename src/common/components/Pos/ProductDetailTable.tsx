"use client"

import { formatCurrencyDisplay } from "@/common/utils/inutFormat"
import { Badge } from "@/core/shadcn/components/ui/badge"
import { Button } from "@/core/shadcn/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/core/shadcn/components/ui/dialog"
import { Input } from "@/core/shadcn/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/core/shadcn/components/ui/table"
import { useGetProductDetailsQuery } from "@/lib/services/modules/posService"
import type { ProductDetailPosResponse } from "@/lib/services/modules/posService/type"
import { ImageIcon, Loader2, Minus, Plus, ShoppingCart, Tag } from "lucide-react"
import { useCallback, useEffect, useMemo, useState } from "react"

interface ProductDetailTableProps {
  isOpen: boolean
  onClose: () => void
  productId: number | null
  onAddToCart: (productDetail: ProductDetailPosResponse, quantity: number) => void
}

export function DialogProductDetailTable({ isOpen, onClose, productId, onAddToCart }: ProductDetailTableProps) {
  const [quantities, setQuantities] = useState<Record<number, number>>({})
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({})
  const [currentPage, setCurrentPage] = useState(0)
  const [pageSize] = useState(10)
  const [hasMore, setHasMore] = useState(true)
  const [allProductDetails, setAllProductDetails] = useState<ProductDetailPosResponse[]>([])
  const [isInitialLoading, setIsInitialLoading] = useState(false)

  const {
    data: productDetailsResponse,
    isLoading,
    isFetching,
    refetch,
  } = useGetProductDetailsQuery(
    {
      productId: productId!,
      page: currentPage,
      size: pageSize,
      status: "ACTIVE",
    },
    {
      skip: !productId || !isOpen,
      refetchOnMountOrArgChange: true,
    },
  )

  useEffect(() => {
    if (isOpen && productId) {
      setIsInitialLoading(true)
      setCurrentPage(0)
      setAllProductDetails([])
      setHasMore(true)
      setQuantities({})
      setImageErrors({})
      refetch()
    } else if (!isOpen) {
      setIsInitialLoading(false)
    }
  }, [isOpen, productId, refetch])

  useEffect(() => {
    if (isOpen && productId && !isLoading && !isFetching) {
      setIsInitialLoading(false)
    }
  }, [isOpen, productId, isLoading, isFetching])

  const productDetails = useMemo(() => productDetailsResponse?.data || [], [productDetailsResponse])
  const productName = useMemo(() => allProductDetails[0]?.productName || "", [allProductDetails])
  const pagination = productDetailsResponse?.pagination

  useEffect(() => {
    if (productDetails.length > 0) {
      if (currentPage === 0) {
        setAllProductDetails(productDetails)
      } else {
        setAllProductDetails(prev => {
          const existingIds = new Set(prev.map(p => p.id))
          const newProductDetails = productDetails.filter(p => !existingIds.has(p.id))
          return [...prev, ...newProductDetails]
        })
      }

      if (pagination) {
        setHasMore(currentPage < pagination.totalPages - 1)
      } else {
        setHasMore(productDetails.length === pageSize)
      }
    } else if (currentPage === 0) {
      setAllProductDetails([])
      setHasMore(false)
    }
  }, [productDetails, currentPage, pagination, pageSize])

  const loadMore = useCallback(() => {
    if (hasMore && !isFetching) {
      setCurrentPage(prev => prev + 1)
    }
  }, [hasMore, isFetching])

  const calculateDiscountedPrice = (price: number, promotion?: any) => {
    if (!promotion || !promotion.isActive) {
      return price
    }

    if (promotion.discountType === "percentage") {
      const discountAmount = (price * promotion.discountValue) / 100
      return Math.round(price - discountAmount)
    } else if (promotion.discountType === "fixed_amount") {
      return Math.max(0, price - promotion.discountValue)
    }

    return price
  }

  const calculateDiscountAmount = (price: number, promotion?: any) => {
    if (!promotion || !promotion.isActive) {
      return 0
    }

    if (promotion.discountType === "percentage") {
      return Math.round((price * promotion.discountValue) / 100)
    } else if (promotion.discountType === "fixed_amount") {
      return Math.min(price, promotion.discountValue)
    }

    return 0
  }

  const getQuantity = (productDetailId: number) => quantities[productDetailId] || 1

  const updateQuantity = (productDetailId: number, newQuantity: number) => {
    if (newQuantity < 1) return
    setQuantities((prev) => ({
      ...prev,
      [productDetailId]: newQuantity,
    }))
  }

  const handleAddToCart = (productDetail: ProductDetailPosResponse) => {
    const quantity = getQuantity(productDetail.id)
    onAddToCart(productDetail, quantity)
    setQuantities((prev) => ({
      ...prev,
      [productDetail.id]: 1,
    }))
    onClose()
  }

  const handleImageError = (productDetailId: number) => {
    setImageErrors((prev) => ({
      ...prev,
      [productDetailId]: true,
    }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="truncate max-w-[600px]" title={`Chi tiết sản phẩm: ${productName}`}>
            Chi tiết sản phẩm: {productName}
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4">
          {isInitialLoading || (isLoading && currentPage === 0) ? (
            <div className="text-center py-8">
              <div
                className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"
                role="status"
                aria-label="Đang tải chi tiết sản phẩm"
              ></div>
              <p className="mt-2 text-gray-500">Đang tải chi tiết sản phẩm...</p>
            </div>
          ) : allProductDetails.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <ShoppingCart className="w-12 h-12 mx-auto mb-3 opacity-30" aria-hidden="true" />
              <p>Không có chi tiết sản phẩm</p>
            </div>
          ) : (
            <>
              <div className="max-h-[500px] overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-20">Hình ảnh</TableHead>
                      <TableHead className="w-32">SKU</TableHead>
                      <TableHead className="w-28">Màu sắc</TableHead>
                      <TableHead className="w-24">Dung tích</TableHead>
                      <TableHead className="w-28">Giá</TableHead>
                      <TableHead className="w-20">Tồn kho</TableHead>
                      <TableHead className="w-32">Số lượng</TableHead>
                      <TableHead className="w-24">Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allProductDetails.map((detail) => (
                      <TableRow key={detail.id} className="hover:bg-gray-50">
                        <TableCell className="p-2">
                          <div className="w-16 h-16 rounded-lg overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center">
                            {detail.thumbnailImage && !imageErrors[detail.id] ? (
                              <img
                                src={detail.thumbnailImage || "/placeholder.svg"}
                                alt={`${detail.productName} - ${detail.color.name}`}
                                className="w-full h-full object-cover"
                                onError={() => handleImageError(detail.id)}
                                loading="lazy"
                              />
                            ) : (
                              <ImageIcon className="w-6 h-6 text-gray-400" aria-hidden="true" />
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="p-2">
                          <Badge variant="outline" className="text-xs font-mono">
                            {detail.sku}
                          </Badge>
                        </TableCell>
                        <TableCell className="p-2">
                          <div className="flex items-center gap-2 max-w-[120px]">
                            {detail.color.hexCode && (
                              <div
                                className="w-4 h-4 rounded-full border border-gray-300 flex-shrink-0"
                                style={{ backgroundColor: detail.color.hexCode.replace(/`/g, "") }}
                                title={detail.color.name}
                              />
                            )}
                            <span className="text-sm truncate max-w-[100px]" title={detail.color.name}>
                              {detail.color.name}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="p-2">
                          <span className="text-sm font-medium truncate inline-block max-w-[100px]" title={detail.capacity.name}>
                            {detail.capacity.name}
                          </span>
                        </TableCell>
                        <TableCell className="p-2">
                          <div className="space-y-1">
                            {detail.promotion && detail.promotion.isActive ? (
                              <>
                                <div className="flex items-center gap-2">
                                  <span className="line-through text-gray-500 text-xs">
                                    {formatCurrencyDisplay(detail.price)}
                                  </span>
                                  <Badge variant="destructive" className="text-xs px-2 py-0.5">
                                    <Tag className="w-3 h-3 mr-1" />
                                    {detail.promotion.discountType === "percentage"
                                      ? `-${detail.promotion.discountValue}%`
                                      : `-${formatCurrencyDisplay(detail.promotion.discountValue)}`}
                                  </Badge>
                                </div>
                                <div className="font-semibold text-red-600 text-sm">
                                  {formatCurrencyDisplay(calculateDiscountedPrice(detail.price, detail.promotion))} / sản phẩm
                                </div>
                                <div className="text-xs text-gray-600">
                                  Tiết kiệm: {formatCurrencyDisplay(calculateDiscountAmount(detail.price, detail.promotion))}
                                </div>
                              </>
                            ) : (
                              <span className="font-semibold text-blue-600 text-sm">
                                {formatCurrencyDisplay(detail.price)} / sản phẩm
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="p-2">
                          <Badge
                            variant={
                              detail.availableStock > 10
                                ? "default"
                                : detail.availableStock > 0
                                  ? "secondary"
                                  : "destructive"
                            }
                            className="text-xs"
                          >
                            {detail.availableStock}
                          </Badge>
                        </TableCell>
                        <TableCell className="p-2">
                          <div className="flex items-center gap-1">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateQuantity(detail.id, getQuantity(detail.id) - 1)}
                              disabled={getQuantity(detail.id) <= 1}
                              className="h-6 w-6 p-0"
                              aria-label={`Giảm số lượng sản phẩm chi tiết ${detail.productName} ${detail.color.name}`}
                            >
                              <Minus className="w-3 h-3" aria-hidden="true" />
                            </Button>
                            <Input
                              type="number"
                              min="1"
                              max={detail.availableStock}
                              value={getQuantity(detail.id)}
                              onChange={(e) => {
                                const value = Number.parseInt(e.target.value) || 1
                                if (value >= 1 && value <= detail.availableStock) {
                                  updateQuantity(detail.id, value)
                                }
                              }}
                              className="w-10 h-6 text-center text-xs p-1"
                              aria-label={`Số lượng sản phẩm chi tiết ${detail.productName} ${detail.color.name}`}
                            />
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateQuantity(detail.id, getQuantity(detail.id) + 1)}
                              disabled={getQuantity(detail.id) >= detail.availableStock}
                              className="h-6 w-6 p-0"
                              aria-label={`Tăng số lượng sản phẩm chi tiết ${detail.productName} ${detail.color.name}`}
                            >
                              <Plus className="w-3 h-3" aria-hidden="true" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell className="p-2">
                          <Button
                            onClick={() => handleAddToCart(detail)}
                            disabled={detail.availableStock === 0}
                            size="sm"
                            className="w-full h-7 text-xs"
                            aria-label={`Thêm ${detail.productName} vào giỏ hàng`}
                          >
                            <ShoppingCart className="w-3 h-3 mr-1" aria-hidden="true" />
                            Thêm
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}

                    {hasMore && (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-4">
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
                              "Tải thêm chi tiết sản phẩm"
                            )}
                          </Button>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

