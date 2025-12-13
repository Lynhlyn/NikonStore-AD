export const PAYMENT_METHODS = {
  COD: 'COD',
  VNPAY: 'VNPAY',
  CASH: 'cash',
  VNPAYQR: 'VNPAY-QR'
} as const;

export const PAYMENT_METHOD_LABELS = {
  [PAYMENT_METHODS.COD]: 'Thanh toán khi nhận hàng',
  [PAYMENT_METHODS.CASH]: 'Thanh toán tại quầy',
  [PAYMENT_METHODS.VNPAYQR]: 'VN-PAY',
  [PAYMENT_METHODS.VNPAY]: 'VN-PAY',
} as const;

export type PaymentMethod = keyof typeof PAYMENT_METHODS;

export function getPaymentMethodLabel(method: string | null | undefined): string {
  if (!method) {
    return 'Chưa xác định';
  }
  
  const normalizedMethod = method.toUpperCase();
  
  if (normalizedMethod === PAYMENT_METHODS.COD) {
    return PAYMENT_METHOD_LABELS[PAYMENT_METHODS.COD];
  }
  
  if (normalizedMethod === PAYMENT_METHODS.CASH || normalizedMethod === 'CASH') {
    return PAYMENT_METHOD_LABELS[PAYMENT_METHODS.CASH];
  }
  
  if (normalizedMethod === PAYMENT_METHODS.VNPAYQR || normalizedMethod === 'VNPAY-QR') {
    return PAYMENT_METHOD_LABELS[PAYMENT_METHODS.VNPAYQR];
  }
  
  if (normalizedMethod === PAYMENT_METHODS.VNPAY) {
    return PAYMENT_METHOD_LABELS[PAYMENT_METHODS.VNPAY];
  }
  
  return 'Chưa xác định';
}

