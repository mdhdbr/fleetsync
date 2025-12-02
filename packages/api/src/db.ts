// db.ts
import pkg from "pg";
const { Pool } = pkg;
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

// ES module __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env explicitly from package root
dotenv.config({ path: resolve(__dirname, "../.env") });

// -------------------- DEBUG --------------------
console.log("🔹 DB_USER:", process.env.DB_USER);
console.log("🔹 DB_PASSWORD:", process.env.DB_PASSWORD ? "[SET]" : "[EMPTY]");
console.log("🔹 DB_NAME:", process.env.DB_NAME);
console.log("🔹 DB_HOST:", process.env.DB_HOST);
console.log("🔹 DB_PORT:", process.env.DB_PORT);

// -------------------- POSTGRES POOL --------------------
const pool = new Pool({
  user: String(process.env.DB_USER),
  host: String(process.env.DB_HOST),
  database: String(process.env.DB_NAME),
  password: String(process.env.DB_PASSWORD),
  port: Number(process.env.DB_PORT) || 5432,
});

// Test connection
pool.connect()
  .then(() => console.log("✅ Connected to PostgreSQL"))
  .catch(err => {
    console.error("❌ PostgreSQL connection error:", err.message);
    process.exit(1);
  });

// -------------------- TABLE INIT --------------------
export async function initDB() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS incidents (
        id BIGSERIAL PRIMARY KEY,
        type TEXT,
        severity TEXT,
        location TEXT,
        description TEXT,
        impact TEXT,
        expectedClearance TEXT,
        lat FLOAT,
        lng FLOAT,
        created_at TIMESTAMP DEFAULT NOW()
      );
      CREATE TABLE IF NOT EXISTS zones (
        id BIGSERIAL PRIMARY KEY,
        name TEXT,
        coordinates JSONB,
        created_at TIMESTAMP DEFAULT NOW()
      );
      CREATE TABLE IF NOT EXISTS snapshots (
        id BIGSERIAL PRIMARY KEY,
        data JSONB,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log("✅ Database tables initialized");
  } catch (err) {
    console.error("❌ Error initializing tables:", err);
  }
}

export default pool;
