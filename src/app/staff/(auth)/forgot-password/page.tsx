import ForgotPasswordPage from "@/modules/Auth/ForgotPassword/page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Quên mật khẩu - NikonStore Staff',
};

export default async function ForgotPassword() {
  return <ForgotPasswordPage />;
}

