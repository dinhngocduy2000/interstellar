"use server";

export const refreshTokenAction = async (params: { token: string }) => {
  // try {
  //   const res = await refreshToken(params);
  //   console.dir(`CHECK RES REFRESH TOKEN`, res);
  //   // Set the cookie
  // return {
  //   success: true,
  //   data: res,
  // };
  // } catch (error) {
  //   const axiosError = error as AxiosError;
  //   return {
  //     success: false,
  //     error: axiosError.message,
  //   };
  // }
  return {
    success: true,
    data: undefined,
  };
};
