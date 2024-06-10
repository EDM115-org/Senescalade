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
  const { oldPassword, newPassword, user } = body

  try {
    if (!user) {
      return {
        status: 401,
        body: { error: "User not logged in" }
      }
    }

    const query = "SELECT * FROM Inscription WHERE idInscription = ?"

    const [ rows ] = await connection.execute(query, [ user.idInscription ])

    if (rows.length > 0) {
      const userFromDB = rows[0]
      const passwordMatch = await bcrypt.compare(oldPassword, userFromDB.password)

      if (passwordMatch) {
        // Générer un nouveau sel et hasher le nouveau mot de passe
        const salt = await bcrypt.genSalt(10)
        const hashedNewPassword = await bcrypt.hash(newPassword, salt)

        // Mettre à jour le mot de passe dans la base de données
        const updateQuery = "UPDATE Inscription SET password = ? WHERE idInscription = ?"

        await connection.execute(updateQuery, [ hashedNewPassword, userFromDB.idInscription ])

        return {
          status: 200,
          body: { success: "Password updated successfully" }
        }
      } else {
        return {
          status: 401,
          body: { error: "Invalid old password" }
        }
      }
    } else {
      return {
        status: 404,
        body: { error: "User not found" }
      }
    }
  } catch (err) {
    return {
      status: 500,
      body: { error: `Error updating password: ${err.message}` }
    }
  }
})
