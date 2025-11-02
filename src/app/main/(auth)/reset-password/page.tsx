'use client';
import ResetPasswordPage from "@/modules/Auth/ResetPassword/page";
import type { NextPage } from "next";

interface IResetPasswordProps {
  searchParams: { token: string };
}

const ResetPassword: NextPage<IResetPasswordProps> = ({ searchParams }) => {
  return <ResetPasswordPage searchParams={searchParams} />;
};

export default ResetPassword;

