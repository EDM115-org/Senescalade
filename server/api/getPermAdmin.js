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
  const { user } = body

  try {
    if (!user) {
      return {
        status: 401,
        body: { error: "Utilisateur non connecté" }
      }
    }

    const query = "SELECT * FROM Inscription, Admin WHERE idInscription = idAdmin AND idAdmin = ?"

    const [ rows ] = await connection.execute(query, [ user.id ])

    if (rows.length > 0) {
      return {
        status: 200,
        body: rows,
      }
    } else {
      return {
        status: 404,
        body: { error: "L'utilisateur n'es pas admin" }
      }
    }
  } catch (err) {
    return {
      status: 500,
      body: { error: "Erreur durant la modification du mot de passe", message: err }
    }
  }
})
