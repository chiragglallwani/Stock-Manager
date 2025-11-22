import { apiClient } from "@/lib/api-client";

export interface Warehouse {
  id?: number;
  name: string;
  short_code: string;
  address: string;
}

class WarehouseService {
  async getAllWarehouses(): Promise<Warehouse[]> {
    const response = await apiClient.get<Warehouse[]>("/warehouses");
    if (!response.success || !response.data) {
      throw new Error(response.error || "Failed to fetch warehouses");
    }
    return response.data;
  }

  async createWarehouse(data: {
    name: string;
    short_code: string;
    address: string;
  }): Promise<Warehouse> {
    const response = await apiClient.post<Warehouse>("/warehouses", data);
    if (!response.success || !response.data) {
      throw new Error(response.error || "Failed to create warehouse");
    }
    return response.data;
  }

  async deleteWarehouse(id: number): Promise<void> {
    const response = await apiClient.delete(`/warehouses/${id}`);
    if (!response.success) {
      throw new Error(response.error || "Failed to delete warehouse");
    }
  }
}

export const warehouseService = new WarehouseService();
