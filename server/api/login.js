import bcrypt from "bcryptjs"
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
    const query = "SELECT * FROM Inscription WHERE mail = ?"

    const [ rows ] = await connection.execute(query, [ mail ])

    if (rows.length > 0) {
      const user = rows[0]
      const passwordMatch = await bcrypt.compare(password, user.password)

      if (passwordMatch) {
        return {
          status: 200,
          body: { success: "User logged in", user: { id: user.idInscription, mail: user.mail, isAdmin: user.isAdmin } }
        }
      } else {
        return {
          status: 401,
          body: { error: "Invalid password" }
        }
      }
    } else {
      return {
        status: 401,
        body: { error: "User not found" }
      }
    }
  } catch (err) {
    return {
      status: 500,
      body: { error: `Error logging in, ${err}` }
    }
  }
})

