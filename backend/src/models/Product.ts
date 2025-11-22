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

  static async findAllWithStocks(): Promise<
    Array<Product & { on_hand: number; free_to_use: number }>
  > {
    const result = await pool.query(`
      SELECT 
        p.id,
        p.price,
        p.name,
        p.sku_code,
        p.stocks as on_hand,
        COALESCE(
          p.stocks - SUM(
            CASE 
              WHEN pl.status IN ('Draft', 'Waiting', 'Ready') 
              THEN pl.quantity 
              ELSE 0 
            END
          ),
          p.stocks
        ) as free_to_use
      FROM products p
      LEFT JOIN product_logs pl ON p.id = pl.product_id
      GROUP BY p.id, p.price, p.name, p.sku_code, p.stocks
      ORDER BY p.id
    `);
    return result.rows;
  }
}
