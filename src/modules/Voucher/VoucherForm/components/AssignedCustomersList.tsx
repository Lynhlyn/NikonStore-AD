'use client';

import { getSimpleError } from '@/common/utils/handleForm';
import { useGetCustomersByVoucherQuery, useRemoveVoucherFromCustomerMutation } from '@/lib/services/modules/customerVoucherService';
import { useFetchVoucherByIdQuery } from '@/lib/services/modules/voucherService';
import { useState } from 'react';
import { toast } from 'sonner';

export interface AssignedCustomersListProps {
  voucherId: number;
  onRefresh?: () => void;
  isVoucherInactive?: boolean;
}

interface CustomerVoucher {
  customerId: number;
  customerName: string;
  voucher: {
    id: number;
    code: string;
    description: string;
    quantity: number;
    discountType: string;
    discountValue: number;
    minOrderValue: number;
    maxDiscount: number;
    startDate: string;
    endDate: string;
    usedCount: number;
    status: string;
    isPublic: boolean;
    createdAt: string;
    updatedAt: string;
  };
  usedAt: string | null;
  used: boolean;
}

export const AssignedCustomersList: React.FC<AssignedCustomersListProps> = ({
  voucherId,
  onRefresh,
  isVoucherInactive = false,
}) => {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [customerToRemove, setCustomerToRemove] = useState<CustomerVoucher | null>(null);

  const { data: voucherData, isLoading: isVoucherLoading, refetch: refetchVoucher, error: voucherError } = useFetchVoucherByIdQuery(voucherId, {
    refetchOnMountOrArgChange: true,
  });

  const { data: customersData, isLoading, refetch, error } = useGetCustomersByVoucherQuery({ voucherId }, {
    refetchOnMountOrArgChange: true,
  });

  const [removeVoucherFromCustomer, { isLoading: isRemoving }] = useRemoveVoucherFromCustomerMutation();

  const customers = customersData?.data || [];
  const totalCustomers = customersData?.total || 0;

  const filteredCustomers = customers.filter((customer: CustomerVoucher) => customer.customerId !== 1);

  const isVoucherExpired = voucherData?.endDate ? new Date(voucherData.endDate) < new Date() : false;

  const handleRemoveCustomerClick = (customer: CustomerVoucher) => {
    setCustomerToRemove(customer);
    setShowConfirmDialog(true);
  };

  const handleRemoveCustomer = async () => {
    if (!customerToRemove) return;

    try {
      await removeVoucherFromCustomer({ customerId: customerToRemove.customerId, voucherId }).unwrap();
      toast.success('Đã gỡ voucher khỏi khách hàng thành công');

      await refetch();
      onRefresh?.();

      setShowConfirmDialog(false);
      setCustomerToRemove(null);
    } catch (error: any) {
      const errorMessage = getSimpleError(error);
      toast.error(errorMessage);
    }
  };

  const handleCancelRemove = () => {
    setShowConfirmDialog(false);
    setCustomerToRemove(null);
  };

  const handleManualRefresh = async () => {
    try {
      await refetch();
      await refetchVoucher();
      onRefresh?.();
    } catch (error) {
      console.error('Error refreshing data:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={`loading-${i}`} className="h-16 bg-gray-100 rounded-lg animate-pulse"></div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <h3 className="text-sm font-medium text-gray-900 mb-2">Lỗi khi tải dữ liệu</h3>
        <p className="text-xs text-gray-600 mb-4">
          Không thể tải danh sách khách hàng. Vui lòng thử lại.
        </p>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm"
        >
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <>
      <div>
        {!customers || filteredCustomers.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="text-sm font-medium text-gray-900 mb-2">Chưa có khách hàng</h3>
            <p className="text-xs text-gray-600">
              Voucher này chưa được gán cho khách hàng nào.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredCustomers.map((customerVoucher: CustomerVoucher, index: number) => {
              if (!customerVoucher || !customerVoucher.customerId) {
                console.warn('Invalid customer voucher data:', customerVoucher);
                return null;
              }

              const isVoucherUsed = customerVoucher.used || customerVoucher.usedAt !== null;
              const canRemove = !isRemoving && !isVoucherExpired && !isVoucherInactive && !isVoucherUsed;

              return (
                <div
                  key={`customer-${customerVoucher.customerId}-${index}`}
                  className={`p-3 border rounded-lg transition-colors ${
                    isVoucherUsed
                      ? 'border-gray-300 bg-gray-50'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-gray-900 text-sm truncate">
                          {customerVoucher.customerName || 'Không có tên'}
                        </h4>
                        {isVoucherUsed && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700 whitespace-nowrap">
                            Đã sử dụng
                          </span>
                        )}
                      </div>
                      {isVoucherUsed && customerVoucher.usedAt && (
                        <p className="text-xs text-gray-500">
                          Sử dụng: {new Date(customerVoucher.usedAt).toLocaleString('vi-VN')}
                        </p>
                      )}
                    </div>

                    <button
                      onClick={() => handleRemoveCustomerClick(customerVoucher)}
                      disabled={!canRemove}
                      className={`p-2 rounded-lg transition-colors disabled:opacity-30 ${
                        !canRemove
                          ? 'text-gray-300 cursor-not-allowed'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                      title={
                        isVoucherInactive
                          ? "Không thể gỡ voucher không hoạt động"
                          : isVoucherExpired
                            ? "Không thể gỡ voucher đã hết hạn"
                            : isVoucherUsed
                              ? "Không thể gỡ voucher đã được sử dụng"
                              : "Gỡ voucher"
                      }
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {filteredCustomers.length > 0 && (
          <div className="mt-4 pt-3 border-t border-gray-200">
            <div className="text-xs text-gray-600">
              Tổng cộng {filteredCustomers.length} khách hàng
            </div>
          </div>
        )}
      </div>

      {showConfirmDialog && customerToRemove && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-lg">
            <h3 className="text-base font-medium text-gray-900 mb-2">Xác nhận gỡ voucher</h3>
            <p className="text-sm text-gray-600 mb-4">Hành động này không thể hoàn tác</p>

            <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-700 mb-2">
                Bạn có chắc chắn muốn gỡ voucher khỏi khách hàng{' '}
                <span className="font-medium text-gray-900">{customerToRemove.customerName}</span>?
              </p>
              <p className="text-xs text-gray-500">
                Khách hàng sẽ không thể sử dụng voucher này nữa.
              </p>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={handleCancelRemove}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm"
              >
                Hủy
              </button>
              <button
                onClick={handleRemoveCustomer}
                disabled={isRemoving}
                className="px-4 py-2 bg-gray-900 text-white hover:bg-gray-800 disabled:opacity-50 rounded-lg transition-colors text-sm"
              >
                {isRemoving ? 'Đang xử lý...' : 'Gỡ voucher'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

