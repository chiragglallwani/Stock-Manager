import {
  ProductLogModel,
  type ProductLog,
  ProductLogStatus,
} from "../models/ProductLog.js";

export class ProductLogService {
  static async createProductLog(data: ProductLog): Promise<ProductLog> {
    return await ProductLogModel.create(data);
  }

  static async getAllProductLogs(): Promise<ProductLog[]> {
    return await ProductLogModel.findAll();
  }

  static async getProductLogById(id: number): Promise<ProductLog | null> {
    return await ProductLogModel.findById(id);
  }

  static async getProductLogsByReferenceId(
    reference_id: string
  ): Promise<ProductLog[]> {
    return await ProductLogModel.findByReferenceId(reference_id);
  }

  static async getProductLogsByProductId(
    product_id: number
  ): Promise<ProductLog[]> {
    return await ProductLogModel.findByProductId(product_id);
  }

  static async getProductLogsByStatus(
    status: ProductLogStatus
  ): Promise<ProductLog[]> {
    return await ProductLogModel.findByStatus(status);
  }

  static async getDeliveries(): Promise<ProductLog[]> {
    return await ProductLogModel.getDeliveries();
  }

  static async getReceipts(): Promise<ProductLog[]> {
    return await ProductLogModel.getReceipts();
  }

  static async getAdjustments(): Promise<ProductLog[]> {
    return await ProductLogModel.getAdjustments();
  }

  static async updateProductLog(
    id: number,
    data: Partial<ProductLog>
  ): Promise<ProductLog | null> {
    return await ProductLogModel.update(id, data);
  }

  static async deleteProductLog(id: number): Promise<boolean> {
    return await ProductLogModel.delete(id);
  }
}
