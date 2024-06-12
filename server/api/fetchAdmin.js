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
        SELECT i.idInscription, i.mail, 
               a.ReadListGrimpeur, a.ReadListSeance, a.ReadListAdmin, a.ReadListUtilisateur, 
               a.UpdateListGrimpeur, a.UpdateListSeance, a.UpdateListAdmin, a.UpdateListUtilisateur,
               a.DeleteListGrimpeur, a.DeleteListSeance, a.DeleteListAdmin, a.DeleteListUtilisateur
        FROM Inscription i
        LEFT JOIN Admin a ON i.idInscription = a.idAdmin
        WHERE i.isAdmin = 1
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
