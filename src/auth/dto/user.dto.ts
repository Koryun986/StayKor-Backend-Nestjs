import { z } from "zod";

export const userSchema = z
  .object({
    email: z.string().email("Please enter valid email address"),
    password: z.string().min(5, "Password must be at least 5 characters"),
  })
  .required();

export type UserDto = z.infer<typeof userSchema>;
