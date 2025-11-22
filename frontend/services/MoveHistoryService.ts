import { apiClient } from "@/lib/api-client";

export interface ProductLog {
  id?: number;
  reference_id: string;
  schedule_at: string | Date;
  from: string;
  to: string;
  product_id: number;
  quantity: number;
  status: string;
  responsible: string;
  product_name?: string;
}

class MoveHistoryService {
  async getAllMoveHistory(): Promise<ProductLog[]> {
    const response = await apiClient.get<ProductLog[]>(
      "/product-logs/with-product-name"
    );
    if (!response.success || !response.data) {
      throw new Error(response.error || "Failed to fetch move history");
    }
    return response.data;
  }

  async getDeliveries(): Promise<ProductLog[]> {
    const response = await apiClient.get<ProductLog[]>(
      "/product-logs/deliveries/with-product-name"
    );
    if (!response.success || !response.data) {
      throw new Error(response.error || "Failed to fetch deliveries");
    }
    return response.data;
  }

  async getReceipts(): Promise<ProductLog[]> {
    const response = await apiClient.get<ProductLog[]>(
      "/product-logs/receipts/with-product-name"
    );
    if (!response.success || !response.data) {
      throw new Error(response.error || "Failed to fetch receipts");
    }
    return response.data;
  }

  async createReceipt(data: {
    warehouse_short_code: string;
    schedule_at: string;
    from: string;
    products: Array<{ product_id: number; quantity: number }>;
  }): Promise<ProductLog[]> {
    const response = await apiClient.post<ProductLog[]>(
      "/product-logs/receipt",
      data
    );
    if (!response.success || !response.data) {
      throw new Error(response.error || "Failed to create receipt");
    }
    return response.data;
  }

  async createDelivery(data: {
    warehouse_short_code: string;
    schedule_at: string;
    to: string;
    products: Array<{ product_id: number; quantity: number }>;
  }): Promise<ProductLog[]> {
    const response = await apiClient.post<ProductLog[]>(
      "/product-logs/delivery",
      data
    );
    if (!response.success || !response.data) {
      throw new Error(response.error || "Failed to create delivery");
    }
    return response.data;
  }

  async updateReceiptStatus(reference_id: string): Promise<ProductLog[]> {
    const response = await apiClient.put<ProductLog[]>(
      `/product-logs/receipt/${encodeURIComponent(reference_id)}/status`,
      {}
    );
    if (!response.success || !response.data) {
      throw new Error(response.error || "Failed to update receipt status");
    }
    return response.data;
  }

  async updateDeliveryStatus(reference_id: string): Promise<ProductLog[]> {
    const response = await apiClient.put<ProductLog[]>(
      `/product-logs/delivery/${encodeURIComponent(reference_id)}/status`,
      {}
    );
    if (!response.success || !response.data) {
      throw new Error(response.error || "Failed to update delivery status");
    }
    return response.data;
  }

  async getByReferenceId(reference_id: string): Promise<ProductLog[]> {
    const response = await apiClient.get<ProductLog[]>(
      `/product-logs/reference/${encodeURIComponent(reference_id)}`
    );
    if (!response.success || !response.data) {
      throw new Error(response.error || "Failed to fetch product logs");
    }
    return response.data;
  }

  async getReceiptStats(): Promise<{ total: number; late: number }> {
    const response = await apiClient.get<{ total: number; late: number }>(
      "/product-logs/stats/receipt"
    );
    if (!response.success || !response.data) {
      throw new Error(response.error || "Failed to fetch receipt stats");
    }
    return response.data;
  }

  async getDeliveryStats(): Promise<{ total: number; late: number }> {
    const response = await apiClient.get<{ total: number; late: number }>(
      "/product-logs/stats/delivery"
    );
    if (!response.success || !response.data) {
      throw new Error(response.error || "Failed to fetch delivery stats");
    }
    return response.data;
  }
}

export const moveHistoryService = new MoveHistoryService();

