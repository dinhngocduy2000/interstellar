import { AUTH_ENDPOINTS } from "@/lib/enum/endpoints";
import {
  LoginForm,
  LoginResponse,
  RefreshTokenPayload,
} from "@/lib/interfaces/auth";
import axiosConfig from "..";

export const loginAPI = async (
  data: LoginForm,
  signal?: AbortSignal,
): Promise<LoginResponse> => {
  return await axiosConfig.post(AUTH_ENDPOINTS.LOGIN, data, { signal });
};

export const refreshToken = async (
  params: RefreshTokenPayload,
  signal?: AbortSignal,
): Promise<LoginResponse> => {
  return await axiosConfig.post(AUTH_ENDPOINTS.REFRESH_TOKEN, params, {
    signal,
  });
};

export const trackSession = async (signal?: AbortSignal): Promise<unknown> => {
  return await axiosConfig.get(AUTH_ENDPOINTS.TRACK_SESSION, { signal });
};
