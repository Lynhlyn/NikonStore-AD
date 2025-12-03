'use client';

import { ConfirmModal } from '@/common/components/ConfirmModal';
import { ContentCategoryFormControl } from '@/modules/ContentCategory/ContentCategoryForm/components/ContentCategoryFormControl';
import {
  ContentCategoryFormContext,
  useContentCategoryFormProvider,
} from '@/modules/ContentCategory/ContentCategoryForm/components/useContentCategoryFormControl';
import { IContentCategoryProps } from '@/modules/ContentCategory/ContentCategoryForm/page';
import { FC } from 'react';

const ContentCategoryForm: FC<IContentCategoryProps> = ({ id }) => {
  const formProvider = useContentCategoryFormProvider(id);

  return (
    <ContentCategoryFormContext.Provider value={formProvider}>
      <div className="w-full max-w-4xl mx-auto space-y-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-6 pt-6 pb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Thông tin content category</h2>
          <div className="space-y-5">
            <ContentCategoryFormControl.NameInput />
            <ContentCategoryFormControl.SlugInput />
            <ContentCategoryFormControl.DescriptionInput />
            <ContentCategoryFormControl.TypeInput />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-6 py-6">
          <ContentCategoryFormControl.Button />
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
    </ContentCategoryFormContext.Provider>
  );
};

export { ContentCategoryForm };

