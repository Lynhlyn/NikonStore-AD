'use client';

import { ConfirmModal } from '@/common/components/ConfirmModal';
import { BrandFormControl } from '@/modules/Brand/BrandForm/components/BrandFormControl';
import { BrandFormContext, useBrandFormProvider } from '@/modules/Brand/BrandForm/components/useBrandFormControl';
import { IBrandProps } from '@/modules/Brand/BrandForm/page';
import { FC } from 'react';

const BrandForm: FC<IBrandProps> = ({ id }) => {
  const formProvider = useBrandFormProvider(id);

  return (
    <BrandFormContext.Provider value={formProvider}>
      <div className="w-full max-w-4xl mx-auto space-y-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-6 pt-6 pb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Thông tin thương hiệu</h2>
          <div className="space-y-5">
            <BrandFormControl.NameInput />
            <BrandFormControl.StatusInput />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-6 py-6">
          <BrandFormControl.Button />
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
    </BrandFormContext.Provider>
  );
};

export { BrandForm };

