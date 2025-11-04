'use client';

import { ConfirmModal } from '@/common/components/ConfirmModal';
import { StrapeTypeFormControl } from '@/modules/StrapeType/StrapeTypeForm/components/StrapeTypeFormControl';
import { StrapeTypeFormContext, useStrapeTypeFormProvider } from '@/modules/StrapeType/StrapeTypeForm/components/useStrapeTypeFormControl';
import { FC } from 'react';

export interface IStrapeTypeProps {
  id?: number;
}

const StrapeTypeForm: FC<IStrapeTypeProps> = ({ id }) => {
  const formProvider = useStrapeTypeFormProvider(id);

  return (
    <StrapeTypeFormContext.Provider value={formProvider}>
      <div className="w-full max-w-4xl mx-auto space-y-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-6 pt-6 pb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Thông tin loại dây đeo</h2>
          <div className="space-y-5">
            <StrapeTypeFormControl.NameInput />
            <StrapeTypeFormControl.DescriptionInput />
            <StrapeTypeFormControl.StatusInput />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-6 py-6">
          <StrapeTypeFormControl.Button />
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
    </StrapeTypeFormContext.Provider>
  );
};

export { StrapeTypeForm };

