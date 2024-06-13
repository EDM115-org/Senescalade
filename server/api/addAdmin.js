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
  console.error("Failed to connect to the database:", err)
  connection = null
}

export default defineEventHandler(async (event) => {
  if (!connection) {
    return {
      status: 500,
      body: { error: "Connexion à la base de données non disponible" },
    }
  }

  const body = await readBody(event)
  const {
    mail,
    password,
    isAdmin,
    ReadListGrimpeur,
    ReadListSeance,
    ReadListAdmin,
    ReadListUtilisateur,
    UpdateListGrimpeur,
    UpdateListSeance,
    UpdateListAdmin,
    UpdateListUtilisateur,
    DeleteListGrimpeur,
    DeleteListSeance,
    DeleteListAdmin,
    DeleteListUtilisateur,
  } = body

  if (event.node.req.method === "POST") {
    try {
      // Commencer une transaction
      await connection.beginTransaction()

      // Insérer dans la table Inscription
      const [ inscriptionResult ] = await connection.execute(
        "INSERT INTO Inscription (mail, password, isAdmin) VALUES (?, ?, ?)",
        [ mail, password, isAdmin ]
      )

      const idInscription = inscriptionResult.insertId

      // Insérer dans la table Admin
      await connection.execute(
        `INSERT INTO Admin (
          idAdmin, ReadListGrimpeur, ReadListSeance, ReadListAdmin, ReadListUtilisateur,
          UpdateListGrimpeur, UpdateListSeance, UpdateListAdmin, UpdateListUtilisateur,
          DeleteListGrimpeur, DeleteListSeance, DeleteListAdmin, DeleteListUtilisateur
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          idInscription,
          ReadListGrimpeur,
          ReadListSeance,
          ReadListAdmin,
          ReadListUtilisateur,
          UpdateListGrimpeur,
          UpdateListSeance,
          UpdateListAdmin,
          UpdateListUtilisateur,
          DeleteListGrimpeur,
          DeleteListSeance,
          DeleteListAdmin,
          DeleteListUtilisateur
        ]
      )

      // Confirmer la transaction
      await connection.commit()

      return {
        status: 200,
        body: { success: "Admin ajouté avec succès" },
      }
    } catch (err) {
      // Annuler la transaction en cas d'erreur
      await connection.rollback()

      return {
        status: 500,
        body: { error: "Erreur durant l'ajout de l'admin", message: err.message },
      }
    }
  } else {
    return {
      status: 405,
      body: { error: "Méthode non autorisée" },
    }
  }
})
