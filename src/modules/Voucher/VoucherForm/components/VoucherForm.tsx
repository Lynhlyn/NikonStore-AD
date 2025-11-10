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
      <div className="flex w-full gap-[30px]">
        <div className="flex flex-1 flex-col bg-white rounded-[10px] px-[30px] pt-[33px] pb-[60px]">
          <span className="text-base font-medium leading-[130%]">Thông tin voucher</span>
          <div className="mt-[19px] flex flex-col gap-[14px] text-[#333333]">
            <VoucherFormControl.CodeInput />
            <VoucherFormControl.DescriptionInput />
            <VoucherFormControl.QuantityInput />
            <VoucherFormControl.DiscountTypeInput />
            <VoucherFormControl.DiscountValueInput />
            <VoucherFormControl.MinOrderValueInput />
            <VoucherFormControl.MaxDiscountInput />
            <VoucherFormControl.StartDateInput />
            <VoucherFormControl.EndDateInput />
            <VoucherFormControl.IsPublicInput />
            <VoucherFormControl.StatusInput />
          </div>
        </div>

        <div className="flex flex-col gap-[30px]">
          <div className="w-[250px]">
            <VoucherFormControl.Button />
          </div>

          {localIsPrivateVoucher && (
            <div className="bg-white rounded-[10px] px-[30px] pt-[33px] pb-[60px] min-w-[400px]">
              <div className="flex justify-between items-center mb-4">
                <span className="text-base font-medium leading-[130%]">Danh sách khách hàng cấp quyền dùng voucher này</span>
                {!isViewMode && (
                  <button
                    onClick={() => setIsCustomerModalOpen(true)}
                    disabled={isVoucherInactive}
                    className={`px-4 py-2 rounded-md text-sm transition-colors ${isVoucherInactive
                      ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    title={isVoucherInactive ? 'Không thể gán khách hàng cho voucher không hoạt động' : 'Chọn khách hàng'}
                  >
                    Chọn khách hàng
                  </button>
                )}
              </div>

              {id ? (
                <>
                  {isVoucherInactive && (
                    <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2">
                      <div className="w-4 h-4 bg-red-100 rounded-full flex items-center justify-center">
                        <span className="text-red-600 text-xs">!</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-red-800 font-medium text-sm">Voucher không hoạt động</p>
                        <p className="text-red-600 text-xs mt-1">
                          Không thể gán hoặc gỡ khách hàng cho voucher đã hết hạn hoặc bị vô hiệu hóa.
                        </p>
                      </div>
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
                <div className="text-center text-gray-500 py-8">
                  Lưu voucher trước để quản lý khách hàng
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {id && !isVoucherInactive && (
        <CustomerSelectionModal
          isOpen={isCustomerModalOpen}
          onClose={() => setIsCustomerModalOpen(false)}
          voucherId={id}
          onSuccess={handleCustomerModalSuccess}
        />
      )}

      <ConfirmModal
        isOpen={formProvider.isConfirmModalOpen}
        onClose={() => formProvider.setIsConfirmModalOpen(false)}
        onConfirm={() => formProvider.handleConfirmSubmit(formProvider.getValues())}
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

