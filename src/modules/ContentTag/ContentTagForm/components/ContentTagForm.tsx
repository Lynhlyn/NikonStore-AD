'use client';

import { ConfirmModal } from '@/common/components/ConfirmModal';
import { ContentTagFormControl } from '@/modules/ContentTag/ContentTagForm/components/ContentTagFormControl';
import {
  ContentTagFormContext,
  useContentTagFormProvider,
} from '@/modules/ContentTag/ContentTagForm/components/useContentTagFormControl';
import { IContentTagProps } from '@/modules/ContentTag/ContentTagForm/page';
import { FC } from 'react';

const ContentTagForm: FC<IContentTagProps> = ({ id }) => {
  const formProvider = useContentTagFormProvider(id);

  return (
    <ContentTagFormContext.Provider value={formProvider}>
      <div className="w-full max-w-4xl mx-auto space-y-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-6 pt-6 pb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Thông tin content tag</h2>
          <div className="space-y-5">
            <ContentTagFormControl.NameInput />
            <ContentTagFormControl.SlugInput />
            <ContentTagFormControl.TypeInput />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-6 py-6">
          <ContentTagFormControl.Button />
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
    </ContentTagFormContext.Provider>
  );
};

export { ContentTagForm };

