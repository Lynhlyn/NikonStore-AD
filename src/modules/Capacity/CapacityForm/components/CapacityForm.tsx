'use client';

import { ConfirmModal } from '@/common/components/ConfirmModal';
import { CapacityFormControl } from '@/modules/Capacity/CapacityForm/components/CapacityFormControl';
import { CapacityFormContext, useCapacityFormProvider } from '@/modules/Capacity/CapacityForm/components/useCapacityFormControl';
import { FC } from 'react';

export interface ICapacityProps {
  id?: number;
}

const CapacityForm: FC<ICapacityProps> = ({ id }) => {
  const formProvider = useCapacityFormProvider(id);

  return (
    <CapacityFormContext.Provider value={formProvider}>
      <div className="w-full max-w-4xl mx-auto space-y-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-6 pt-6 pb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Thông tin dung tích</h2>
          <div className="space-y-5">
            <CapacityFormControl.NameInput />
            <CapacityFormControl.StatusInput />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-6 py-6">
          <CapacityFormControl.Button />
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
    </CapacityFormContext.Provider>
  );
};

export { CapacityForm };

