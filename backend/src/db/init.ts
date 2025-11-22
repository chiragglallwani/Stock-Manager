import pool from "./connection.js";

export async function initializeDatabase(): Promise<void> {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Create products table
    await client.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        price DECIMAL(10, 2) NOT NULL,
        name VARCHAR(255) NOT NULL,
        sku_code VARCHAR(255) UNIQUE NOT NULL,
        stocks INTEGER NOT NULL CHECK (stocks >= 0),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create warehouses table
    await client.query(`
      CREATE TABLE IF NOT EXISTS warehouses (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        short_code VARCHAR(255) UNIQUE NOT NULL,
        address TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create locations table
    await client.query(`
      CREATE TABLE IF NOT EXISTS locations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        warehouse_code VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (warehouse_code) REFERENCES warehouses(short_code) ON DELETE CASCADE
      )
    `);

    // Create product_logs table
    await client.query(`
      CREATE TABLE IF NOT EXISTS product_logs (
        id SERIAL PRIMARY KEY,
        reference_id VARCHAR(255) NOT NULL,
        schedule_at TIMESTAMP NOT NULL,
        "from" VARCHAR(255) NOT NULL,
        "to" VARCHAR(255) NOT NULL,
        product_id INTEGER NOT NULL,
        quantity INTEGER NOT NULL,
        status VARCHAR(50) NOT NULL CHECK (status IN ('Draft', 'Waiting', 'Ready', 'Done')),
        responsible VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
      )
    `);

    // Create users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        email VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        refresh_token TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create indexes for better performance
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_products_sku_code ON products(sku_code)
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_warehouses_short_code ON warehouses(short_code)
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_locations_warehouse_code ON locations(warehouse_code)
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_product_logs_product_id ON product_logs(product_id)
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_product_logs_status ON product_logs(status)
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_users_username ON users(username)
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)
    `);

    await client.query("COMMIT");
    console.log("Database tables initialized successfully");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error initializing database:", error);
    throw error;
  } finally {
    client.release();
  }
}
