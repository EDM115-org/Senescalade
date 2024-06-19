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
  const { mail, password } = body

  if (event.node.req.method === "POST") {
    try {
      const query = "INSERT INTO Compte(mail, password) VALUES (?, ?)"

      await connection.execute(query, [ mail, password ])

      return {
        status: 200,
        body: { success: "Utilisateur inscrit" }
      }
    } catch (err) {
      throw createError({
        status: 500,
        message: "Erreur durant l'inscription de l'utilisateur",
        statusMessage: JSON.stringify(err)
      })
    }
  } else {
    throw createError({
      status: 405,
      message: "Méthode non autorisée"
    })
  }
})
