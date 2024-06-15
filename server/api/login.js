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
  const { mail, password, stayConnected } = body

  if (event.node.req.method === "POST") {
    try {
      const query = "SELECT * FROM Compte WHERE mail = ?"

      const [ rows ] = await connection.execute(query, [ mail ])

      if (rows.length > 0) {
        const user = rows[0]
        const passwordMatch = await bcrypt.compare(password, user.password)

        if (passwordMatch) {
          return {
            status: 200,
            body: { success: "Utilisateur connecté", user: { id: user.idCompte, mail: user.mail, isAdmin: user.isAdmin }, stayConnected }
          }
        } else {
          return {
            status: 401,
            body: { error: "Mot de passe invalide" }
          }
        }
      } else {
        return {
          status: 401,
          body: { error: "L'utilisateur n'existe pas" }
        }
      }
    } catch (err) {
      return {
        status: 500,
        body: { error: "Erreur durant la connexion", message: err }
      }
    }
  } else {
    return {
      status: 405,
      body: { error: "Méthode non autorisée" }
    }
  }
})
