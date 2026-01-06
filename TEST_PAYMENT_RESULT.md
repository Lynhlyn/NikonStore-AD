# Test URLs cho VNPay Payment Result Page

## 1. Test thanh toán THÀNH CÔNG
http://localhost:3001/pos/payment-result?vnp_Amount=10000000&vnp_BankCode=NCB&vnp_BankTranNo=VNP14747200&vnp_CardType=ATM&vnp_OrderInfo=Thanh+toan+don+hang+POS+ORD123456&vnp_PayDate=20260106212500&vnp_ResponseCode=00&vnp_TmnCode=561DXB40&vnp_TransactionNo=14747200&vnp_TransactionStatus=00&vnp_TxnRef=ORD123456&vnp_SecureHash=abc123

## 2. Test thanh toán THẤT BẠI - Khách hàng hủy
http://localhost:3001/pos/payment-result?vnp_Amount=10000000&vnp_BankCode=NCB&vnp_OrderInfo=Thanh+toan+don+hang+POS+ORD123456&vnp_ResponseCode=24&vnp_TmnCode=561DXB40&vnp_TxnRef=ORD123456&vnp_SecureHash=abc123

## 3. Test thanh toán THẤT BẠI - Không đủ tiền
http://localhost:3001/pos/payment-result?vnp_Amount=10000000&vnp_BankCode=NCB&vnp_OrderInfo=Thanh+toan+don+hang+POS+ORD123456&vnp_ResponseCode=51&vnp_TmnCode=561DXB40&vnp_TxnRef=ORD123456&vnp_SecureHash=abc123

## 4. Test thanh toán THẤT BẠI - Hết hạn
http://localhost:3001/pos/payment-result?vnp_Amount=10000000&vnp_BankCode=NCB&vnp_OrderInfo=Thanh+toan+don+hang+POS+ORD123456&vnp_ResponseCode=11&vnp_TmnCode=561DXB40&vnp_TxnRef=ORD123456&vnp_SecureHash=abc123

## Giải thích các tham số:
- vnp_Amount: Số tiền (đơn vị: VNĐ * 100, ví dụ: 10000000 = 100,000 VNĐ)
- vnp_BankCode: Mã ngân hàng
- vnp_ResponseCode: Mã kết quả giao dịch
  - 00: Thành công
  - 24: Khách hàng hủy
  - 51: Không đủ tiền
  - 11: Hết hạn
- vnp_TxnRef: Mã đơn hàng
- vnp_TransactionNo: Mã giao dịch VNPay

## Lưu ý:
- Trang này KHÔNG yêu cầu đăng nhập
- Trang này sẽ GỌI API backend để cập nhật đơn hàng: `GET /api/v1/pos/vnpay/callback`
- Backend sẽ verify signature và cập nhật trạng thái đơn hàng
- Nếu API call thất bại, trang vẫn hiển thị kết quả nhưng có thông báo "Đang cập nhật hệ thống..."

## Kiểm tra API call:
1. Mở Developer Tools (F12)
2. Vào tab Network
3. Paste URL test vào browser
4. Xem request đến `/api/v1/pos/vnpay/callback`
5. Kiểm tra response từ backend

## Kiểm tra đơn hàng đã được cập nhật:
1. Vào trang quản lý đơn POS trong Admin
2. Tìm đơn hàng theo mã (vnp_TxnRef)
3. Kiểm tra status đã chuyển sang COMPLETED chưa
4. Kiểm tra stock đã được trừ chưa
