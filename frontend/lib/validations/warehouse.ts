import { z } from "zod";

export const warehouseSchema = z.object({
  name: z.string().min(1, "Warehouse name is required"),
  short_code: z.string().min(1, "Short code is required"),
  address: z.string().min(1, "Address is required"),
});

export type WarehouseFormData = z.infer<typeof warehouseSchema>;
