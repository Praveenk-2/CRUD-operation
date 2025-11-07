// MySQL connection pool create pannurathu
import mysql from 'mysql2/promise';

// Connection pool-oda benefits:
// - Multiple queries parallel-a run aagum
// - Connection reuse panna performance improve aagum
// - Automatic connection management

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',      // Database host
  user: process.env.DB_USER || 'root',           // MySQL username
  password: process.env.DB_PASSWORD,              // MySQL password
  database: process.env.DB_NAME,                  // Database name
  port: process.env.DB_PORT || 3306,             // MySQL port (default: 3306)
  waitForConnections: true,                       // Queue full-a irundhaa wait pannumaa?
  connectionLimit: 10,                            // Maximum 10 connections allow
  queueLimit: 0                                   // Queue limit illa (unlimited wait)
});

// Connection test panna function
export async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Database connected successfully!');
    connection.release(); // Connection-a release pannurathu (important!)
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  }
}

// Pool-a export pannurathu (ellaa files layum use panna)
export default pool;