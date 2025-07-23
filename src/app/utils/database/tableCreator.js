
import pool from "./db";


async function createUsersTable() {
  const query = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      first_name VARCHAR(100),
      last_name VARCHAR(100),
      email VARCHAR(255) UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    const client = await pool.connect();
    await client.query(query);
    client.release();
    console.log("✅ Users table created (if not exists).");
  } catch (error) {
    console.error("❌ Error creating users table:", error);
  }
}
async function createForgotPasswordOTPsTable() {
  const query = `
    CREATE TABLE IF NOT EXISTS forgot_password_otps (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) NOT NULL,
      otp VARCHAR(10) NOT NULL,
      expires_at TIMESTAMP NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    const client = await pool.connect();
    await client.query(query);
    client.release();
    console.log("✅ forgot_password_otps table created (if not exists).");
  } catch (error) {
    console.error("❌ Error creating forgot_password_otps table:", error);
  }
}

async function createEmailSettingsTable() {
  const query = `
    CREATE TABLE IF NOT EXISTS email_settings (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      email_address VARCHAR(255) NOT NULL,
      password VARCHAR(255) NOT NULL,
      sender_name VARCHAR(255),
      signature TEXT,
      daily_sending_capacity INTEGER,
      daily_usage INTEGER DEFAULT 0,
      last_used TIMESTAMP,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    const client = await pool.connect();
    await client.query(query);
    client.release();
    console.log("✅ email_settings table created (if not exists).");
  } catch (error) {
    console.error("❌ Error creating email_settings table:", error);
  }
}
async function createOutboundSettingsTable() {
  const query = `
    CREATE TABLE IF NOT EXISTS outbound_settings (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      outbound_name VARCHAR(255) NOT NULL,
      initial_email_list TEXT NOT NULL,
      deleted_email_list TEXT NOT NULL,
      list_allocations TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    const client = await pool.connect();
    await client.query(query);
    client.release();
    console.log("✅ outbound_settings table created (if not exists).");
  } catch (error) {
    console.error("❌ Error creating outbound_settings table:", error);
  }
}









export async function TableCreator(){
    await createUsersTable()
    await createForgotPasswordOTPsTable()
    await createEmailSettingsTable();
    createOutboundSettingsTable();
}