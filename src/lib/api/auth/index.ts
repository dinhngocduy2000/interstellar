import { LoginForm, LoginResponse } from "@/lib/interfaces/auth";
import axiosConfig from "..";
import { AUTH_ENDPOINTS } from "@/lib/enum/endpoints";

export const loginAPI = async (
  data: LoginForm,
  signal?: AbortSignal,
): Promise<LoginResponse> => {
  return await axiosConfig.post(AUTH_ENDPOINTS.LOGIN, data, { signal });
};
