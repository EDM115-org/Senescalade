import mysql from "mysql2/promise"
import { defineEventHandler } from "h3"

let connection = null

try {
  connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  })
} catch {
  connection = null
}

export default defineEventHandler(async (event) => {
  if (!connection) {
    return {
      status: 500,
      body: { error: "Database connection not available" },
    }
  }

  console.log(event)

  try {
    const [ rows ] = await connection.execute("SELECT * FROM Personne")

    return {
      status: 200,
      body: rows,
    }
  } catch (err) {
    console.error("Error executing query:", err)

    return {
      status: 500,
      body: { error: `Error fetching persons, ${err}` },
    }
  }
})
