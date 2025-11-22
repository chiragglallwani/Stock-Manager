import { z } from "zod";

export const locationSchema = z.object({
  name: z.string().min(1, "Location name is required"),
  warehouse_code: z.string().min(1, "Warehouse is required"),
});

export type LocationFormData = z.infer<typeof locationSchema>;
