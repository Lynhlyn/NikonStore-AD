'use client';

import { ConfirmModal } from '@/common/components/ConfirmModal';
import { ProductDetailFormControl } from '@/modules/ProductDetail/ProductDetailForm/components/ProductDetailFormControl';
import { ProductDetailFormContext, useProductDetailFormProvider } from '@/modules/ProductDetail/ProductDetailForm/components/useProductDetailFormControl';
import { FC } from 'react';

interface IProductDetailProps {
  productId: number;
  id?: number;
}

const ProductDetailForm: FC<IProductDetailProps> = ({ productId, id }) => {
  const formProvider = useProductDetailFormProvider(productId, id);

  return (
    <ProductDetailFormContext.Provider value={formProvider}>
      <div className="py-8 px-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {id ? 'Chỉnh sửa chi tiết sản phẩm' : 'Thêm mới chi tiết sản phẩm'}
          </h1>
        </div>

        <div className="flex flex-col gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-900">Thông tin chi tiết sản phẩm</h2>
            <div className="flex flex-col gap-4">
              <ProductDetailFormControl.SkuInput />
              <ProductDetailFormControl.StockInput />
              <ProductDetailFormControl.PriceInput />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-900">Thuộc tính chi tiết</h2>
            <div className="flex flex-col gap-4">
              <ProductDetailFormControl.ColorInput />
              <ProductDetailFormControl.CapacityInput />
              <ProductDetailFormControl.StatusInput />
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <ProductDetailFormControl.Button />
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
      </div>
    </ProductDetailFormContext.Provider>
  );
};

export { ProductDetailForm };

