export const PAYMENT_STATUS_LABELS: { [key: string]: string } = {
  completed: 'Đã thanh toán',
  pending: 'Chờ thanh toán',
  failed: 'Thanh toán thất bại',
  cancelled: 'Đã hủy',
  refunded: 'Đã hoàn tiền',
};

export function getPaymentStatusLabel(status: string | null | undefined): string {
  if (!status) return '-';
  return PAYMENT_STATUS_LABELS[status.toLowerCase()] || status;
}

