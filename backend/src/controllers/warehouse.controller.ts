import type { Request, Response } from "express";
import { WarehouseService } from "../services/warehouse.service.js";
import { ResponseHandler } from "../utils/response.js";

export class WarehouseController {
  static async create(req: Request, res: Response): Promise<void> {
    try {
      const { name, short_code, address } = req.body;

      if (!name || !short_code || !address) {
        ResponseHandler.error(
          res,
          "Name, short_code, and address are required",
          400
        );
        return;
      }

      const warehouse = await WarehouseService.createWarehouse({
        name,
        short_code,
        address,
      });
      ResponseHandler.success(
        res,
        warehouse,
        "Warehouse created successfully",
        201
      );
    } catch (error) {
      ResponseHandler.error(
        res,
        error instanceof Error ? error.message : "Failed to create warehouse",
        400
      );
    }
  }

  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const warehouses = await WarehouseService.getAllWarehouses();
      ResponseHandler.success(
        res,
        warehouses,
        "Warehouses retrieved successfully"
      );
    } catch (error) {
      ResponseHandler.error(
        res,
        error instanceof Error
          ? error.message
          : "Failed to retrieve warehouses",
        500
      );
    }
  }

  static async getById(req: Request, res: Response): Promise<void> {
    try {
      if (!req.params.id || isNaN(parseInt(req.params.id))) {
        ResponseHandler.error(res, "Invalid warehouse ID", 400);
        return;
      }

      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        ResponseHandler.error(res, "Invalid warehouse ID", 400);
        return;
      }

      const warehouse = await WarehouseService.getWarehouseById(id);
      if (!warehouse) {
        ResponseHandler.error(res, "Warehouse not found", 404);
        return;
      }

      ResponseHandler.success(
        res,
        warehouse,
        "Warehouse retrieved successfully"
      );
    } catch (error) {
      ResponseHandler.error(
        res,
        error instanceof Error ? error.message : "Failed to retrieve warehouse",
        500
      );
    }
  }

  static async getByShortCode(req: Request, res: Response): Promise<void> {
    try {
      const { short_code } = req.params;
      if (!short_code) {
        ResponseHandler.error(res, "Short code is required", 400);
        return;
      }

      const warehouse = await WarehouseService.getWarehouseByShortCode(
        short_code
      );
      if (!warehouse) {
        ResponseHandler.error(res, "Warehouse not found", 404);
        return;
      }

      ResponseHandler.success(
        res,
        warehouse,
        "Warehouse retrieved successfully"
      );
    } catch (error) {
      ResponseHandler.error(
        res,
        error instanceof Error ? error.message : "Failed to retrieve warehouse",
        500
      );
    }
  }

  static async update(req: Request, res: Response): Promise<void> {
    try {
      if (!req.params.id || isNaN(parseInt(req.params.id))) {
        ResponseHandler.error(res, "Invalid warehouse ID", 400);
        return;
      }

      const id = parseInt(req.params.id);

      const { name, short_code, address } = req.body;
      const warehouse = await WarehouseService.updateWarehouse(id, {
        name,
        short_code,
        address,
      });

      if (!warehouse) {
        ResponseHandler.error(res, "Warehouse not found", 404);
        return;
      }

      ResponseHandler.success(res, warehouse, "Warehouse updated successfully");
    } catch (error) {
      ResponseHandler.error(
        res,
        error instanceof Error ? error.message : "Failed to update warehouse",
        400
      );
    }
  }

  static async delete(req: Request, res: Response): Promise<void> {
    try {
      if (!req.params.id || isNaN(parseInt(req.params.id))) {
        ResponseHandler.error(res, "Invalid warehouse ID", 400);
        return;
      }

      const id = parseInt(req.params.id);

      const deleted = await WarehouseService.deleteWarehouse(id);
      if (!deleted) {
        ResponseHandler.error(res, "Warehouse not found", 404);
        return;
      }

      ResponseHandler.success(res, null, "Warehouse deleted successfully");
    } catch (error) {
      ResponseHandler.error(
        res,
        error instanceof Error ? error.message : "Failed to delete warehouse",
        500
      );
    }
  }
}
