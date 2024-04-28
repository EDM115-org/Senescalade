import mysql from "mysql2/promise"
import { defineEventHandler, readBody } from "h3"

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

export default defineEventHandler(async (event) => {
  if (!connection) {
    return {
      status: 500,
      body: { error: "Database connection not available" }
    }
  }
  const body = await readBody(event)
  // add user to database
  const { mail, password } = body

  try {
    const [ rows ] = await connection.execute(`INSERT INTO Inscription(mail, password, isAdmin) VALUES ('${mail}', '${password}', 0)`)

    console.log(rows)

    return {
      status: 200,
      body: { success: "User added" }
    }
  } catch (err) {
    console.error(err)

    return {
      status: 500,
      body: { error: "Error adding user" }
    }
  }
})
