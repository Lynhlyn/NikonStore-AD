import { EStatusEnumString } from '@/common/enums/status';
import React from 'react';

export const getStatusDisplay = (status: EStatusEnumString) => {
  switch (status) {
    case EStatusEnumString.ACTIVE:
      return React.createElement(
        'span',
        { className: "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800" },
        'Hoạt động'
      );
    case EStatusEnumString.INACTIVE:
      return React.createElement(
        'span',
        { className: "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800" },
        'Không hoạt động'
      );
    case EStatusEnumString.DELETED:
      return React.createElement(
        'span',
        { className: "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800" },
        'Đã xóa'
      );
    default:
      return React.createElement(
        'span',
        { className: "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800" },
        status
      );
  }
};

export const getStatusColor = (status: EStatusEnumString): string => {
  switch (status) {
    case EStatusEnumString.ACTIVE:
      return 'text-green-600';
    case EStatusEnumString.INACTIVE:
      return 'text-gray-600';
    case EStatusEnumString.DELETED:
      return 'text-red-600';
    default:
      return 'text-gray-600';
  }
};

