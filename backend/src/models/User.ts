import pool from "../db/connection.js";

export interface User {
  id?: number;
  username: string;
  email: string;
  password: string;
  refresh_token?: string | null;
}

export class UserModel {
  static async create(user: User): Promise<User> {
    const { username, email, password, refresh_token } = user;

    const result = await pool.query(
      `INSERT INTO users (username, email, password, refresh_token)
       VALUES ($1, $2, $3, $4)
       RETURNING id, username, email, refresh_token`,
      [username, email, password, refresh_token || null]
    );

    return result.rows[0];
  }

  static async findAll(): Promise<Omit<User, "password">[]> {
    const result = await pool.query(
      "SELECT id, username, email, refresh_token FROM users ORDER BY id"
    );
    return result.rows;
  }

  static async findById(id: number): Promise<Omit<User, "password"> | null> {
    const result = await pool.query(
      "SELECT id, username, email, refresh_token FROM users WHERE id = $1",
      [id]
    );
    return result.rows[0] || null;
  }

  static async findByUsername(username: string): Promise<User | null> {
    const result = await pool.query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);
    return result.rows[0] || null;
  }

  static async findByEmail(email: string): Promise<User | null> {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    return result.rows[0] || null;
  }

  static async update(
    id: number,
    user: Partial<User>
  ): Promise<Omit<User, "password"> | null> {
    const { username, email, password, refresh_token } = user;
    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (username !== undefined) {
      updates.push(`username = $${paramCount++}`);
      values.push(username);
    }
    if (email !== undefined) {
      updates.push(`email = $${paramCount++}`);
      values.push(email);
    }
    if (password !== undefined) {
      updates.push(`password = $${paramCount++}`);
      values.push(password);
    }
    if (refresh_token !== undefined) {
      updates.push(`refresh_token = $${paramCount++}`);
      values.push(refresh_token);
    }

    if (updates.length === 0) {
      return await this.findById(id);
    }

    values.push(id);
    const result = await pool.query(
      `UPDATE users SET ${updates.join(", ")} WHERE id = $${paramCount} 
       RETURNING id, username, email, refresh_token`,
      values
    );

    return result.rows[0] || null;
  }

  static async delete(id: number): Promise<boolean> {
    const result = await pool.query("DELETE FROM users WHERE id = $1", [id]);
    return result.rowCount ? result.rowCount > 0 : false;
  }
}
