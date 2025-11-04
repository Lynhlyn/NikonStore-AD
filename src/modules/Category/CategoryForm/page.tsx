'use client';

import { CategoryForm } from './components';

export interface ICategoryProps {
  id?: number;
}

const CategoryFormPage: React.FC<ICategoryProps> = ({ id }) => {
    return (
        <div className="py-8 px-6">
            <div className="mb-6 text-2xl font-semibold text-gray-900">
                <span>{id ? 'Chỉnh sửa danh mục' : 'Thêm danh mục'}</span>
            </div>
            <CategoryForm id={id} />
        </div>
    );
};

export default CategoryFormPage;

