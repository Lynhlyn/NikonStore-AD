'use client';

import { MaterialForm } from './components';

export interface IMaterialProps {
  id?: number;
}

const MaterialFormPage: React.FC<IMaterialProps> = ({ id }) => {
    return (
        <div className="py-8 px-6">
            <div className="mb-6 text-2xl font-semibold text-gray-900">
                <span>{id ? 'Chỉnh sửa chất liệu' : 'Thêm chất liệu'}</span>
            </div>
            <MaterialForm id={id} />
        </div>
    );
};

export default MaterialFormPage;

