import { z } from "zod";

export const receiptProductSchema = z.object({
  product_id: z.number().min(1, "Product is required"),
  quantity: z.number().int().min(1, "Quantity must be at least 1"),
});

export const receiptSchema = z.object({
  warehouse_short_code: z.string().min(1, "Warehouse is required"),
  schedule_at: z.string().min(1, "Schedule date is required"),
  from: z.string().min(1, "Receive From is required"),
  products: z.array(receiptProductSchema).min(1, "At least one product is required"),
});

export type ReceiptFormData = z.infer<typeof receiptSchema>;
export type ReceiptProduct = z.infer<typeof receiptProductSchema>;

