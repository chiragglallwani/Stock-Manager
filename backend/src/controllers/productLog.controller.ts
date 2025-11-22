import type { Request, Response } from "express";
import { ProductLogService } from "../services/productLog.service.js";
import { ResponseHandler } from "../utils/response.js";
import { ProductLogStatus } from "../models/ProductLog.js";

export class ProductLogController {
  static async create(req: Request, res: Response): Promise<void> {
    try {
      const {
        reference_id,
        schedule_at,
        from,
        to,
        product_id,
        quantity,
        status,
        responsible,
      } = req.body;

      if (
        !reference_id ||
        !schedule_at ||
        !from ||
        !to ||
        !product_id ||
        quantity === undefined ||
        !status ||
        !responsible
      ) {
        ResponseHandler.error(
          res,
          "All fields are required: reference_id, schedule_at, from, to, product_id, quantity, status, responsible",
          400
        );
        return;
      }

      const productLog = await ProductLogService.createProductLog({
        reference_id,
        schedule_at: new Date(schedule_at),
        from,
        to,
        product_id,
        quantity,
        status,
        responsible,
      });
      ResponseHandler.success(
        res,
        productLog,
        "Product log created successfully",
        201
      );
    } catch (error) {
      ResponseHandler.error(
        res,
        error instanceof Error ? error.message : "Failed to create product log",
        400
      );
    }
  }

  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const productLogs = await ProductLogService.getAllProductLogs();
      ResponseHandler.success(
        res,
        productLogs,
        "Product logs retrieved successfully"
      );
    } catch (error) {
      ResponseHandler.error(
        res,
        error instanceof Error
          ? error.message
          : "Failed to retrieve product logs",
        500
      );
    }
  }

  static async getById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        ResponseHandler.error(res, "Invalid product log ID", 400);
        return;
      }

      const productLog = await ProductLogService.getProductLogById(id);
      if (!productLog) {
        ResponseHandler.error(res, "Product log not found", 404);
        return;
      }

      ResponseHandler.success(
        res,
        productLog,
        "Product log retrieved successfully"
      );
    } catch (error) {
      ResponseHandler.error(
        res,
        error instanceof Error
          ? error.message
          : "Failed to retrieve product log",
        500
      );
    }
  }

  static async getByReferenceId(req: Request, res: Response): Promise<void> {
    try {
      const { reference_id } = req.params;
      if (!reference_id) {
        ResponseHandler.error(res, "Reference ID is required", 400);
        return;
      }

      const productLogs = await ProductLogService.getProductLogsByReferenceId(
        reference_id
      );
      ResponseHandler.success(
        res,
        productLogs,
        "Product logs retrieved successfully"
      );
    } catch (error) {
      ResponseHandler.error(
        res,
        error instanceof Error
          ? error.message
          : "Failed to retrieve product logs",
        500
      );
    }
  }

  static async getByProductId(req: Request, res: Response): Promise<void> {
    try {
      const product_id = parseInt(req.params.product_id);
      if (isNaN(product_id)) {
        ResponseHandler.error(res, "Invalid product ID", 400);
        return;
      }

      const productLogs = await ProductLogService.getProductLogsByProductId(
        product_id
      );
      ResponseHandler.success(
        res,
        productLogs,
        "Product logs retrieved successfully"
      );
    } catch (error) {
      ResponseHandler.error(
        res,
        error instanceof Error
          ? error.message
          : "Failed to retrieve product logs",
        500
      );
    }
  }

  static async getByStatus(req: Request, res: Response): Promise<void> {
    try {
      const { status } = req.params;
      if (
        !Object.values(ProductLogStatus).includes(status as ProductLogStatus)
      ) {
        ResponseHandler.error(res, "Invalid status", 400);
        return;
      }

      const productLogs = await ProductLogService.getProductLogsByStatus(
        status as ProductLogStatus
      );
      ResponseHandler.success(
        res,
        productLogs,
        "Product logs retrieved successfully"
      );
    } catch (error) {
      ResponseHandler.error(
        res,
        error instanceof Error
          ? error.message
          : "Failed to retrieve product logs",
        500
      );
    }
  }

  static async getDeliveries(req: Request, res: Response): Promise<void> {
    try {
      const deliveries = await ProductLogService.getDeliveries();
      ResponseHandler.success(
        res,
        deliveries,
        "Deliveries retrieved successfully"
      );
    } catch (error) {
      ResponseHandler.error(
        res,
        error instanceof Error
          ? error.message
          : "Failed to retrieve deliveries",
        500
      );
    }
  }

  static async getReceipts(req: Request, res: Response): Promise<void> {
    try {
      const receipts = await ProductLogService.getReceipts();
      ResponseHandler.success(res, receipts, "Receipts retrieved successfully");
    } catch (error) {
      ResponseHandler.error(
        res,
        error instanceof Error ? error.message : "Failed to retrieve receipts",
        500
      );
    }
  }

  static async getAdjustments(req: Request, res: Response): Promise<void> {
    try {
      const adjustments = await ProductLogService.getAdjustments();
      ResponseHandler.success(
        res,
        adjustments,
        "Adjustments retrieved successfully"
      );
    } catch (error) {
      ResponseHandler.error(
        res,
        error instanceof Error
          ? error.message
          : "Failed to retrieve adjustments",
        500
      );
    }
  }

  static async update(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        ResponseHandler.error(res, "Invalid product log ID", 400);
        return;
      }

      const {
        reference_id,
        schedule_at,
        from,
        to,
        product_id,
        quantity,
        status,
        responsible,
      } = req.body;

      const updateData: any = {};
      if (reference_id !== undefined) updateData.reference_id = reference_id;
      if (schedule_at !== undefined)
        updateData.schedule_at = new Date(schedule_at);
      if (from !== undefined) updateData.from = from;
      if (to !== undefined) updateData.to = to;
      if (product_id !== undefined) updateData.product_id = product_id;
      if (quantity !== undefined) updateData.quantity = quantity;
      if (status !== undefined) updateData.status = status;
      if (responsible !== undefined) updateData.responsible = responsible;

      const productLog = await ProductLogService.updateProductLog(
        id,
        updateData
      );

      if (!productLog) {
        ResponseHandler.error(res, "Product log not found", 404);
        return;
      }

      ResponseHandler.success(
        res,
        productLog,
        "Product log updated successfully"
      );
    } catch (error) {
      ResponseHandler.error(
        res,
        error instanceof Error ? error.message : "Failed to update product log",
        400
      );
    }
  }

  static async delete(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        ResponseHandler.error(res, "Invalid product log ID", 400);
        return;
      }

      const deleted = await ProductLogService.deleteProductLog(id);
      if (!deleted) {
        ResponseHandler.error(res, "Product log not found", 404);
        return;
      }

      ResponseHandler.success(res, null, "Product log deleted successfully");
    } catch (error) {
      ResponseHandler.error(
        res,
        error instanceof Error ? error.message : "Failed to delete product log",
        500
      );
    }
  }
}
