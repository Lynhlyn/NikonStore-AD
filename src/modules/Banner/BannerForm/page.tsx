'use client';

import React from 'react';
import { BannerForm } from './components';

export interface IBannerProps {
  id?: number;
}

const BannerFormPage: React.FC<IBannerProps> = ({ id }) => {
  return (
    <div className="py-8 px-6">
      <div className="mb-6 text-2xl font-semibold text-gray-900">
        <span>{id ? 'Chỉnh sửa banner' : 'Thêm banner'}</span>
      </div>
      <BannerForm id={id} />
    </div>
  );
};

export default BannerFormPage;

