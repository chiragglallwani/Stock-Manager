import pool from "../db/connection.js";

export interface Warehouse {
  id?: number;
  name: string;
  short_code: string;
  address: string;
}

export class WarehouseModel {
  static async create(warehouse: Warehouse): Promise<Warehouse> {
    const { name, short_code, address } = warehouse;

    const result = await pool.query(
      `INSERT INTO warehouses (name, short_code, address)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [name, short_code, address]
    );

    return result.rows[0];
  }

  static async findAll(): Promise<Warehouse[]> {
    const result = await pool.query("SELECT * FROM warehouses ORDER BY id");
    return result.rows;
  }

  static async findById(id: number): Promise<Warehouse | null> {
    const result = await pool.query("SELECT * FROM warehouses WHERE id = $1", [
      id,
    ]);
    return result.rows[0] || null;
  }

  static async findByShortCode(short_code: string): Promise<Warehouse | null> {
    const result = await pool.query(
      "SELECT * FROM warehouses WHERE short_code = $1",
      [short_code]
    );
    return result.rows[0] || null;
  }

  static async update(
    id: number,
    warehouse: Partial<Warehouse>
  ): Promise<Warehouse | null> {
    const { name, short_code, address } = warehouse;
    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (name !== undefined) {
      updates.push(`name = $${paramCount++}`);
      values.push(name);
    }
    if (short_code !== undefined) {
      updates.push(`short_code = $${paramCount++}`);
      values.push(short_code);
    }
    if (address !== undefined) {
      updates.push(`address = $${paramCount++}`);
      values.push(address);
    }

    if (updates.length === 0) {
      return await this.findById(id);
    }

    values.push(id);
    const result = await pool.query(
      `UPDATE warehouses SET ${updates.join(
        ", "
      )} WHERE id = $${paramCount} RETURNING *`,
      values
    );

    return result.rows[0] || null;
  }

  static async delete(id: number): Promise<boolean> {
    const result = await pool.query("DELETE FROM warehouses WHERE id = $1", [
      id,
    ]);
    return result.rowCount ? result.rowCount > 0 : false;
  }
}
