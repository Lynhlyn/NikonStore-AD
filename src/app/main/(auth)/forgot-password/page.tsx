import ForgotPasswordPage from "@/modules/Auth/ForgotPassword/page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Quên mật khẩu - NikonStore Admin',
};

export default async function ForgotPassword() {
  return <ForgotPasswordPage />;
}

