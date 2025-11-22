import { WarehouseModel, type Warehouse } from "../models/Warehouse.js";

export class WarehouseService {
  static async createWarehouse(data: Warehouse): Promise<Warehouse> {
    return await WarehouseModel.create(data);
  }

  static async getAllWarehouses(): Promise<Warehouse[]> {
    return await WarehouseModel.findAll();
  }

  static async getWarehouseById(id: number): Promise<Warehouse | null> {
    return await WarehouseModel.findById(id);
  }

  static async getWarehouseByShortCode(
    short_code: string
  ): Promise<Warehouse | null> {
    return await WarehouseModel.findByShortCode(short_code);
  }

  static async updateWarehouse(
    id: number,
    data: Partial<Warehouse>
  ): Promise<Warehouse | null> {
    return await WarehouseModel.update(id, data);
  }

  static async deleteWarehouse(id: number): Promise<boolean> {
    return await WarehouseModel.delete(id);
  }
}
