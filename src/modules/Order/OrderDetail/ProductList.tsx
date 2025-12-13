'use client';

import { ProductListProps } from './types';
import { useFetchReviewsByOrderIdQuery } from '@/lib/services/modules/reviewService';
import { format } from 'date-fns';
import Image from 'next/image';
import { Star } from 'lucide-react';
import { cn } from '@/core/shadcn/lib/utils';

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount);
}

function StarRating({ rating, size = 16 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          className={cn(
            star <= rating
              ? 'fill-yellow-400 text-yellow-400'
              : 'fill-gray-200 text-gray-200'
          )}
        />
      ))}
    </div>
  );
}

export function ProductList({ items, orderId }: ProductListProps) {
  const { data: reviewsResponse } = useFetchReviewsByOrderIdQuery(orderId || 0, {
    skip: !orderId,
  });

  const reviews = reviewsResponse?.data || [];

  const reviewsByProductId = reviews.reduce((acc, review) => {
    if (!acc[review.productId]) {
      acc[review.productId] = [];
    }
    acc[review.productId].push(review);
    return acc;
  }, {} as Record<number, Array<typeof reviews[number]>>);

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
      <h3 className="text-xl font-bold mb-6 text-gray-800 pb-3 border-b border-gray-200">Danh sách sản phẩm</h3>
      {items && items.length > 0 ? (
        <div>
          <div className="grid grid-cols-12 gap-4 items-center mb-4 pb-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg px-4 py-3 border-b-2 border-gray-200 font-semibold text-sm text-gray-700">
            <div className="col-span-1">STT</div>
            <div className="col-span-2">SKU</div>
            <div className="col-span-4">Tên sản phẩm</div>
            <div className="col-span-1 text-center">Số lượng</div>
            <div className="col-span-2 text-right">Đơn giá</div>
            <div className="col-span-2 text-right">Thành tiền</div>
          </div>
          <div className="space-y-6">
            {items.map((item, index) => {
              const productId = item.productId;
              const productReviews = productId ? reviewsByProductId[productId] || [] : [];

              return (
              <div key={item.orderDetailId || index} className="border-b border-gray-200 last:border-b-0 pb-6 last:pb-0 hover:bg-gray-50 rounded-lg px-4 py-3 transition-colors duration-200">
                <div className="grid grid-cols-12 gap-4 items-center mb-4">
                  <div className="col-span-1 text-sm text-gray-600">{index + 1}</div>
                  <div className="col-span-2 text-sm text-gray-600">{item.sku || '-'}</div>
                  <div className="col-span-4">
                    <div className="flex items-center gap-3">
                      {item.imageUrl ? (
                        <Image
                          src={item.imageUrl}
                          alt={item.productName || 'Product'}
                          width={70}
                          height={70}
                          className="rounded-lg object-cover border-2 border-gray-200 shadow-sm flex-shrink-0 hover:shadow-md transition-shadow"
                          unoptimized
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://cdn-app.sealsubscriptions.com/shopify/public/img/promo/no-image-placeholder.png';
                          }}
                        />
                      ) : (
                        <div className="w-[70px] h-[70px] rounded-lg border-2 border-gray-200 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center flex-shrink-0 shadow-sm">
                          <span className="text-xs text-gray-500 font-medium">No Image</span>
                        </div>
                      )}
                      <span className="font-medium">{item.productName || '-'}</span>
                    </div>
                  </div>
                  <div className="col-span-1 text-center text-sm">{item.quantity || 0}</div>
                  <div className="col-span-2 text-right text-sm">{formatCurrency(item.price || 0)}</div>
                  <div className="col-span-2 text-right font-semibold">
                    {formatCurrency((item.price || 0) * (item.quantity || 0))}
                  </div>
                </div>

                {productReviews.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-200 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 shadow-sm">
                    <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      Đánh giá ({productReviews.length})
                    </h4>
                    <div className="space-y-3">
                      {productReviews.map((review) => (
                        <div
                          key={review.id}
                          className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-medium text-sm flex-shrink-0">
                              {review.customer.fullName.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-3 mb-2 flex-wrap">
                                <span className="font-semibold text-gray-900">
                                  {review.customer.fullName}
                                </span>
                                <StarRating rating={review.rating} size={16} />
                                <span className="text-xs text-gray-500">
                                  {format(new Date(review.createdAt), 'dd/MM/yyyy HH:mm')}
                                </span>
                              </div>

                              {review.comment && (
                                <p className="text-sm text-gray-700 mb-3 break-words">
                                  {review.comment}
                                </p>
                              )}

                              {review.reviewImages && review.reviewImages.length > 0 && (
                                <div className="flex gap-2 flex-wrap mt-3">
                                  {review.reviewImages.map((img) => (
                                    <Image
                                      key={img.id}
                                      src={img.imageUrl}
                                      alt="Review image"
                                      width={80}
                                      height={80}
                                      className="rounded-lg object-cover border border-gray-200"
                                    />
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <p>Không có sản phẩm</p>
        </div>
      )}
    </div>
  );
}

