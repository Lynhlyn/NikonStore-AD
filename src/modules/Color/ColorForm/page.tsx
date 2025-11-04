'use client';

import { ColorForm } from './components';

export interface IColorProps {
  id?: number;
}

const ColorFormPage: React.FC<IColorProps> = ({ id }) => {
    return (
        <div className="py-8 px-6">
            <div className="mb-6 text-2xl font-semibold text-gray-900">
                <span>{id ? 'Chỉnh sửa màu sắc' : 'Thêm màu sắc'}</span>
            </div>
            <ColorForm id={id} />
        </div>
    );
};

export default ColorFormPage;

