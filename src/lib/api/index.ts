import {
  getAccessTokenCookie,
  getRefreshTokenCookie,
  setCookiesAction,
} from "@/actions/cookie";
import { refreshTokenAction } from "@/actions/refresh-token";
import axios, { AxiosError, AxiosResponse } from "axios";
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"; // Set in .env

const axiosConfig = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});
// Add a request interceptor
axiosConfig.interceptors.request.use(
  async function (config) {
    const accessToken = await getAccessTokenCookie();
    // Do something before request is sent
    if (accessToken) {
      config.headers.Authorization = `${accessToken}`;
    }
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  },
);
// Add a response interceptor
axiosConfig.interceptors.response.use(
  function (response: AxiosResponse) {
    return response.data;
  },
  async function (error) {
    if (!error.response) {
      return Promise.reject(error);
    }
    switch (error.response.status) {
      case 403:
        return await handleRenewToken(error);
      case 404:
        break;
      case 401:
        return await handleRenewToken(error);
      // Refetch token with access token
      case 500:
        break;
      default:
        break;
    }

    return Promise.reject(error);
  },
);

const handleRenewToken = async (error: unknown) => {
  if (!(error instanceof AxiosError)) {
    return;
  }
  const axiosError: AxiosError = error;
  const originalRequest = axiosError.config;
  if (!originalRequest) {
    return;
  }
  const refreshToken = await getRefreshTokenCookie();
  if (!refreshToken) {
    return;
  }
  const newAccessToken = await refreshTokenAction({
    refreshToken: refreshToken,
  });

  if (!newAccessToken.accessToken) {
    console.log(`No Access token`);
    return;
  }
  await setCookiesAction({
    ...newAccessToken,
    saveSession: true,
  });

  return await axiosConfig(originalRequest);
};

export default axiosConfig;
