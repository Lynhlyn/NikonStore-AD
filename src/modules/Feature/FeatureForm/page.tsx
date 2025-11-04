'use client';

import { FeatureForm } from './components';

export interface IFeatureProps {
  id?: number;
}

const FeatureFormPage: React.FC<IFeatureProps> = ({ id }) => {
    return (
        <div className="py-8 px-6">
            <div className="mb-6 text-2xl font-semibold text-gray-900">
                <span>{id ? 'Chỉnh sửa tính năng' : 'Thêm tính năng'}</span>
            </div>
            <FeatureForm id={id} />
        </div>
    );
};

export default FeatureFormPage;

