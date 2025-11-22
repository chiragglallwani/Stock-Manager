import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  sku_code: z.string().min(1, "SKU code is required"),
  price: z
    .string()
    .min(1, "Price is required")
    .refine(
      (val) => {
        const num = parseFloat(val);
        return !isNaN(num) && num >= 0;
      },
      { message: "Price must be 0 or positive" }
    ),
  stocks: z
    .string()
    .min(1, "Stocks is required")
    .refine(
      (val) => {
        const num = parseInt(val, 10);
        return !isNaN(num) && num >= 0 && Number.isInteger(num);
      },
      { message: "Stocks must be a non-negative integer" }
    ),
});

export type ProductFormData = z.infer<typeof productSchema>;
