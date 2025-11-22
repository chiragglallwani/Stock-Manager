import type { Request, Response } from "express";
import { ProductService } from "../services/product.service.js";
import { ResponseHandler } from "../utils/response.js";

export class ProductController {
  static async create(req: Request, res: Response): Promise<void> {
    try {
      const { price, name, sku_code, stocks } = req.body;

      if (!price || !name || !sku_code || stocks === undefined) {
        ResponseHandler.error(
          res,
          "Price, name, sku_code, and stocks are required",
          400
        );
        return;
      }

      const product = await ProductService.createProduct({
        price,
        name,
        sku_code,
        stocks,
      });
      ResponseHandler.success(
        res,
        product,
        "Product created successfully",
        201
      );
    } catch (error) {
      ResponseHandler.error(
        res,
        error instanceof Error ? error.message : "Failed to create product",
        400
      );
    }
  }

  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const products = await ProductService.getAllProducts();
      ResponseHandler.success(res, products, "Products retrieved successfully");
    } catch (error) {
      ResponseHandler.error(
        res,
        error instanceof Error ? error.message : "Failed to retrieve products",
        500
      );
    }
  }

  static async getById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        ResponseHandler.error(res, "Invalid product ID", 400);
        return;
      }

      const product = await ProductService.getProductById(id);
      if (!product) {
        ResponseHandler.error(res, "Product not found", 404);
        return;
      }

      ResponseHandler.success(res, product, "Product retrieved successfully");
    } catch (error) {
      ResponseHandler.error(
        res,
        error instanceof Error ? error.message : "Failed to retrieve product",
        500
      );
    }
  }

  static async getBySkuCode(req: Request, res: Response): Promise<void> {
    try {
      const { sku_code } = req.params;
      if (!sku_code) {
        ResponseHandler.error(res, "SKU code is required", 400);
        return;
      }

      const product = await ProductService.getProductBySkuCode(sku_code);
      if (!product) {
        ResponseHandler.error(res, "Product not found", 404);
        return;
      }

      ResponseHandler.success(res, product, "Product retrieved successfully");
    } catch (error) {
      ResponseHandler.error(
        res,
        error instanceof Error ? error.message : "Failed to retrieve product",
        500
      );
    }
  }

  static async update(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        ResponseHandler.error(res, "Invalid product ID", 400);
        return;
      }

      const { price, name, sku_code, stocks } = req.body;
      const product = await ProductService.updateProduct(id, {
        price,
        name,
        sku_code,
        stocks,
      });

      if (!product) {
        ResponseHandler.error(res, "Product not found", 404);
        return;
      }

      ResponseHandler.success(res, product, "Product updated successfully");
    } catch (error) {
      ResponseHandler.error(
        res,
        error instanceof Error ? error.message : "Failed to update product",
        400
      );
    }
  }

  static async delete(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        ResponseHandler.error(res, "Invalid product ID", 400);
        return;
      }

      const deleted = await ProductService.deleteProduct(id);
      if (!deleted) {
        ResponseHandler.error(res, "Product not found", 404);
        return;
      }

      ResponseHandler.success(res, null, "Product deleted successfully");
    } catch (error) {
      ResponseHandler.error(
        res,
        error instanceof Error ? error.message : "Failed to delete product",
        500
      );
    }
  }

  static async getProductStocks(req: Request, res: Response): Promise<void> {
    try {
      const products = await ProductService.getProductStocks();
      ResponseHandler.success(
        res,
        products,
        "Product stocks retrieved successfully"
      );
    } catch (error) {
      ResponseHandler.error(
        res,
        error instanceof Error
          ? error.message
          : "Failed to retrieve product stocks",
        500
      );
    }
  }
}
