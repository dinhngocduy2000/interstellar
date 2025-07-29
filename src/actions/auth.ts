"use server";

import { cookies } from "next/headers";
import { COOKIE_KEYS } from "@/lib/enum/cookie-keys";
import { redirect } from "next/navigation";
import { ROUTE_PATH } from "@/lib/enum/route-path";

export const logoutAction = async () => {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_KEYS.ACCESS_TOKEN);
  cookieStore.delete(COOKIE_KEYS.REFRESH_TOKEN);
  cookieStore.delete(COOKIE_KEYS.SAVE_SESSION);
  redirect(ROUTE_PATH.LOGIN);
};
