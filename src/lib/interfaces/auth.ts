import z from "zod";
import { LoginSchema } from "../schemas/login-schema";

export type LoginResponse = {
	accessToken: string;
	refreshToken: string;
	expiresIn: number;
	email: string;
	username: string;
	role: string;
};

export type RefreshTokenPayload = {
	refreshToken: string;
};

export type LoginForm = z.infer<typeof LoginSchema>;
