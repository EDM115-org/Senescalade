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

  if (event.node.req.method === "GET") {
    try {
      const [ rows ] = await connection.execute(`
        SELECT c.idCompte, c.mail, a.ReadListGrimpeur, a.ReadListSeance, a.ReadListAdmin, a.ReadListUtilisateur, a.UpdateListGrimpeur, a.UpdateListSeance, a.UpdateListAdmin, a.UpdateListUtilisateur, a.DeleteListGrimpeur, a.DeleteListSeance, a.DeleteListAdmin, a.DeleteListUtilisateur
        FROM Compte c
        LEFT JOIN Admin a ON c.idCompte = a.idAdmin
        WHERE a.idAdmin IS NOT NULL
      `)

      return {
        status: 200,
        body: rows,
      }
    } catch (err) {
      return {
        status: 500,
        body: { error: "Erreur durant la récupération des administrateurs", message: err.message },
      }
    }
  } else {
    return {
      status: 405,
      body: { error: "Méthode non autorisée" },
    }
  }
})
