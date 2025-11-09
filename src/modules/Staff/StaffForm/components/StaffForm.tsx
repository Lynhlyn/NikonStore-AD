'use client';

import { FC } from 'react';
import { useStaffFormProvider, StaffFormContext } from '@/modules/Staff/StaffForm/components/useStaffFormControl';
import { StaffFormControl } from '@/modules/Staff/StaffForm/components/StaffFormControl';
import { IStaffProps } from '@/modules/Staff/StaffForm/page';

const StaffForm: FC<IStaffProps> = ({ id }) => {
  const formProvider = useStaffFormProvider(id);

  return (
    <StaffFormContext.Provider value={formProvider}>
      <div className="w-full max-w-4xl mx-auto space-y-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-6 pt-6 pb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Thông tin nhân viên</h2>
          <div className="space-y-5">
            <StaffFormControl.UsernameInput isEditMode={!!id} />
            <StaffFormControl.FullnameInput />
            <StaffFormControl.PasswordInput isEditMode={!!id} />
            <StaffFormControl.PhonenumberInput />
            <StaffFormControl.EmailInput />
            <StaffFormControl.RoleInput />
            <StaffFormControl.StatusInput />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-6 py-6">
          <StaffFormControl.Button />
        </div>
      </div>
    </StaffFormContext.Provider>
  );
};

export { StaffForm };

