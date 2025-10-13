"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { loginAPI } from "@/lib/api/auth";
import { COOKIE_KEYS } from "@/lib/enum/cookie-keys";
import { ROUTE_PATH } from "@/lib/enum/route-path";
import { LoginForm } from "@/lib/interfaces/auth";

export const logoutAction = async () => {
	const cookieStore = await cookies();
	cookieStore.delete(COOKIE_KEYS.ACCESS_TOKEN);
	cookieStore.delete(COOKIE_KEYS.REFRESH_TOKEN);
	cookieStore.delete(COOKIE_KEYS.SAVE_SESSION);
	redirect(ROUTE_PATH.LOGIN);
};

export const loginAction = async (data: LoginForm, signal?: AbortSignal) => {
	return await loginAPI(data, signal);
};
