import z from "zod";
import { LoginSchema } from "../schemas/login-schema";

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  email: string;
  username: string;
  role: string;
}

export type LoginForm = z.infer<typeof LoginSchema>;
