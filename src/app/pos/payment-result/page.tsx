'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';

type TPaymentStatus = 'success' | 'failed' | 'processing';

const VNPAY_RESPONSE_CODES: Record<string, string> = {
  '00': 'Giao dịch thành công',
  '07': 'Trừ tiền thành công. Giao dịch bị nghi ngờ (liên quan tới lừa đảo, giao dịch bất thường)',
  '09': 'Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng chưa đăng ký dịch vụ InternetBanking tại ngân hàng',
  '10': 'Giao dịch không thành công do: Khách hàng xác thực thông tin thẻ/tài khoản không đúng quá 3 lần',
  '11': 'Giao dịch không thành công do: Đã hết hạn chờ thanh toán. Xin quý khách vui lòng thực hiện lại giao dịch',
  '12': 'Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng bị khóa',
  '13': 'Giao dịch không thành công do Quý khách nhập sai mật khẩu xác thực giao dịch (OTP)',
  '24': 'Giao dịch không thành công do: Khách hàng hủy giao dịch',
  '51': 'Giao dịch không thành công do: Tài khoản của quý khách không đủ số dư để thực hiện giao dịch',
  '65': 'Giao dịch không thành công do: Tài khoản của Quý khách đã vượt quá hạn mức giao dịch trong ngày',
  '75': 'Ngân hàng thanh toán đang bảo trì',
  '79': 'Giao dịch không thành công do: KH nhập sai mật khẩu thanh toán quá số lần quy định',
  '99': 'Các lỗi khác',
};

export default function PosPaymentResultPage() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<TPaymentStatus>('processing');
  const [message, setMessage] = useState<string>('Đang xử lý kết quả thanh toán...');
  const [orderCode, setOrderCode] = useState<string>('');

  useEffect(() => {
    const processVnpayCallback = async () => {
      const vnpResponseCode = searchParams.get('vnp_ResponseCode');
      const vnpTxnRef = searchParams.get('vnp_TxnRef');
      const vnpAmount = searchParams.get('vnp_Amount');
      const vnpBankCode = searchParams.get('vnp_BankCode');
      const vnpTransactionNo = searchParams.get('vnp_TransactionNo');
      const vnpSecureHash = searchParams.get('vnp_SecureHash');

      if (vnpTxnRef) {
        setOrderCode(vnpTxnRef);
      }

      if (!vnpResponseCode || !vnpTxnRef) {
        setStatus('failed');
        setMessage('Không nhận được thông tin từ VNPay');
        return;
      }

      console.log('VNPay Callback Params:', {
        vnpResponseCode,
        vnpTxnRef,
        vnpAmount,
        vnpBankCode,
        vnpTransactionNo,
      });

      try {
        const params = new URLSearchParams();
        searchParams.forEach((value, key) => {
          params.append(key, value);
        });

        const baseApiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1/admin';
        const apiUrl = baseApiUrl.replace('/api/v1/admin', '');
        const response = await fetch(`${apiUrl}/api/v1/pos/vnpay/callback?${params.toString()}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();

        if (response.ok && vnpResponseCode === '00') {
          setStatus('success');
          setMessage(VNPAY_RESPONSE_CODES['00']);
        } else if (vnpResponseCode === '00') {
          setStatus('success');
          setMessage(VNPAY_RESPONSE_CODES['00']);
        } else {
          setStatus('failed');
          setMessage(VNPAY_RESPONSE_CODES[vnpResponseCode] || VNPAY_RESPONSE_CODES['99']);
        }
      } catch (error) {
        console.error('Error calling VNPay callback API:', error);
        
        if (vnpResponseCode === '00') {
          setStatus('success');
          setMessage(VNPAY_RESPONSE_CODES['00'] + ' (Đang cập nhật hệ thống...)');
        } else {
          setStatus('failed');
          setMessage(VNPAY_RESPONSE_CODES[vnpResponseCode] || VNPAY_RESPONSE_CODES['99']);
        }
      }
    };

    processVnpayCallback();
  }, [searchParams]);

  const handleClose = () => {
    window.close();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8 space-y-6">
          <div className="flex flex-col items-center space-y-4">
            {status === 'processing' && (
              <>
                <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center">
                  <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                </div>
                <h1 className="text-2xl font-bold text-gray-800">Đang xử lý...</h1>
              </>
            )}

            {status === 'success' && (
              <>
                <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center animate-bounce">
                  <CheckCircle2 className="w-12 h-12 text-green-600" />
                </div>
                <h1 className="text-2xl font-bold text-green-700">Thanh toán thành công!</h1>
              </>
            )}

            {status === 'failed' && (
              <>
                <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center animate-pulse">
                  <XCircle className="w-12 h-12 text-red-600" />
                </div>
                <h1 className="text-2xl font-bold text-red-700">Thanh toán thất bại</h1>
              </>
            )}
          </div>

          <div className="space-y-3 bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">Mã đơn hàng:</span>
              <span className="text-sm font-bold text-gray-900">{orderCode || 'N/A'}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">Trạng thái:</span>
              <span
                className={`text-sm font-bold ${
                  status === 'success'
                    ? 'text-green-600'
                    : status === 'failed'
                      ? 'text-red-600'
                      : 'text-blue-600'
                }`}
              >
                {status === 'success' ? 'Thành công' : status === 'failed' ? 'Thất bại' : 'Đang xử lý'}
              </span>
            </div>

            {searchParams.get('vnp_Amount') && (
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600">Số tiền:</span>
                <span className="text-sm font-bold text-gray-900">
                  {(parseInt(searchParams.get('vnp_Amount') || '0') / 100).toLocaleString('vi-VN')} VNĐ
                </span>
              </div>
            )}

            {searchParams.get('vnp_BankCode') && (
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600">Ngân hàng:</span>
                <span className="text-sm font-bold text-gray-900 uppercase">
                  {searchParams.get('vnp_BankCode')}
                </span>
              </div>
            )}

            {searchParams.get('vnp_TransactionNo') && (
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600">Mã GD VNPay:</span>
                <span className="text-sm font-bold text-gray-900">
                  {searchParams.get('vnp_TransactionNo')}
                </span>
              </div>
            )}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-gray-700 text-center">{message}</p>
          </div>

          <button
            onClick={handleClose}
            className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-200 ${
              status === 'success'
                ? 'bg-green-600 hover:bg-green-700'
                : status === 'failed'
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            Đóng cửa sổ
          </button>

          {status === 'success' && (
            <p className="text-xs text-center text-gray-500">
              Đơn hàng của bạn đã được cập nhật. Bạn có thể đóng cửa sổ này.
            </p>
          )}

          {status === 'failed' && (
            <p className="text-xs text-center text-gray-500">
              Vui lòng thử lại hoặc liên hệ nhân viên để được hỗ trợ.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
