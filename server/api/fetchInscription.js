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
      body: { error: "Connexion à la base de données non disponible", event },
    }
  }

  try {
    const [ rows ] = await connection.execute("SELECT * FROM Inscription WHERE isAdmin = 0")

    return {
      status: 200,
      body: rows,
    }
  } catch (err) {
    return {
      status: 500,
      body: { error: "Erreur durant la récupération des grimpeurs", message: err },
    }
  }
})
