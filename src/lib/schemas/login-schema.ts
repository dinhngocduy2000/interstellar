import z from "zod";

export const LoginSchema = z.object({
  email: z.email().min(1, { error: "Email is required" }),
  password: z.string().min(1, { error: "Password is required" }),
  saveSession: z.boolean().optional(),
});
