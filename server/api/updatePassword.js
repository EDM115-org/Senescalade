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
      body: { error: "Connexion à la base de données non disponible" }
    }
  }

  const body = await readBody(event)
  const { oldPassword, newPassword, user } = body

  if (event.node.req.method === "POST") {
    try {
      if (!user) {
        return {
          status: 401,
          body: { error: "Utilisateur non connecté" }
        }
      }

      const query = "SELECT * FROM Compte WHERE idCompte = ?"

      const [ rows ] = await connection.execute(query, [ user.id ])

      if (rows.length > 0) {
        const userFromDB = rows[0]
        const passwordMatch = await bcrypt.compare(oldPassword, userFromDB.password)

        if (passwordMatch) {
          // Mettre à jour le mot de passe dans la base de données
          const updateQuery = "UPDATE Compte SET password = ? WHERE idCompte = ?"

          await connection.execute(updateQuery, [ newPassword, userFromDB.idCompte ])

          return {
            status: 200,
            body: { success: "Mot de passe mis à jour" }
          }
        } else {
          return {
            status: 401,
            body: { error: "Ancien mot de passe invalide" }
          }
        }
      } else {
        return {
          status: 404,
          body: { error: "L'utilisateur n'existe pas" }
        }
      }
    } catch (err) {
      return {
        status: 500,
        body: { error: "Erreur durant la modification du mot de passe", message: err }
      }
    }
  } else {
    return {
      status: 405,
      body: { error: "Méthode non autorisée" }
    }
  }
})
