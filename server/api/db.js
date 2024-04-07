import mysql from "mysql2/promise"

// Create a connection to the database
let connection = null
try {
  connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  })
} catch (err) {
  console.error(err)
  connection = null
}

// eslint-disable-next-line no-undef
export default defineEventHandler(async (event) => {
  if (!connection) {
    return {
      status: 500,
      body: { error: "Database connection not available" }
    }
  }
  // Get tables, and columns for all tables
  const returnData = {
    tables: [],
    rows: {}
  }
  try {
    const [rows] = await connection.execute("SHOW TABLES")
    returnData.tables = rows
    for (let i = 0; i < rows.length; i++) {
      const table = rows[i][`Tables_in_${connection.config.database}`]
      const [columns] = await connection.execute(`SHOW COLUMNS FROM ${table}`)
      returnData.rows[table] = columns
    }
  } catch (err) {
    console.error(err)
    return {
      status: 500,
      body: { error: "Error getting data" }
    }
  }
  return {
    status: 200,
    body: returnData
  }
})
