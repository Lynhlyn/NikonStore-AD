'use client';

import { ConfirmModal } from '@/common/components/ConfirmModal';
import { MaterialFormControl } from '@/modules/Material/MaterialForm/components/MaterialFormControl';
import { MaterialFormContext, useMaterialFormProvider } from '@/modules/Material/MaterialForm/components/useMaterialFormControl';
import { FC } from 'react';

export interface IMaterialProps {
  id?: number;
}

const MaterialForm: FC<IMaterialProps> = ({ id }) => {
  const formProvider = useMaterialFormProvider(id);

  return (
    <MaterialFormContext.Provider value={formProvider}>
      <div className="w-full max-w-4xl mx-auto space-y-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-6 pt-6 pb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Thông tin chất liệu</h2>
          <div className="space-y-5">
            <MaterialFormControl.NameInput />
            <MaterialFormControl.DescriptionInput />
            <MaterialFormControl.StatusInput />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-6 py-6">
          <MaterialFormControl.Button />
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
    </MaterialFormContext.Provider>
  );
};

export { MaterialForm };

