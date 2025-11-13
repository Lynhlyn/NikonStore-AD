'use client';

import { ConfirmModal } from '@/common/components/ConfirmModal';
import { PromotionFormControl } from './PromotionFormControl';
import {
  PromotionFormContext,
  usePromotionFormProvider,
} from '@/modules/Promotion/PromotionForm/components/usePromotionFormControl';
import { FC } from 'react';

interface IPromotionProps {
  id?: number;
  isViewMode?: boolean;
}

const PromotionForm: FC<IPromotionProps> = ({ id, isViewMode }) => {
  const formProvider = usePromotionFormProvider(id, isViewMode);

  return (
    <PromotionFormContext.Provider value={formProvider}>
      <div className="pt-[50px] px-[50px] pb-[50px]">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isViewMode ? 'Chi tiết chương trình khuyến mãi' : id ? 'Chỉnh sửa chương trình khuyến mãi' : 'Tạo mới chương trình khuyến mãi'}
          </h1>
          <p className="text-gray-600">
            {isViewMode ? 'Xem thông tin chi tiết chương trình khuyến mãi' : 'Quản lý thông tin và cài đặt chương trình khuyến mãi'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-3 border-b border-gray-200">
                Thông tin cơ bản
              </h2>
              <div className="space-y-4">
                <PromotionFormControl.NameInput />
                <PromotionFormControl.TitleInput />
                <PromotionFormControl.CodeInput />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-3 border-b border-gray-200">
                Cài đặt giảm giá
              </h2>
              <div className="space-y-4">
                <PromotionFormControl.DiscountTypeInput />
                <PromotionFormControl.DiscountValueInput />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-3 border-b border-gray-200">
                Thời gian áp dụng
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <PromotionFormControl.StartDateInput />
                <PromotionFormControl.EndDateInput />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-3 border-b border-gray-200">
                Mô tả và trạng thái
              </h2>
              <div className="space-y-4">
                <PromotionFormControl.DescriptionInput />
                <PromotionFormControl.StatusInput />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-3 border-b border-gray-200">
                Sản phẩm áp dụng
              </h2>
              <PromotionFormControl.ProductSelectionInput />
            </div>

            {!isViewMode && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <PromotionFormControl.Button />
              </div>
            )}
          </div>
        </div>
      </div>

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
    </PromotionFormContext.Provider>
  );
};

export { PromotionForm };

