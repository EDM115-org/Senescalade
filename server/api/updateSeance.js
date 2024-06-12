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

  if (event.node.req.method === "POST") {
    try {
      const body = await readBody(event)
      const { idSeance, jour, heureDebutSeance, heureFinSeance, typeSeance, niveau, nbPlaces, nbPlacesRestantes, professeur } = body

      const [ rows ] = await connection.execute("UPDATE Seance SET jour = ?, heureDebutSeance = ?, heureFinSeance = ?, typeSeance = ?, niveau = ?, nbPlaces = ?, nbPlacesRestantes = ?, professeur = ? WHERE idSeance = ?", [ jour, heureDebutSeance, heureFinSeance, typeSeance, niveau, nbPlaces, nbPlacesRestantes, professeur, idSeance ])

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
  } else {
    return {
      status: 405,
      body: { error: "Méthode non autorisée" },
    }
  }
})
