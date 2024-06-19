import mysql from "mysql2/promise"
import nodemailer from "nodemailer"
import { createError, defineEventHandler, readBody, getQuery } from "h3"

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS
  }
})

let connection = null

try {
  connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  })
} catch (err) {
  console.error("Échec de connexion à la base de données : ", err)
  connection = null
}

export default defineEventHandler(async (event) => {
  if (!connection) {
    throw createError({
      status: 500,
      message: "Connexion à la base de données non disponible"
    })
  }

  const body = await readBody(event)
  const query = getQuery(event)
  const { type } = query

  if (event.node.req.method === "POST") {
    switch (type) {
      case "update":
        return await updateReinscription(body)
      case "open":
        return await openReinscription(body)
      case "clear":
        return await clearReinscription()
      default:
        throw createError({
          status: 400,
          message: "Type de réinscription non pris en charge"
        })
    }
  } else {
    throw createError({
      status: 405,
      message: "Méthode non autorisée"
    })
  }
})

async function updateReinscription(body) {
  const { dateReinscriptionIsInscrit, dateReinscriptionEveryone, dateFinReinscription } = body

  if (new Date(dateReinscriptionIsInscrit) >= new Date(dateReinscriptionEveryone)) {
    throw createError({
      status: 400,
      message: "La date de réinscription pour les inscrits doit être avant la date de réinscription pour tous."
    })
  }

  const query = "UPDATE Reinscription SET dateReinscriptionIsInscrit = ?, dateReinscriptionEveryone = ?, dateFinReinscription = ?"
  const [ results ] = await connection.execute(query, [ dateReinscriptionIsInscrit, dateReinscriptionEveryone, dateFinReinscription ])

  if (results.affectedRows === 0) {
    throw createError({
      status: 404,
      message: "Aucun enregistrement trouvé"
    })
  }

  return { status: 200, body: { message: "Enregistrement mis à jour" } }
}

async function openReinscription(body) {
  const { inscriptionOpen } = body
  const query = "UPDATE Reinscription SET inscriptionOpen = ?"
  const [ results ] = await connection.execute(query, [ inscriptionOpen ])

  if (results.affectedRows === 0) {
    throw createError({
      status: 404,
      message: "Aucun enregistrement trouvé"
    })
  }

  return { status: 200, body: { message: "Enregistrement mis à jour" } }
}

async function clearReinscription() {
  const updateQuery = `
    UPDATE Grimpeur
    SET action = 'R'
    WHERE idGrimpeur IN (
      SELECT idGrimpeur
      FROM GrimpeurSeance
    )
  `

  await connection.execute(updateQuery)

  const deleteQuery = `
    DELETE FROM GrimpeurSeance
  `

  await connection.execute(deleteQuery)

  const seanceQuery = `
    UPDATE Seance
    SET nbPlacesRestantes = nbPlaces
  `

  await connection.execute(seanceQuery)

  const grimpeurQuery = `
    UPDATE Grimpeur
    SET aPaye = 0, isExported = 0
  `

  await connection.execute(grimpeurQuery)

  // récupérer tout les mails des compte des grimpeurs des gens en R
  const selectQuery = `
    SELECT mail
    FROM Compte
    WHERE idCompte IN (
      SELECT fkCompte
      FROM Grimpeur
      WHERE action = 'R'
    )
  `

  const [ rows ] = await connection.execute(selectQuery)

  console.log(rows[0].mail)
  console.log(rows[1].mail)

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: rows.map((row) => row.mail).join(", "),
    subject: "Réinscription",
    text: "Bonjour,\n\nLa réinscription a été ouverte.\n\nCordialement,\n\nLe club",
    html: "Bonjour,<br><br>La réinscription a été ouverte.<br><br>Cordialement,<br><br>Le club"
  }

  try {
    await transporter.sendMail(mailOptions)
  } catch (error) {
    throw createError({
      status: 500,
      message: "Erreur lors de l'envoi de l'email de réinscription",
      statusMessage: JSON.stringify(err)
    })
  }

  return { status: 200, body: { message: "Mise à jour des actions et suppression des inscriptions effectuées avec succès" } }
}
