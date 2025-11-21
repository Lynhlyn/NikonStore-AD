import type { EmailAction as EmailActionType } from '@/lib/services/modules/templateEmailService/type';

export type EmailActionOption = {
  value: EmailActionType;
  label: string;
};

export const EMAIL_ACTION_OPTIONS: EmailActionOption[] = [
  { value: 'REGISTER_SUCCESS', label: 'Đăng ký thành công' },
  { value: 'CLIENT_FORGOT_PASSWORD', label: 'Quên mật khẩu khách hàng' },
  { value: 'FORGOT_PASSWORD', label: 'Quên mật khẩu khách hàng (Legacy)' },
  { value: 'ADMIN_FORGOT_PASSWORD', label: 'Quên mật khẩu admin' },
  { value: 'RESET_PASSWORD', label: 'Quên mật khẩu admin (Legacy)' },
  { value: 'PASSWORD_RESET', label: 'Đặt lại mật khẩu' },
  { value: 'PASSWORD_CHANGED', label: 'Mật khẩu đã được thay đổi' },
  { value: 'VERIFY_EMAIL', label: 'Xác thực email' },
  { value: 'WELCOME', label: 'Chào mừng' },
  { value: 'ORDER_PENDING_CONFIRMATION', label: 'Đơn hàng chờ xác nhận' },
  { value: 'ORDER_CONFIRMATION', label: 'Xác nhận đơn hàng' },
  { value: 'ORDER_CONFIRM', label: 'Xác nhận đơn hàng nhanh' },
  { value: 'CONFIRMATION', label: 'Xác nhận chung' },
  { value: 'ORDER_CONFIRMED', label: 'Đơn hàng đã xác nhận' },
  { value: 'ORDER_PREPARING', label: 'Đơn hàng đang chuẩn bị' },
  { value: 'ORDER_SHIPPING', label: 'Đơn hàng đang giao' },
  { value: 'ORDER_COMPLETED', label: 'Đơn hàng hoàn thành' },
  { value: 'ORDER_CANCELLED', label: 'Đơn hàng đã hủy' },
  { value: 'ORDER_PENDING_PAYMENT', label: 'Đơn hàng chờ thanh toán' },
  { value: 'ORDER_FAILED_DELIVERY', label: 'Đơn hàng giao thất bại' },
  { value: 'ACCOUNT_LOCKED', label: 'Tài khoản bị khóa' },
  { value: 'ACCOUNT_UNLOCKED', label: 'Tài khoản được mở khóa' },
  { value: 'ACCOUNT_DISABLED', label: 'Tài khoản bị vô hiệu hóa' },
  { value: 'PROMOTION', label: 'Khuyến mãi' },
  { value: 'NEWSLETTER', label: 'Bản tin' },
  { value: 'BRANDSNEW', label: 'Thương hiệu mới' },
  { value: 'AUTHENTICATION_CODE', label: 'Mã xác thực' },
  { value: 'VOUCHER_ASSIGNED', label: 'Voucher được gán' },
];

export const EMAIL_ACTION_LABEL_MAP: Record<EmailActionType, string> = EMAIL_ACTION_OPTIONS.reduce(
  (acc, option) => {
    acc[option.value] = option.label;
    return acc;
  },
  {} as Record<EmailActionType, string>
);

export const getEmailActionLabel = (action: string) =>
  EMAIL_ACTION_LABEL_MAP[action as EmailActionType] ?? action;

