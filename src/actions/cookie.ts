"use server";

import { cookies } from "next/headers";
import { COOKIE_KEYS } from "@/lib/enum/cookie-keys";
import { LoginResponse } from "@/lib/interfaces/auth";

export const getAccessTokenCookie = async () => {
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_KEYS.ACCESS_TOKEN)?.value;
};

export const getRefreshTokenCookie = async () => {
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_KEYS.REFRESH_TOKEN)?.value;
};

export const getSaveSessionCookie = async () => {
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_KEYS.SAVE_SESSION)?.value;
};

export const setCookiesAction = async (
  res: LoginResponse & { saveSession?: boolean },
) => {
  const cookieStore = await cookies();
  cookieStore.set({
    name: COOKIE_KEYS.ACCESS_TOKEN,
    value: res.accessToken,
    expires: res.saveSession
      ? new Date().setDate(new Date().getDate() + 30)
      : undefined,
    path: "/",
    httpOnly: true,
    sameSite: "lax",
  });
  cookieStore.set({
    name: COOKIE_KEYS.REFRESH_TOKEN,
    value: res.refreshToken,
    expires: res.saveSession
      ? new Date().setDate(new Date().getDate() + 30)
      : undefined,
    path: "/",
    httpOnly: true,
    sameSite: "lax",
  });
  cookieStore.set({
    name: COOKIE_KEYS.SAVE_SESSION,
    value: String(res.saveSession),
    expires: res.saveSession
      ? new Date().setDate(new Date().getDate() + 30)
      : undefined,
  });
};
