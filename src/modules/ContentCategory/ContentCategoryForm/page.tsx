'use client';

import { ContentCategoryForm } from './components';

export interface IContentCategoryProps {
  id?: number;
}

const ContentCategoryFormPage: React.FC<IContentCategoryProps> = ({ id }) => {
  return (
    <div className="py-8 px-6">
      <div className="mb-6 text-2xl font-semibold text-gray-900">
        <span>{id ? 'Chỉnh sửa content category' : 'Thêm content category'}</span>
      </div>
      <ContentCategoryForm id={id} />
    </div>
  );
};

export default ContentCategoryFormPage;

