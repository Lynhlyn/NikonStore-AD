'use client';

import { EStatusEnumString } from '@/common/enums/status';
import { ConfirmModal } from '@/common/components/ConfirmModal';
import { AssignedCustomersList } from '@/modules/Voucher/VoucherForm/components/AssignedCustomersList';
import { CustomerSelectionModal } from '@/modules/Voucher/VoucherForm/components/CustomerSelectionModal';
import { useVoucherFormProvider, VoucherFormContext } from '@/modules/Voucher/VoucherForm/components/useVoucherFormControl';
import { VoucherFormControl } from '@/modules/Voucher/VoucherForm/components/VoucherFormControl';
import { IVoucherProps } from '@/modules/Voucher/VoucherForm/page';
import { FC, useCallback, useEffect, useState } from 'react';

const VoucherForm: FC<IVoucherProps> = ({ id, isViewMode }) => {
  const formProvider = useVoucherFormProvider(id, isViewMode);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [localIsPrivateVoucher, setLocalIsPrivateVoucher] = useState(false);
  const [selectedCustomerIds, setSelectedCustomerIds] = useState<number[]>([]);

  const handleCustomerModalSuccess = useCallback(() => {
    setRefreshKey(prev => prev + 1);
  }, []);

  const handleCustomerListRefresh = useCallback(() => {
    setRefreshKey(prev => prev + 1);
  }, []);

  useEffect(() => {
    setLocalIsPrivateVoucher(formProvider.isPrivateVoucher);
  }, [formProvider.isPrivateVoucher]);

  useEffect(() => {
    const watchedIsPublic = formProvider.watch('isPublic');
    setLocalIsPrivateVoucher(watchedIsPublic === false);
  }, [formProvider.watch('isPublic')]);

  const currentStatus = formProvider.watch('status');
  const isVoucherInactive = currentStatus === EStatusEnumString.INACTIVE;

  return (
    <VoucherFormContext.Provider value={formProvider}>
      <div className="w-full space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-6 pb-4 border-b border-gray-200">
                Thông tin voucher
              </h2>
              <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <VoucherFormControl.CodeInput />
                  <VoucherFormControl.QuantityInput />
                </div>
                <VoucherFormControl.DescriptionInput />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <VoucherFormControl.DiscountTypeInput />
                  <VoucherFormControl.DiscountValueInput />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <VoucherFormControl.MinOrderValueInput />
                  <VoucherFormControl.MaxDiscountInput />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <VoucherFormControl.StartDateInput />
                  <VoucherFormControl.EndDateInput />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <VoucherFormControl.IsPublicInput />
                  <VoucherFormControl.StatusInput />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <VoucherFormControl.Button />
            </div>

            {localIsPrivateVoucher && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="mb-5 pb-4 border-b border-gray-200">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <h3 className="text-base font-medium text-gray-900">
                      Khách hàng được cấp quyền
                    </h3>
                    {!isViewMode && (
                      <button
                        onClick={() => setIsCustomerModalOpen(true)}
                        disabled={isVoucherInactive}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                          isVoucherInactive
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-gray-900 text-white hover:bg-gray-800'
                        }`}
                        title={
                          isVoucherInactive
                            ? 'Không thể gán khách hàng cho voucher không hoạt động'
                            : 'Chọn khách hàng'
                        }
                      >
                        Chọn khách hàng
                      </button>
                    )}
                  </div>
                </div>

                {id ? (
                  <>
                    {isVoucherInactive && (
                      <div className="mb-4 bg-gray-50 border border-gray-300 rounded-lg p-3">
                        <p className="text-sm font-medium text-gray-900 mb-1">
                          Voucher không hoạt động
                        </p>
                        <p className="text-xs text-gray-600">
                          Không thể gán hoặc gỡ khách hàng cho voucher đã hết hạn hoặc bị vô hiệu hóa.
                        </p>
                      </div>
                    )}
                    <AssignedCustomersList
                      voucherId={id}
                      onRefresh={handleCustomerListRefresh}
                      key={`customer-list-${refreshKey}`}
                      isVoucherInactive={isVoucherInactive}
                    />
                  </>
                ) : (
                  <div className="py-8">
                    {selectedCustomerIds.length > 0 ? (
                      <div className="space-y-3">
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-900">
                              Đã chọn {selectedCustomerIds.length} khách hàng
                            </span>
                            <button
                              onClick={() => setIsCustomerModalOpen(true)}
                              className="text-xs text-gray-600 hover:text-gray-900 underline"
                            >
                              Chỉnh sửa
                            </button>
                          </div>
                          <p className="text-xs text-gray-500">
                            Khách hàng sẽ được gán khi lưu voucher
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <p className="text-sm text-gray-500 mb-3">
                          Chưa chọn khách hàng
                        </p>
                        {!isViewMode && (
                          <button
                            onClick={() => setIsCustomerModalOpen(true)}
                            className="text-sm text-gray-700 hover:text-gray-900 underline"
                          >
                            Chọn khách hàng
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {!isVoucherInactive && (
        <CustomerSelectionModal
          isOpen={isCustomerModalOpen}
          onClose={() => setIsCustomerModalOpen(false)}
          voucherId={id}
          onSuccess={handleCustomerModalSuccess}
          onCustomersSelected={setSelectedCustomerIds}
          selectedCustomerIds={selectedCustomerIds}
        />
      )}

      <ConfirmModal
        isOpen={formProvider.isConfirmModalOpen}
        onClose={() => formProvider.setIsConfirmModalOpen(false)}
        onConfirm={() => formProvider.handleConfirmSubmit(formProvider.getValues(), selectedCustomerIds)}
        title={formProvider.confirmModalConfig.title}
        message={formProvider.confirmModalConfig.message}
        type={formProvider.confirmModalConfig.type}
        isLoading={formProvider.confirmModalConfig.isLoading}
        confirmText="Xác nhận"
        cancelText="Hủy"
      />
    </VoucherFormContext.Provider>
  );
};

export { VoucherForm };

