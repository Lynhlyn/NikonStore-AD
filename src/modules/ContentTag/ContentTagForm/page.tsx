'use client';

import { ContentTagForm } from './components';

export interface IContentTagProps {
  id?: number;
}

const ContentTagFormPage: React.FC<IContentTagProps> = ({ id }) => {
  return (
    <div className="py-8 px-6">
      <div className="mb-6 text-2xl font-semibold text-gray-900">
        <span>{id ? 'Chỉnh sửa content tag' : 'Thêm content tag'}</span>
      </div>
      <ContentTagForm id={id} />
    </div>
  );
};

export default ContentTagFormPage;

