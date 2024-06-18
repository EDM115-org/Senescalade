import bcrypt from "bcryptjs"
import mysql from "mysql2/promise"

import { createError, defineEventHandler, readBody } from "h3"

let connection = null

try {
  connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  })
} catch (err) {
  console.error("Échec de connexion à la base de données : ", err)
  connection = null
}

export default defineEventHandler(async (event) => {
  if (!connection) {
    throw createError({
      status: 500,
      message: "Connexion à la base de données non disponible"
    })
  }
  const body = await readBody(event)
  const { mail, password, stayConnected } = body

  if (event.node.req.method === "POST") {
    const query = "SELECT * FROM Compte WHERE mail = ?"

    const [ rows ] = await connection.execute(query, [ mail ])

    if (rows.length > 0) {
      const user = rows[0]
      const passwordMatch = await bcrypt.compare(password, user.password)

      if (passwordMatch) {
        const adminQuery = "SELECT * FROM Admin WHERE idAdmin = ?"
        const [ adminRows ] = await connection.execute(adminQuery, [ user.idCompte ])

        const isAdmin = adminRows.length > 0

        return {
          status: 200,
          body: { success: "Utilisateur connecté", user: { id: user.idCompte, mail: user.mail, isAdmin }, stayConnected }
        }
      } else {
        throw createError({
          status: 401,
          message: "Mot de passe invalide"
        })
      }
    } else {
      throw createError({
        status: 401,
        message: "L'utilisateur n'existe pas"
      })
    }
  } else {
    throw createError({
      status: 405,
      message: "Méthode non autorisée"
    })
  }
})
