'use client';

import { ProductForm } from "./components";

export interface IProductProps {
  id?: number;
}

const ProductFormPage: React.FC<IProductProps> = ({ id }) => {
    return (
        <div className="py-8 px-6">
            <div className="mb-6 text-2xl font-semibold text-gray-900">
                <span>{id ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm'}</span>
            </div>
            <ProductForm id={id} />
        </div>
    );
};

export default ProductFormPage;

