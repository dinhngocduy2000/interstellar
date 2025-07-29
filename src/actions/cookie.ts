"use server";

import { COOKIE_KEYS } from "@/lib/enum/cookie-keys";
import { LoginResponse } from "@/lib/interfaces/auth";
import { cookies } from "next/headers";

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
  res: LoginResponse & { saveSession?: boolean }
) => {
  const cookieStore = await cookies();
  cookieStore.set({
    name: COOKIE_KEYS.ACCESS_TOKEN,
    value: res.access_token,
    expires: res.saveSession ? new Date(res.expired_at) : undefined,
    path: "/",
    httpOnly: true,
    sameSite: "lax",
  });
  cookieStore.set({
    name: COOKIE_KEYS.REFRESH_TOKEN,
    value: res.refresh_token,
    expires: res.saveSession
      ? new Date(res.expired_at).setHours(new Date().getHours() + 2)
      : undefined,
    path: "/",
    httpOnly: true,
    sameSite: "lax",
  });
  cookieStore.set({
    name: COOKIE_KEYS.SAVE_SESSION,
    value: String(res.saveSession),
    expires: res.saveSession
      ? new Date(res.expired_at).setHours(new Date().getHours() + 3)
      : undefined,
  });
};
