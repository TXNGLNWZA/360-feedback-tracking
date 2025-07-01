const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // ssl: { rejectUnauthorized: false } // เปิดเฉพาะถ้าใช้ PostgreSQL ฟรีที่ต้องการ ssl เช่น Render Database หรือ ElephantSQL
});

module.exports = pool;
