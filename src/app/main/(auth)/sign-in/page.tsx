import SignInPage from "@/modules/Auth/SignIn/page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Đăng nhập - NikonStore Admin',
};

export default async function SignIn() {
  return <SignInPage />;
}

