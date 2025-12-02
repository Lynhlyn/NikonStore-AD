'use client';

import { useParams, useSearchParams } from 'next/navigation';
import { OrderDetail } from '@/modules/Order/OrderDetail';

interface OrderDetailPageProps {
  params: {
    id: string;
  };
}

export default function OrderDetailPage({ params }: OrderDetailPageProps) {
  const searchParams = useSearchParams();
  const orderId = parseInt(params.id);
  const source = searchParams.get('source') || 'online';

  return <OrderDetail orderId={orderId} source={source} />;
}

