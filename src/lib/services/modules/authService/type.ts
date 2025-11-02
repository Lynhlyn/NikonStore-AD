import { EUserRole } from "@/common/enums";

export interface ILoginPayload {
  email: string;
  password: string;
  role: EUserRole
}

export interface IForgotPasswordPayload {
  email: string;
  role?: EUserRole;
}

export interface IResetPassword {
  token: string;
  newPassword: string;
}

export interface ILoginResponse {
  status: number;
  message: string;
  data: {
    id: number;
    email: string;
    fullName: string;
    role: string;
    accessToken: string;
    refreshToken: string;
  };
}

