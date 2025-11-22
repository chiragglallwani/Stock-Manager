import type { Request, Response } from "express";
import { LocationService } from "../services/location.service.js";
import { ResponseHandler } from "../utils/response.js";

export class LocationController {
  static async create(req: Request, res: Response): Promise<void> {
    try {
      const { name, warehouse_code } = req.body;

      if (!name || !warehouse_code) {
        ResponseHandler.error(res, "Name and warehouse_code are required", 400);
        return;
      }

      const location = await LocationService.createLocation({
        name,
        warehouse_code,
      });
      ResponseHandler.success(
        res,
        location,
        "Location created successfully",
        201
      );
    } catch (error) {
      ResponseHandler.error(
        res,
        error instanceof Error ? error.message : "Failed to create location",
        400
      );
    }
  }

  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const locations = await LocationService.getAllLocations();
      ResponseHandler.success(
        res,
        locations,
        "Locations retrieved successfully"
      );
    } catch (error) {
      ResponseHandler.error(
        res,
        error instanceof Error ? error.message : "Failed to retrieve locations",
        500
      );
    }
  }

  static async getById(req: Request, res: Response): Promise<void> {
    try {
      if (!req.params.id || isNaN(parseInt(req.params.id))) {
        ResponseHandler.error(res, "Invalid location ID", 400);
        return;
      }

      const id = parseInt(req.params.id);

      const location = await LocationService.getLocationById(id);
      if (!location) {
        ResponseHandler.error(res, "Location not found", 404);
        return;
      }

      ResponseHandler.success(res, location, "Location retrieved successfully");
    } catch (error) {
      ResponseHandler.error(
        res,
        error instanceof Error ? error.message : "Failed to retrieve location",
        500
      );
    }
  }

  static async getByWarehouseCode(req: Request, res: Response): Promise<void> {
    try {
      const { warehouse_code } = req.params;
      if (!warehouse_code) {
        ResponseHandler.error(res, "Warehouse code is required", 400);
        return;
      }

      const locations = await LocationService.getLocationsByWarehouseCode(
        warehouse_code
      );
      ResponseHandler.success(
        res,
        locations,
        "Locations retrieved successfully"
      );
    } catch (error) {
      ResponseHandler.error(
        res,
        error instanceof Error ? error.message : "Failed to retrieve locations",
        500
      );
    }
  }

  static async update(req: Request, res: Response): Promise<void> {
    try {
      if (!req.params.id || isNaN(parseInt(req.params.id))) {
        ResponseHandler.error(res, "Invalid location ID", 400);
        return;
      }

      const id = parseInt(req.params.id);

      const { name, warehouse_code } = req.body;
      const location = await LocationService.updateLocation(id, {
        name,
        warehouse_code,
      });

      if (!location) {
        ResponseHandler.error(res, "Location not found", 404);
        return;
      }

      ResponseHandler.success(res, location, "Location updated successfully");
    } catch (error) {
      ResponseHandler.error(
        res,
        error instanceof Error ? error.message : "Failed to update location",
        400
      );
    }
  }

  static async delete(req: Request, res: Response): Promise<void> {
    try {
      if (!req.params.id || isNaN(parseInt(req.params.id))) {
        ResponseHandler.error(res, "Invalid location ID", 400);
        return;
      }

      const id = parseInt(req.params.id);

      const deleted = await LocationService.deleteLocation(id);
      if (!deleted) {
        ResponseHandler.error(res, "Location not found", 404);
        return;
      }

      ResponseHandler.success(res, null, "Location deleted successfully");
    } catch (error) {
      ResponseHandler.error(
        res,
        error instanceof Error ? error.message : "Failed to delete location",
        500
      );
    }
  }
}
