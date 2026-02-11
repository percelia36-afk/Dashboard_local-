// Database configuration for PostgreSQL using node-postgres (pg)
// Adjust connection details as needed for your environment

const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DB_CONN,
  ssl:
    process.env.PGSSLMODE === "require"
      ? { rejectUnauthorized: false }
      : undefined,
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
};
