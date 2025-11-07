'use client';

import { ConfirmModal } from '@/common/components/ConfirmModal';
import { ProductFormControl } from '@/modules/Product/ProductForm/components/ProductFormControl';
import { ProductFormContext, useProductFormProvider } from '@/modules/Product/ProductForm/components/useProductFormControl';
import { IProductProps } from '@/modules/Product/ProductForm/page';
import { FC } from 'react';

const ProductForm: FC<IProductProps> = ({ id }) => {
  const formProvider = useProductFormProvider(id);

  return (
    <ProductFormContext.Provider value={formProvider}>
      <div className="w-full max-w-4xl mx-auto space-y-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-6 pt-6 pb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Thông tin sản phẩm</h2>
          <div className="space-y-5">
            <ProductFormControl.NameInput />
            <ProductFormControl.DescriptionInput />
            <ProductFormControl.WeightInput />
            <ProductFormControl.DimensionsInput />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-6 pt-6 pb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Thuộc tính sản phẩm</h2>
          <div className="space-y-5">
            <ProductFormControl.BrandInput />
            <ProductFormControl.CategoryInput />
            <ProductFormControl.MaterialInput />
            <ProductFormControl.StrapTypeInput />
            <ProductFormControl.TagsInput />
            <ProductFormControl.FeaturesInput />
            <ProductFormControl.StatusInput />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-6 py-6">
          <ProductFormControl.Button />
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
    </ProductFormContext.Provider>
  );
};

export { ProductForm };

