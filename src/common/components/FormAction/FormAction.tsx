'use client';

import { UIButton } from '@/core/ui';
import { IFormActionProps } from './FormAction.type';

const FormAction: React.FC<IFormActionProps> = (props) => {
    const { onCancel, onSubmit, isLoading = false } = props;
  return (
    <div className="flex flex-col gap-4 items-center justify-center bg-white w-full px-6 py-6 rounded-lg border border-gray-200 shadow-sm">
      <p className="text-base font-semibold leading-[130%] text-gray-900">Hành động</p>
      <div className="flex items-center gap-3 w-full">
        <UIButton
          onClick={onCancel}
          className="text-sm rounded-lg leading-[170%] w-full h-11 bg-gray-200 hover:bg-gray-300 text-gray-700"
        >
          Quay lại
        </UIButton>
        <UIButton
          isLoading={isLoading}
          onClick={onSubmit}
          className="text-sm rounded-lg leading-[170%] w-full h-11 bg-blue-600 hover:bg-blue-700 text-white"
        >
          Lưu
        </UIButton>
      </div>
    </div>
  );
};

export default FormAction;

