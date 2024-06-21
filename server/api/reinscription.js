import pool from "./db"
import nodemailer from "nodemailer"

import { createError, defineEventHandler, getQuery, readBody } from "h3"

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS
  }
})

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const query = getQuery(event)
  const { type } = query

  if (event.node.req.method === "POST") {
    switch (type) {
      case "update": {
        const apiRequest1 = await updateReinscription(body)

        return apiRequest1
      } case "open": {
        const apiRequest2 = await openReinscription(body)

        return apiRequest2
      } case "clear": {
        const apiRequest3 = await clearReinscription()

        return apiRequest3
      } default:
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

  const connection = await pool.getConnection()
  const query = "UPDATE Reinscription SET dateReinscriptionIsInscrit = ?, dateReinscriptionEveryone = ?, dateFinReinscription = ?"
  const [ results ] = await connection.execute(query, [ dateReinscriptionIsInscrit, dateReinscriptionEveryone, dateFinReinscription ])

  connection.release()

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
  const connection = await pool.getConnection()
  const query = "UPDATE Reinscription SET inscriptionOpen = ?"
  const [ results ] = await connection.execute(query, [ inscriptionOpen ])

  connection.release()

  if (results.affectedRows === 0) {
    throw createError({
      status: 404,
      message: "Aucun enregistrement trouvé"
    })
  }

  return { status: 200, body: { message: "Enregistrement mis à jour" } }
}

async function clearReinscription() {
  const connection = await pool.getConnection()
  const updateQuery = `
    UPDATE Grimpeur
    SET action = 'R'
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

  connection.release()

  for (const row of rows) {
    const mailOptions = {
      from: `"Senescalade" <${process.env.GMAIL_USER}>`,
      to: row.mail,
      subject: "Senescalade - Réinscription ouverte",
      text: "Bonjour,\n\nLa réinscription a été ouverte. Vous pouvez dès maintenant choisir un nouveau créneau pour votre/vos grimpeurs\n\nCordialement,\nLe club",
      html: "Bonjour,<br><br>La réinscription a été ouverte. Vous pouvez dès maintenant choisir un nouveau créneau pour votre/vos grimpeurs<br><br>Cordialement,<br>Senescalade"
    }

    try {
      await transporter.sendMail(mailOptions)
    } catch (error) {
      throw createError({
        status: 500,
        message: "Erreur lors de l'envoi de l'email de réinscription",
        statusMessage: JSON.stringify(error)
      })
    }
  }

  return { status: 200, body: { message: "Mise à jour des actions et suppression des inscriptions effectuées avec succès" } }
}
