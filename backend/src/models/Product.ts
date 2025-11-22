import pool from "../db/connection.js";

export interface Product {
  id?: number;
  price: number;
  name: string;
  sku_code: string;
  stocks: number;
}

export class ProductModel {
  static async create(product: Product): Promise<Product> {
    const { price, name, sku_code, stocks } = product;

    if (stocks < 0) {
      throw new Error("Stocks must be 0 or positive");
    }

    const result = await pool.query(
      `INSERT INTO products (price, name, sku_code, stocks)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [price, name, sku_code, stocks]
    );

    return result.rows[0];
  }

  static async findAll(): Promise<Product[]> {
    const result = await pool.query("SELECT * FROM products ORDER BY id");
    return result.rows;
  }

  static async findById(id: number): Promise<Product | null> {
    const result = await pool.query("SELECT * FROM products WHERE id = $1", [
      id,
    ]);
    return result.rows[0] || null;
  }

  static async findBySkuCode(sku_code: string): Promise<Product | null> {
    const result = await pool.query(
      "SELECT * FROM products WHERE sku_code = $1",
      [sku_code]
    );
    return result.rows[0] || null;
  }

  static async update(
    id: number,
    product: Partial<Product>
  ): Promise<Product | null> {
    const { price, name, sku_code, stocks } = product;
    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (price !== undefined) {
      updates.push(`price = $${paramCount++}`);
      values.push(price);
    }
    if (name !== undefined) {
      updates.push(`name = $${paramCount++}`);
      values.push(name);
    }
    if (sku_code !== undefined) {
      updates.push(`sku_code = $${paramCount++}`);
      values.push(sku_code);
    }
    if (stocks !== undefined) {
      if (stocks < 0) {
        throw new Error("Stocks must be 0 or positive");
      }
      updates.push(`stocks = $${paramCount++}`);
      values.push(stocks);
    }

    if (updates.length === 0) {
      return await this.findById(id);
    }

    values.push(id);
    const result = await pool.query(
      `UPDATE products SET ${updates.join(
        ", "
      )} WHERE id = $${paramCount} RETURNING *`,
      values
    );

    return result.rows[0] || null;
  }

  static async delete(id: number): Promise<boolean> {
    const result = await pool.query("DELETE FROM products WHERE id = $1", [id]);
    return result.rowCount ? result.rowCount > 0 : false;
  }
}
