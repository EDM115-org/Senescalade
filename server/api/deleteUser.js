import mysql from "mysql2/promise"
import { defineEventHandler, readBody } from "h3"

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
    const body = await readBody(event)
    const { idInscription } = body

    const [ rows ] = await connection.execute("DELETE FROM Inscription WHERE idInscription = ?", [ idInscription ])

    return {
      status: 200,
      body: rows,
    }
  } catch (err) {
    return {
      status: 500,
      body: { error: "Erreur durant la suppression de la séance", message: err },
    }
  }
})
