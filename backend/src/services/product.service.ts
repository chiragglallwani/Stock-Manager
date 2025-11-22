import { ProductModel, type Product } from "../models/Product.js";

export class ProductService {
  static async createProduct(data: Product): Promise<Product> {
    return await ProductModel.create(data);
  }

  static async getAllProducts(): Promise<Product[]> {
    return await ProductModel.findAll();
  }

  static async getProductById(id: number): Promise<Product | null> {
    return await ProductModel.findById(id);
  }

  static async getProductBySkuCode(sku_code: string): Promise<Product | null> {
    return await ProductModel.findBySkuCode(sku_code);
  }

  static async updateProduct(
    id: number,
    data: Partial<Product>
  ): Promise<Product | null> {
    return await ProductModel.update(id, data);
  }

  static async deleteProduct(id: number): Promise<boolean> {
    return await ProductModel.delete(id);
  }
}
