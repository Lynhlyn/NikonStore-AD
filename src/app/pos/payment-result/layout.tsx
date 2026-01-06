import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kết quả thanh toán - Nikon Store',
  description: 'Kết quả thanh toán VNPay cho đơn hàng POS',
};

export default function PaymentResultLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
