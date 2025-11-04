'use client';

import { ConfirmModal } from '@/common/components/ConfirmModal';
import { FeatureFormControl } from '@/modules/Feature/FeatureForm/components/FeatureFormControl';
import { FeatureFormContext, useFeatureFormProvider } from '@/modules/Feature/FeatureForm/components/useFeatureFormControl';
import { FC } from 'react';

export interface IFeatureProps {
  id?: number;
}

const FeatureForm: FC<IFeatureProps> = ({ id }) => {
  const formProvider = useFeatureFormProvider(id);

  return (
    <FeatureFormContext.Provider value={formProvider}>
      <div className="w-full max-w-4xl mx-auto space-y-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-6 pt-6 pb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Thông tin tính năng</h2>
          <div className="space-y-5">
            <FeatureFormControl.NameInput />
            <FeatureFormControl.DescriptionInput />
            <FeatureFormControl.FeatureGroupInput />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-6 py-6">
          <FeatureFormControl.Button />
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
    </FeatureFormContext.Provider>
  );
};

export { FeatureForm };

