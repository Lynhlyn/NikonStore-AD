'use client';

import { StaffForm } from "./components/StaffForm";

export interface IStaffProps {
  id?: number;
}

const StaffFormPage: React.FC<IStaffProps> = ({ id }) => {
  return (
    <div className="py-8 px-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          {id ? "Chỉnh sửa nhân viên" : "Thêm mới nhân viên"}
        </h1>
      </div>
      <StaffForm id={id} />
    </div>
  );
};

export default StaffFormPage;

