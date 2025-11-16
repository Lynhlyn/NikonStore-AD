'use client';

import { getSimpleError } from '@/common/utils/handleForm';
import { getStatusEnumStringWithAll } from '@/common/utils/statusOption';
import { useGetCustomersByVoucherQuery, useRemoveVoucherFromCustomerMutation } from '@/lib/services/modules/customerVoucherService';
import { useFetchVoucherByIdQuery } from '@/lib/services/modules/voucherService';
import { AlertTriangle, CheckCircle, Trash2, UserCheck, Users } from 'lucide-react';
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
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-gray-200 rounded-lg animate-pulse"></div>
          <div className="h-6 bg-gray-200 rounded w-48 animate-pulse"></div>
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={`loading-${i}`} className="h-20 bg-gray-200 rounded-lg animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="text-center py-12">
          <div className="text-red-500 mb-4">
            <AlertTriangle className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Lỗi khi tải dữ liệu</h3>
          <p className="text-gray-600 mb-4">
            Không thể tải danh sách khách hàng. Vui lòng thử lại.
          </p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-bgPrimarySolidDefault text-white rounded-lg hover:bg-bgPrimarySolidHover transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Khách hàng đã được gán voucher
              </h3>
              <p className="text-sm text-gray-600">
                Tổng cộng {filteredCustomers.length} khách hàng
              </p>
            </div>
          </div>
          <button
            onClick={handleManualRefresh}
            className="px-3 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center gap-2"
            title="Làm mới danh sách"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Làm mới
          </button>
        </div>

        {!customers || filteredCustomers.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có khách hàng nào</h3>
            <p className="text-gray-600">
              Voucher này chưa được gán cho khách hàng nào.
              <br />
              Hãy sử dụng nút "Chọn khách hàng dùng voucher" ở trên để gán voucher.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
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
                  className={`p-4 border rounded-lg transition-colors ${isVoucherUsed
                      ? 'border-green-200 bg-green-50/50'
                      : 'border-gray-200 hover:border-gray-300 bg-gray-50/50'
                    }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isVoucherUsed ? 'bg-green-100' : 'bg-blue-100'
                          }`}>
                          {isVoucherUsed ? (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          ) : (
                            <UserCheck className="w-5 h-5 text-blue-600" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-gray-900">{customerVoucher.customerName || 'Không có tên'}</h4>
                            {isVoucherUsed && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                                Đã sử dụng
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            {isVoucherUsed && customerVoucher.usedAt && (
                              <div className="flex items-center gap-1">
                                <CheckCircle className="w-3 h-3" />
                                Sử dụng lúc: {new Date(customerVoucher.usedAt).toLocaleString('vi-VN')}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 ml-4">
                      <button
                        onClick={() => handleRemoveCustomerClick(customerVoucher)}
                        disabled={!canRemove}
                        className={`p-2 rounded-lg transition-colors disabled:opacity-50 ${!canRemove
                            ? 'text-gray-400 cursor-not-allowed'
                            : 'text-red-600 hover:text-red-700 hover:bg-red-50'
                          }`}
                        title={
                          isVoucherInactive
                            ? "Không thể gỡ voucher không hoạt động"
                            : isVoucherExpired
                              ? "Không thể gỡ voucher đã hết hạn"
                              : isVoucherUsed
                                ? "Không thể gỡ voucher đã được sử dụng"
                                : "Gỡ voucher khỏi khách hàng"
                        }
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-6 flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="text-sm text-gray-700">
            Hiển thị {filteredCustomers.length} trong tổng số {totalCustomers} khách hàng
          </div>
        </div>
      </div>

      {showConfirmDialog && customerToRemove && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Xác nhận gỡ voucher</h3>
                <p className="text-sm text-gray-600">Hành động này không thể hoàn tác</p>
              </div>
            </div>

            <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-700">
                Bạn có chắc chắn muốn gỡ voucher khỏi khách hàng{' '}
                <span className="font-medium text-gray-900">{customerToRemove.customerName}</span>?
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Khách hàng sẽ không thể sử dụng voucher này nữa.
              </p>
              {customerToRemove.used && customerToRemove.usedAt && (
                <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    <strong>Lưu ý:</strong> Voucher này đã được sử dụng lúc{' '}
                    {new Date(customerToRemove.usedAt).toLocaleString('vi-VN')}
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={handleCancelRemove}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleRemoveCustomer}
                disabled={isRemoving}
                className="px-4 py-2 bg-bgPrimarySolidDefault text-white hover:bg-bgPrimarySolidHover disabled:opacity-50 rounded-lg transition-colors flex items-center gap-2"
              >
                {isRemoving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Đang xử lý...
                  </>
                ) : (
                  'Gỡ voucher'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

