/*
 * Reusable MySQL connection pool for making queries throughout the rest of
 * the app.
 */

const { createPool } = require('mysql');

const mysqlPool = createPool({
  connectionLimit: 10,
  host: process.env.MYSQL_HOST || "127.0.0.1",
  port: process.env.MYSQL_PORT || 3306,
  database: process.env.MYSQL_DATABASE||"cs493final",
  user: process.env.MYSQL_USER||"cs493final",
  password: process.env.MYSQL_PASSWORD||"cs493final"
});

module.exports = mysqlPool;
