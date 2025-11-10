import { EUserRole } from "@/common/enums";

export interface IUserResponse {
  status: number;
  message: string;
  data: {
    id: number;
    email: string;
    name: string;
    role: EUserRole;
    accessToken?: string;
    refreshToken?: string;
  };
}

