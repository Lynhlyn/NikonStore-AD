export enum EOrderCancelReason {
  CUSTOMER_REQUEST = 'CUSTOMER_REQUEST',
  DUPLICATE_ORDER = 'DUPLICATE_ORDER',
  INVALID_INFO = 'INVALID_INFO',
  SUSPECTED_FRAUD = 'SUSPECTED_FRAUD',
  SYSTEM_ERROR = 'SYSTEM_ERROR',
  OTHER = 'OTHER'
}

export const ORDER_CANCEL_REASONS = [
  {
    value: EOrderCancelReason.CUSTOMER_REQUEST,
    label: 'Khách yêu cầu hủy'
  },
  {
    value: EOrderCancelReason.DUPLICATE_ORDER,
    label: 'Đơn hàng trùng lặp'
  },
  {
    value: EOrderCancelReason.INVALID_INFO,
    label: 'Thông tin đặt hàng không chính xác'
  },
  {
    value: EOrderCancelReason.SUSPECTED_FRAUD,
    label: 'Đơn hàng nghi ngờ gian lận'
  },
  {
    value: EOrderCancelReason.SYSTEM_ERROR,
    label: 'Lỗi hệ thống / tạo nhầm đơn'
  },
  {
    value: EOrderCancelReason.OTHER,
    label: 'Lý do khác'
  }
];

export enum EDeliveryFailedReason {
  CUSTOMER_REJECTED = 'CUSTOMER_REJECTED',
  CANNOT_CONTACT = 'CANNOT_CONTACT',
  WRONG_ADDRESS = 'WRONG_ADDRESS',
  OUT_OF_AREA = 'OUT_OF_AREA',
  DELIVERY_ERROR = 'DELIVERY_ERROR',
  OTHER = 'OTHER'
}

export const DELIVERY_FAILED_REASONS = [
  {
    value: EDeliveryFailedReason.CUSTOMER_REJECTED,
    label: 'Khách không muốn nhận hàng'
  },
  {
    value: EDeliveryFailedReason.CANNOT_CONTACT,
    label: 'Gọi nhiều lần không bắt máy'
  },
  {
    value: EDeliveryFailedReason.WRONG_ADDRESS,
    label: 'Sai địa chỉ, không tìm được'
  },
  {
    value: EDeliveryFailedReason.OUT_OF_AREA,
    label: 'Địa chỉ ngoài phạm vi giao hàng'
  },
  {
    value: EDeliveryFailedReason.DELIVERY_ERROR,
    label: 'Shipper gặp sự cố (tai nạn, hàng hỏng, hệ thống lỗi)'
  },
  {
    value: EDeliveryFailedReason.OTHER,
    label: 'Lý do khác'
  }
];

