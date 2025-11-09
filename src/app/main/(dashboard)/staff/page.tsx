import StaffTable from "@/modules/Staff/StaffTable/StaffTable";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Danh sách nhân viên',
  description: 'Quản lý nhân viên',
};

export default async function StaffPage() {
  return (
    <StaffTable />
  );
}

