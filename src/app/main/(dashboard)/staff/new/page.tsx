import StaffFormPage from "@/modules/Staff/StaffForm/page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Thêm mới nhân viên',
  description: 'Thêm mới nhân viên',
};

export default async function StaffAddPage() {
  return (
    <StaffFormPage />
  );
}

