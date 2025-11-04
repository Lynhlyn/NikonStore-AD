'use client';

import { ConfirmModal } from '@/common/components/ConfirmModal';
import { ColorFormControl } from '@/modules/Color/ColorForm/components/ColorFormControl';
import { ColorFormContext, useColorFormProvider } from '@/modules/Color/ColorForm/components/useColorFormControl';
import { FC } from 'react';

export interface IColorProps {
  id?: number;
}

const ColorForm: FC<IColorProps> = ({ id }) => {
  const formProvider = useColorFormProvider(id);

  return (
    <ColorFormContext.Provider value={formProvider}>
      <div className="w-full max-w-4xl mx-auto space-y-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-6 pt-6 pb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Thông tin màu sắc</h2>
          <div className="space-y-5">
            <ColorFormControl.NameInput />
            <ColorFormControl.HexCodeInput />
            <ColorFormControl.StatusInput />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-6 py-6">
          <ColorFormControl.Button />
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
    </ColorFormContext.Provider>
  );
};

export { ColorForm };

