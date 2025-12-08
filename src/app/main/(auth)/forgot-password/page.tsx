import ForgotPasswordPage from "@/modules/Auth/ForgotPassword/page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Quên mật khẩu - Quản trị cửa hàng Nikon Store',
};

export default async function ForgotPassword() {
  return <ForgotPasswordPage />;
}

