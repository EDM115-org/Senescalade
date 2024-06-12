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
} catch (err) {
  console.error("Erreur de connexion à la base de données:", err)
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
      const { idInscription, ReadListGrimpeur, ReadListSeance, ReadListAdmin, ReadListUtilisateur, UpdateListGrimpeur, UpdateListSeance, UpdateListAdmin, UpdateListUtilisateur, DeleteListGrimpeur, DeleteListSeance, DeleteListAdmin, DeleteListUtilisateur } = body

      console.log(body)
      console.log(idInscription)
      console.log(ReadListGrimpeur)

      const [ rows ] = await connection.execute("UPDATE Admin SET ReadListGrimpeur = ?, ReadListSeance = ?, ReadListAdmin = ?, ReadListUtilisateur = ?, UpdateListGrimpeur = ?, UpdateListSeance = ?, UpdateListAdmin = ?, UpdateListUtilisateur = ?, DeleteListGrimpeur = ?, DeleteListSeance = ?, DeleteListAdmin = ?, DeleteListUtilisateur = ? WHERE idInscription = ?", [ ReadListGrimpeur, ReadListSeance, ReadListAdmin, ReadListUtilisateur, UpdateListGrimpeur, UpdateListSeance, UpdateListAdmin, UpdateListUtilisateur, DeleteListGrimpeur, DeleteListSeance, DeleteListAdmin, DeleteListUtilisateur, idInscription ])

      return {
        status: 200,
        body: rows,
      }
    } catch (err) {
      return {
        status: 500,
        body: { error: "Erreur durant la mise à jour des permissions", message: err },
      }
    }
  } else {
    return {
      status: 405,
      body: { error: "Méthode non autorisée" },
    }
  }
})
