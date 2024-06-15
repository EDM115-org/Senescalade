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
      return {
        status: 500,
        body: { error: "Erreur durant l'inscription de l'utilisateur", message: err }
      }
    }
  } else {
    return {
      status: 405,
      body: { error: "Méthode non autorisée" }
    }
  }
})
