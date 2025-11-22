import { z } from "zod";

export const deliveryProductSchema = z.object({
  product_id: z.number().min(1, "Product is required"),
  quantity: z.number().int().min(1, "Quantity must be at least 1"),
});

export const deliverySchema = z.object({
  warehouse_short_code: z.string().min(1, "Warehouse is required"),
  schedule_at: z.string().min(1, "Schedule date is required"),
  to: z.string().min(1, "Deliver To is required"),
  products: z.array(deliveryProductSchema).min(1, "At least one product is required"),
});

export type DeliveryFormData = z.infer<typeof deliverySchema>;
export type DeliveryProduct = z.infer<typeof deliveryProductSchema>;

