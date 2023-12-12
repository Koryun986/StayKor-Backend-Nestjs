import { z } from "zod";
import { addressSchema } from "./address.dto";

export const createLodgingSchema = z
  .object({
    address: addressSchema,
    price: z.string().nonempty("Price field is required"),
    description: z.string(),
  })
  .required();

export type CreateLodgingDto = z.infer<typeof createLodgingSchema>;
