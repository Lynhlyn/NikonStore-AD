'use client';

import { BrandForm } from "./components";

export interface IBrandProps {
  id?: number;
}

const BrandFormPage: React.FC<IBrandProps> = ({ id }) => {
    return (
        <div className="py-8 px-6">
            <div className="mb-6 text-2xl font-semibold text-gray-900">
                <span>{id ? 'Chỉnh sửa thương hiệu' : 'Thêm thương hiệu'}</span>
            </div>
            <BrandForm id={id} />
        </div>
    );
};

export default BrandFormPage;

