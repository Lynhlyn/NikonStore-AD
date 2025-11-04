'use client';

import { TagForm } from './components';

export interface ITagProps {
  id?: number;
}

const TagFormPage: React.FC<ITagProps> = ({ id }) => {
    return (
        <div className="py-8 px-6">
            <div className="mb-6 text-2xl font-semibold text-gray-900">
                <span>{id ? 'Chỉnh sửa thẻ' : 'Thêm thẻ'}</span>
            </div>
            <TagForm id={id} />
        </div>
    );
};

export default TagFormPage;

