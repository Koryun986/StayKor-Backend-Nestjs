import { z } from "zod";
import { userSchema } from "./user.dto";

export const createUserSchema = userSchema.extend({
  name: z.string().nonempty("Name is required"),
});

export type CreateUserDto = z.infer<typeof createUserSchema>;
