import pool from "../db/connection.js";

export interface Location {
  id?: number;
  name: string;
  warehouse_code: string;
}

export class LocationModel {
  static async create(location: Location): Promise<Location> {
    const { name, warehouse_code } = location;

    // Verify warehouse exists
    const warehouseCheck = await pool.query(
      "SELECT id FROM warehouses WHERE short_code = $1",
      [warehouse_code]
    );

    if (warehouseCheck.rows.length === 0) {
      throw new Error(
        `Warehouse with short_code '${warehouse_code}' does not exist`
      );
    }

    const result = await pool.query(
      `INSERT INTO locations (name, warehouse_code)
       VALUES ($1, $2)
       RETURNING *`,
      [name, warehouse_code]
    );

    return result.rows[0];
  }

  static async findAll(): Promise<Location[]> {
    const result = await pool.query("SELECT * FROM locations ORDER BY id");
    return result.rows;
  }

  static async findById(id: number): Promise<Location | null> {
    const result = await pool.query("SELECT * FROM locations WHERE id = $1", [
      id,
    ]);
    return result.rows[0] || null;
  }

  static async findByWarehouseCode(
    warehouse_code: string
  ): Promise<Location[]> {
    const result = await pool.query(
      "SELECT * FROM locations WHERE warehouse_code = $1 ORDER BY id",
      [warehouse_code]
    );
    return result.rows;
  }

  static async update(
    id: number,
    location: Partial<Location>
  ): Promise<Location | null> {
    const { name, warehouse_code } = location;
    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (warehouse_code !== undefined) {
      // Verify warehouse exists
      const warehouseCheck = await pool.query(
        "SELECT id FROM warehouses WHERE short_code = $1",
        [warehouse_code]
      );

      if (warehouseCheck.rows.length === 0) {
        throw new Error(
          `Warehouse with short_code '${warehouse_code}' does not exist`
        );
      }

      updates.push(`warehouse_code = $${paramCount++}`);
      values.push(warehouse_code);
    }
    if (name !== undefined) {
      updates.push(`name = $${paramCount++}`);
      values.push(name);
    }

    if (updates.length === 0) {
      return await this.findById(id);
    }

    values.push(id);
    const result = await pool.query(
      `UPDATE locations SET ${updates.join(
        ", "
      )} WHERE id = $${paramCount} RETURNING *`,
      values
    );

    return result.rows[0] || null;
  }

  static async delete(id: number): Promise<boolean> {
    const result = await pool.query("DELETE FROM locations WHERE id = $1", [
      id,
    ]);
    return result.rowCount ? result.rowCount > 0 : false;
  }
}
