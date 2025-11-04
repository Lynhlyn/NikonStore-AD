'use client';

import { StrapeTypeForm } from './components';

export interface IStrapeTypeProps {
  id?: number;
}

const StrapeTypeFormPage: React.FC<IStrapeTypeProps> = ({ id }) => {
    return (
        <div className="py-8 px-6">
            <div className="mb-6 text-2xl font-semibold text-gray-900">
                <span>{id ? 'Chỉnh sửa loại dây đeo' : 'Thêm loại dây đeo'}</span>
            </div>
            <StrapeTypeForm id={id} />
        </div>
    );
};

export default StrapeTypeFormPage;

