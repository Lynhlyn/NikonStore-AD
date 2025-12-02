'use client';

import { Card } from '@/core/shadcn/components/ui/card';
import { Badge } from '@/core/shadcn/components/ui/badge';
import { useFetchReviewsByOrderIdQuery } from '@/lib/services/modules/reviewService';
import { format } from 'date-fns';
import Image from 'next/image';
import { Star } from 'lucide-react';
import { cn } from '@/core/shadcn/lib/utils';

interface OrderReviewsProps {
  orderId: number;
  orderDetails?: Array<{
    orderDetailId: number;
    productId?: number;
    productName?: string;
    imageUrl?: string;
    sku?: string;
  }>;
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

export function OrderReviews({ orderId, orderDetails = [] }: OrderReviewsProps) {
  const { data: reviewsResponse, isLoading } = useFetchReviewsByOrderIdQuery(orderId);

  const reviews = reviewsResponse?.data || [];

  // Create a map of productId to product name from orderDetails
  const productMap = new Map<number, { name: string; image: string }>();
  orderDetails.forEach((detail: any) => {
    // Try to get productId from different possible fields
    const productId = detail.productId || (detail as any).product_id;
    if (productId) {
      productMap.set(productId, {
        name: detail.productName || `Sản phẩm #${productId}`,
        image: detail.imageUrl || '/placeholder.svg',
      });
    }
  });

  if (isLoading) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Đánh giá khách hàng</h3>
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  if (reviews.length === 0) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold">Đánh giá khách hàng</h3>
        </div>
        <div className="text-center py-8 text-gray-500">
          <p>Chưa có đánh giá nào cho đơn hàng này</p>
        </div>
      </Card>
    );
  }

  // Group reviews by productId
  const reviewsByProduct = reviews.reduce((acc, review) => {
    if (!acc[review.productId]) {
      acc[review.productId] = [];
    }
    acc[review.productId].push(review);
    return acc;
  }, {} as Record<number, typeof reviews>);

  return (
    <Card className="p-6 border-l-4 border-l-purple-500">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
          <svg
            className="w-5 h-5 text-purple-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
            />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-gray-900">Đánh giá khách hàng</h3>
        <Badge className="bg-purple-100 text-purple-800 border-purple-300">
          {reviews.length} {reviews.length === 1 ? 'đánh giá' : 'đánh giá'}
        </Badge>
      </div>

      <div className="space-y-6">
        {Object.entries(reviewsByProduct).map(([productId, productReviews]) => {
          const productInfo = productMap.get(Number(productId)) || {
            name: `Sản phẩm #${productId}`,
            image: '/placeholder.svg',
          };
          return (
            <div key={productId} className="border-b last:border-b-0 pb-6 last:pb-0">
              <div className="flex items-start gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                <Image
                  src={productInfo.image}
                  alt={productInfo.name}
                  width={60}
                  height={60}
                  className="rounded-lg object-cover border border-gray-200 flex-shrink-0"
                />
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-1">{productInfo.name}</h4>
                  <p className="text-sm text-gray-500">
                    {productReviews.length}{' '}
                    {productReviews.length === 1 ? 'đánh giá' : 'đánh giá'}
                  </p>
                </div>
              </div>

            <div className="space-y-4">
              {productReviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-gray-50 rounded-lg p-4 border border-gray-200"
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
                        <Badge
                          className={cn(
                            review.status === 1
                              ? 'bg-green-100 text-green-800 border-green-300'
                              : review.status === 0
                              ? 'bg-yellow-100 text-yellow-800 border-yellow-300'
                              : 'bg-red-100 text-red-800 border-red-300'
                          )}
                        >
                          {review.status === 1
                            ? 'Đã duyệt'
                            : review.status === 0
                            ? 'Chờ duyệt'
                            : 'Từ chối'}
                        </Badge>
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
        );
        })}
      </div>
    </Card>
  );
}

