import { EUserRole } from "@/common/enums";

export interface IAuthState {
  isAuthenticated: boolean;
  token: {
    accessToken: string;
    refreshToken?: string;
  };
}

export interface IAuthCredentials {
  accessToken: string;
  refreshToken: string;
  role: EUserRole
}

