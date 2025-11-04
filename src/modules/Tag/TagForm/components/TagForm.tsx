'use client';

import { ConfirmModal } from '@/common/components/ConfirmModal';
import { TagFormControl } from '@/modules/Tag/TagForm/components/TagFormControl';
import { TagFormContext, useTagFormProvider } from '@/modules/Tag/TagForm/components/useTagFormControl';
import { FC } from 'react';

export interface ITagProps {
  id?: number;
}

const TagForm: FC<ITagProps> = ({ id }) => {
  const formProvider = useTagFormProvider(id);

  return (
    <TagFormContext.Provider value={formProvider}>
      <div className="w-full max-w-4xl mx-auto space-y-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-6 pt-6 pb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Thông tin thẻ</h2>
          <div className="space-y-5">
            <TagFormControl.NameInput />
            <TagFormControl.SlugInput />
            <TagFormControl.DescriptionInput />
            <TagFormControl.StatusInput />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-6 py-6">
          <TagFormControl.Button />
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
    </TagFormContext.Provider>
  );
};

export { TagForm };

