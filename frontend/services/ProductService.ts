import { apiClient } from "@/lib/api-client";

export interface Product {
  id?: number;
  name: string;
  sku_code: string;
  price: number;
  stocks: number;
}

export interface ProductStock extends Product {
  on_hand: number;
  free_to_use: number;
}

class ProductService {
  async getProductStocks(): Promise<ProductStock[]> {
    const response = await apiClient.get<ProductStock[]>(
      "/products/product-stocks"
    );
    if (!response.success || !response.data) {
      throw new Error(response.error || "Failed to fetch product stocks");
    }
    return response.data;
  }

  async createProduct(data: {
    name: string;
    sku_code: string;
    price: number;
    stocks: number;
  }): Promise<Product> {
    const response = await apiClient.post<Product>("/products", data);
    if (!response.success || !response.data) {
      throw new Error(response.error || "Failed to create product");
    }
    return response.data;
  }

  async deleteProduct(id: number): Promise<void> {
    const response = await apiClient.delete(`/products/${id}`);
    if (!response.success) {
      throw new Error(response.error || "Failed to delete product");
    }
  }

  async getAllProducts(): Promise<Product[]> {
    const response = await apiClient.get<Product[]>("/products");
    if (!response.success || !response.data) {
      throw new Error(response.error || "Failed to fetch products");
    }
    return response.data;
  }
}

export const productService = new ProductService();
