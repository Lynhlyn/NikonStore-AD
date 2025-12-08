import SignInPage from "@/modules/Auth/SignIn/page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Đăng nhập - Quản trị cửa hàng Nikon Store',
};

export default async function SignIn() {
  return <SignInPage />;
}

