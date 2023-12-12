import { z } from "zod";

export const addressSchema = z
  .object({
    country: z.string().nonempty("Country field is required"),
    city: z.string().nonempty("City field is required"),
    address: z.string().nonempty("Address field is required"),
  })
  .required();

export type AddressDto = z.infer<typeof addressSchema>;
