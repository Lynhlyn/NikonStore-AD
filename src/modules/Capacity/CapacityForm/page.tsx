'use client';

import { CapacityForm } from './components';

export interface ICapacityProps {
  id?: number;
}

const CapacityFormPage: React.FC<ICapacityProps> = ({ id }) => {
    return (
        <div className="py-8 px-6">
            <div className="mb-6 text-2xl font-semibold text-gray-900">
                <span>{id ? 'Chỉnh sửa dung tích' : 'Thêm dung tích'}</span>
            </div>
            <CapacityForm id={id} />
        </div>
    );
};

export default CapacityFormPage;

