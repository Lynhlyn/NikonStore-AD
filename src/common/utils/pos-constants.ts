export const PAYMENT_METHODS = [
  { value: "cash", label: "Tiền mặt", icon: "💵" },
  { value: "VNPAY-QR", label: "Chuyển khoản VNPAY-QR", icon: "📱" },
];

export const ORDER_STATUS = {
  PENDING: "Chờ xử lý",
  COMPLETED: "Hoàn thành",
  CANCELLED: "Đã hủy",
} as const;

export const PRODUCT_STATUS = {
  ACTIVE: "Hoạt động",
  INACTIVE: "Không hoạt động",
} as const;

export const PAYMENT_STATUS = {
  PENDING: "Chờ thanh toán",
  PAID: "Đã thanh toán",
  CANCELLED: "Đã hủy",
} as const;

export const MESSAGES = {
  SUCCESS: {
    ORDER_CREATED: "Đơn hàng đã được tạo thành công!",
    ORDER_COMPLETED: "Đơn hàng đã được hoàn tất!",
    PRODUCT_ADDED: "Đã thêm sản phẩm vào đơn hàng!",
    QUANTITY_UPDATED: "Đã cập nhật số lượng!",
  },
  ERROR: {
    SELECT_ORDER_FIRST: "Vui lòng chọn đơn hàng trước khi thêm sản phẩm!",
    EMPTY_ORDER: "Đơn hàng trống, không thể hoàn tất!",
    INSUFFICIENT_PAYMENT: "Số tiền nhận không đủ!",
    CREATE_ORDER_FAILED: "Không thể tạo đơn hàng!",
    COMPLETE_ORDER_FAILED: "Không thể hoàn tất đơn hàng!",
    ADD_PRODUCT_FAILED: "Không thể thêm sản phẩm vào đơn hàng!",
    UPDATE_QUANTITY_FAILED: "Không thể cập nhật số lượng!",
    SELECT_ORDER: "Chưa chọn đơn hàng!",
    MAX_PENDING_ORDERS: "Chỉ được tạo tối đa 5 đơn hàng chờ cùng lúc!",
  },
  WARNING: {
    SELECT_ORDER_TO_START: "Vui lòng chọn đơn hàng để bắt đầu",
  },
} as const;
