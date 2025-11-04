'use client';

import { ConfirmModal } from '@/common/components/ConfirmModal';
import { CategoryFormControl } from '@/modules/Category/CategoryForm/components/CategoryFormControl';
import { CategoryFormContext, useCategoryFormProvider } from '@/modules/Category/CategoryForm/components/useCategoryFormControl';
import { FC } from 'react';

export interface ICategoryProps {
  id?: number;
}

const CategoryForm: FC<ICategoryProps> = ({ id }) => {
  const formProvider = useCategoryFormProvider(id);

  return (
    <CategoryFormContext.Provider value={formProvider}>
      <div className="w-full max-w-4xl mx-auto space-y-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-6 pt-6 pb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Thông tin danh mục</h2>
          <div className="space-y-5">
            <CategoryFormControl.NameInput />
            <CategoryFormControl.ParentCategoryInput />
            <CategoryFormControl.DescriptionInput />
            <CategoryFormControl.StatusInput />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-6 py-6">
          <CategoryFormControl.Button />
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
    </CategoryFormContext.Provider>
  );
};

export { CategoryForm };

