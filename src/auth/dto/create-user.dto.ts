import { z } from "zod";

export const createUserSchema = z
  .object({
    name: z.string().nonempty("Name is required"),
    email: z.string().email("Please enter valid email address"),
    password: z.string().min(5, "Password must be at least 5 characters"),
  })
  .required();

export type CreateUserDto = z.infer<typeof createUserSchema>;
