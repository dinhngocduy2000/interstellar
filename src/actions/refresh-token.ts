"use server";

import { refreshToken } from "@/lib/api/auth";
import { LoginResponse, RefreshTokenPayload } from "@/lib/interfaces/auth";

export const refreshTokenAction = async (
	params: RefreshTokenPayload,
	signal?: AbortSignal,
): Promise<LoginResponse> => {
	return await refreshToken(params, signal);
};
