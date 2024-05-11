import mysql from "mysql2/promise"
import { defineEventHandler, readBody } from "h3"

let connection = null

try {
  connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  })
} catch {
  connection = null
}

export default defineEventHandler(async (event) => {
  if (!connection) {
    return {
      status: 500,
      body: { error: "Database connection not available" }
    }
  }
  const body = await readBody(event)
  const { mail, password } = body

  try {
    const query = "INSERT INTO Inscription(mail, password, isAdmin) VALUES (?, ?, 0)"

    await connection.execute(query, [ mail, password ])

    return {
      status: 200,
      body: { success: "User added" }
    }
  } catch (err) {
    return {
      status: 500,
      body: { error: `Error adding user, ${err}` }
    }
  }
})
