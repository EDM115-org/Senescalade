import mysql from "mysql2/promise"
import { defineEventHandler } from "h3"

let connection = null

try {
  connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  })
} catch {
  connection = null
}

export default defineEventHandler(async (event) => {
  if (!connection) {
    return {
      status: 500,
      body: { error: "Connexion à la base de données non disponible" },
    }
  }

  if (event.node.req.method === "GET") {
    try {
      const [ rows ] = await connection.execute(`
        SELECT COUNT(*) as adminCount FROM Admin
      `)

      return {
        status: 200,
        body: { adminCount: rows[0].adminCount },
      }
    } catch (err) {
      return {
        status: 500,
        body: { error: "Erreur durant la récupération du nombre d'administrateurs", message: err.message },
      }
    }
  } else {
    return {
      status: 405,
      body: { error: "Méthode non autorisée" },
    }
  }
})