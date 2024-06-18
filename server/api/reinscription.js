import mysql from "mysql2/promise"
import { defineEventHandler, readBody, getQuery } from "h3"

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
  const query = getQuery(event)
  const { type } = query

  if (event.node.req.method === "POST") {
    try {
      switch (type) {
        case "update":
          return await updateReinscription(body)
        case "open":
          return await openReinscription(body)
        case "clear":
          return await clearReinscription()
        default:
          return {
            status: 400,
            body: { error: "Type de comptage non pris en charge" },
          }
      }
    } catch (err) {
      return {
        status: 500,
        body: { error: err.message },
      }
    }
  } else {
    return {
      status: 405,
      body: { error: "Méthode non autorisée" },
    }
  }

  async function updateReinscription(body) {
    const { dateReinscriptionIsInscrit, dateReinscriptionEveryone, dateFinReinscription } = body

    // Validation des dates
    if (new Date(dateReinscriptionIsInscrit) >= new Date(dateReinscriptionEveryone)) {
      return {
        status: 400,
        body: { error: "La date de réinscription pour les inscrits doit être avant la date de réinscription pour tous." },
      }
    }

    const query = "UPDATE Reinscription SET dateReinscriptionIsInscrit = ?, dateReinscriptionEveryone = ?, dateFinReinscription = ?"
    const [ results ] = await connection.execute(query, [ dateReinscriptionIsInscrit, dateReinscriptionEveryone, dateFinReinscription ])

    if (results.affectedRows === 0) {
      return {
        status: 404,
        body: { error: "Aucun enregistrement trouvé" },
      }
    }

    return { status: 200, body: { message: "Enregistrement mis à jour" } }
  }

  async function openReinscription(body) {
    const { inscritionOpen } = body
    const query = "UPDATE Reinscription SET inscritionOpen = ?"
    const [ results ] = await connection.execute(query, [ inscritionOpen ])

    if (results.affectedRows === 0) {
      return {
        status: 404,
        body: { error: "Aucun enregistrement trouvé" },
      }
    }

    return { status: 200, body: { message: "Enregistrement mis à jour" } }
  }

  async function clearReinscription() {
    try {
      // Mettre à jour la colonne 'action' à 'R' pour tous les grimpeurs inscrits
      const updateQuery = `
        UPDATE Grimpeur
        SET action = 'R'
        WHERE idGrimpeur IN (
          SELECT idGrimpeur
          FROM GrimpeurSeance
        )
      `
      const [ updateResults ] = await connection.execute(updateQuery)

      if (updateResults.affectedRows === 0) {
        return {
          status: 404,
          body: { error: "Aucun grimpeur mis à jour" },
        }
      }

      // Maintenant, supprimer toutes les inscriptions dans GrimpeurSeance
      const deleteQuery = `
        DELETE FROM GrimpeurSeance
      `

      await connection.execute(deleteQuery)

      return { status: 200, body: { message: "Mise à jour des actions et suppression des inscriptions effectuées avec succès" } }
    } catch (err) {
      console.error("Erreur lors de la mise à jour des actions et de la suppression des inscriptions:", err)

      return {
        status: 500,
        body: { error: "Erreur lors de la mise à jour des actions et de la suppression des inscriptions" },
      }
    }
  }
})