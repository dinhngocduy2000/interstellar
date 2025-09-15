import axios, { AxiosResponse } from "axios";
const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/v1"; // Set in .env

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
    // const accessToken = await getAccessTokenCookie();
    // console.log("CHECKING TOKEN: ", accessToken);
    // if (accessToken) {
    //   // config.headers["Cookie"] = `${COOKIE_KEYS.ACCESS_TOKEN}=${accessToken}`;
    //   config.headers["Authorization"] =
    //     `${COOKIE_KEYS.ACCESS_TOKEN}=${accessToken}`;
    // }

    // Do something before request is sent
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
        // return await handleRenewToken(error);
        break;
      case 404:
        break;
      case 401:
        // return await handleRenewToken(error);
        // Refetch token with access token
        break;
      case 500:
        break;
      default:
        break;
    }

    return Promise.reject(error);
  },
);

// const handleRenewToken = async (error: unknown) => {
//   if (!(error instanceof AxiosError)) {
//     return;
//   }
//   const axiosError: AxiosError = error;
//   const originalRequest = axiosError.config;
//   if (!originalRequest) {
//     return;
//   }
//   const refreshToken = await getRefreshTokenCookie();
//   console.log(`GET REFRESH TOKEN: ${refreshToken}`);
//   if (!refreshToken) {
//     return;
//   }
//   const newAccessToken = await refreshTokenAction({ token: refreshToken });

//   if (!newAccessToken.data) {
//     console.log(`No Access token`);
//     return;
//   }
//   // originalRequest.headers.Authorization = `Bearer ${newAccessToken.token}`;
//   originalRequest.headers[
//     "Cookie"
//   ] = `${COOKIE_KEYS.ACCESS_TOKEN}=${newAccessToken.data.access_token}`;
//   return await axiosConfig(originalRequest);
// };

export default axiosConfig;
