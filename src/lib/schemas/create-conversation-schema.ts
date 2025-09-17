import z from "zod";

export const CreateConversationSchema = z.object({
  title: z
    .string()
    .min(1, { message: "Name is required" })
    .max(50, "Title must be less than 50 characters"),
  model: z.string().min(1, { message: "Model is required" }),
  description: z
    .string()
    .max(250, "Description must be less than 200 characters")
    .optional(),
});
