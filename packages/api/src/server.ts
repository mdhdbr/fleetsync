// server.ts
import express from "express";
import pool, { initDB } from "./db";

const app = express();
app.use(express.json());

const PORT = Number(process.env.PORT) || 3001;

// Example route
app.get("/", (req, res) => res.send("🚀 Fleet Sync API Running"));

// -------------------- START SERVER --------------------
async function startServer() {
  try {
    // Test PostgreSQL connection
    await pool.connect();
    console.log("✅ Connected to PostgreSQL");

    // Initialize tables
    await initDB();

    // Start Express server
    app.listen(PORT, () => {
      console.log(`🌐 Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
}

// Run the server
startServer();
