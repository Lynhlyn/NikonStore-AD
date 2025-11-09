import StaffFormPage from "@/modules/Staff/StaffForm/page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Sửa nhân viên',
  description: 'Trang sửa thông tin nhân viên',
};

export default function StaffEditPage({ params }: { params: { id: string } }) {
  return <StaffFormPage id={Number(params.id)} />;
}

