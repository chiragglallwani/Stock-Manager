import pool from "../db/connection.js";

export enum ProductLogStatus {
  Draft = "Draft",
  Waiting = "Waiting",
  Ready = "Ready",
  Done = "Done",
}

export interface ProductLog {
  id?: number;
  reference_id: string;
  schedule_at: Date;
  from: string;
  to: string;
  product_id: number;
  quantity: number;
  status: ProductLogStatus;
  responsible: string;
}

export class ProductLogModel {
  static async create(productLog: ProductLog): Promise<ProductLog> {
    const {
      reference_id,
      schedule_at,
      from,
      to,
      product_id,
      quantity,
      status,
      responsible,
    } = productLog;

    // Verify product exists
    const productCheck = await pool.query(
      "SELECT id FROM products WHERE id = $1",
      [product_id]
    );

    if (productCheck.rows.length === 0) {
      throw new Error(`Product with id ${product_id} does not exist`);
    }

    const result = await pool.query(
      `INSERT INTO product_logs (reference_id, schedule_at, "from", "to", product_id, quantity, status, responsible)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        reference_id,
        schedule_at,
        from,
        to,
        product_id,
        quantity,
        status,
        responsible,
      ]
    );

    return result.rows[0];
  }

  static async findAll(): Promise<ProductLog[]> {
    const result = await pool.query("SELECT * FROM product_logs ORDER BY id");
    return result.rows;
  }

  static async findById(id: number): Promise<ProductLog | null> {
    const result = await pool.query(
      "SELECT * FROM product_logs WHERE id = $1",
      [id]
    );
    return result.rows[0] || null;
  }

  static async findByReferenceId(reference_id: string): Promise<ProductLog[]> {
    const result = await pool.query(
      "SELECT * FROM product_logs WHERE reference_id = $1 ORDER BY id",
      [reference_id]
    );
    return result.rows;
  }

  static async findByProductId(product_id: number): Promise<ProductLog[]> {
    const result = await pool.query(
      "SELECT * FROM product_logs WHERE product_id = $1 ORDER BY id",
      [product_id]
    );
    return result.rows;
  }

  static async findByStatus(status: ProductLogStatus): Promise<ProductLog[]> {
    const result = await pool.query(
      "SELECT * FROM product_logs WHERE status = $1 ORDER BY id",
      [status]
    );
    return result.rows;
  }

  static async update(
    id: number,
    productLog: Partial<ProductLog>
  ): Promise<ProductLog | null> {
    const {
      reference_id,
      schedule_at,
      from,
      to,
      product_id,
      quantity,
      status,
      responsible,
    } = productLog;
    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (reference_id !== undefined) {
      updates.push(`reference_id = $${paramCount++}`);
      values.push(reference_id);
    }
    if (schedule_at !== undefined) {
      updates.push(`schedule_at = $${paramCount++}`);
      values.push(schedule_at);
    }
    if (from !== undefined) {
      updates.push(`"from" = $${paramCount++}`);
      values.push(from);
    }
    if (to !== undefined) {
      updates.push(`"to" = $${paramCount++}`);
      values.push(to);
    }
    if (product_id !== undefined) {
      // Verify product exists
      const productCheck = await pool.query(
        "SELECT id FROM products WHERE id = $1",
        [product_id]
      );

      if (productCheck.rows.length === 0) {
        throw new Error(`Product with id ${product_id} does not exist`);
      }

      updates.push(`product_id = $${paramCount++}`);
      values.push(product_id);
    }
    if (quantity !== undefined) {
      updates.push(`quantity = $${paramCount++}`);
      values.push(quantity);
    }
    if (status !== undefined) {
      updates.push(`status = $${paramCount++}`);
      values.push(status);
    }
    if (responsible !== undefined) {
      updates.push(`responsible = $${paramCount++}`);
      values.push(responsible);
    }

    if (updates.length === 0) {
      return await this.findById(id);
    }

    values.push(id);
    const result = await pool.query(
      `UPDATE product_logs SET ${updates.join(
        ", "
      )} WHERE id = $${paramCount} RETURNING *`,
      values
    );

    return result.rows[0] || null;
  }

  static async getDeliveries(): Promise<ProductLog[]> {
    const result = await pool.query(
      `SELECT * FROM product_logs 
       WHERE reference_id LIKE '%/OUT/%' 
       AND "to" NOT LIKE '%/IN/%'
       ORDER BY id`
    );
    return result.rows;
  }

  static async getReceipts(): Promise<ProductLog[]> {
    const result = await pool.query(
      `SELECT * FROM product_logs 
       WHERE reference_id LIKE '%/IN/%' 
       AND "to" NOT LIKE '%/IN/%'
       ORDER BY id`
    );
    return result.rows;
  }

  static async getAdjustments(): Promise<ProductLog[]> {
    const result = await pool.query(
      `SELECT * FROM product_logs 
       WHERE reference_id LIKE '%/IN/%' 
       AND "from" LIKE '%/IN/%' 
       AND "to" LIKE '%/OUT/%'
       ORDER BY id`
    );
    return result.rows;
  }

  static async delete(id: number): Promise<boolean> {
    const result = await pool.query("DELETE FROM product_logs WHERE id = $1", [
      id,
    ]);
    return result.rowCount ? result.rowCount > 0 : false;
  }
}
