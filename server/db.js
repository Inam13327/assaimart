import mysql from "mysql2/promise";
import dotenv from "dotenv";
import path from "path";

// Load environment variables from .env file
// Adjust path if .env is in the root and we are running from server/
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

// Also try loading from parent directory if not found (in case running from server dir)
if (!process.env.DB_HOST) {
  dotenv.config({ path: path.resolve(process.cwd(), "..", ".env") });
}

const pool = mysql.createPool({
  host: process.env.DB_HOST || "srv2088.hstgr.io",
  user: process.env.DB_USER || "u670025273_assaimart",
  password: process.env.DB_PASSWORD || "Blazex123.",
  database: process.env.DB_NAME || "u670025273_assaimart",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;
