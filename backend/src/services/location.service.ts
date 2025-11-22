import { LocationModel, type Location } from "../models/Location.js";

export class LocationService {
  static async createLocation(data: Location): Promise<Location> {
    return await LocationModel.create(data);
  }

  static async getAllLocations(): Promise<Location[]> {
    return await LocationModel.findAll();
  }

  static async getLocationById(id: number): Promise<Location | null> {
    return await LocationModel.findById(id);
  }

  static async getLocationsByWarehouseCode(
    warehouse_code: string
  ): Promise<Location[]> {
    return await LocationModel.findByWarehouseCode(warehouse_code);
  }

  static async updateLocation(
    id: number,
    data: Partial<Location>
  ): Promise<Location | null> {
    return await LocationModel.update(id, data);
  }

  static async deleteLocation(id: number): Promise<boolean> {
    return await LocationModel.delete(id);
  }
}
