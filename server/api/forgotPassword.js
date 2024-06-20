import pool from "./db"
import nodemailer from "nodemailer"
import { createError, defineEventHandler, readBody, getQuery } from "h3"

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS
  }
})

export default defineEventHandler(async (event) => {
  if (event.node.req.method === "POST") {
    const body = await readBody(event)
    const query = getQuery(event)
    const { type } = query

    switch (type) {
      case "mail": {
        const apiRequest1 = await handleMailRequest(body)

        return apiRequest1
      } case "code": {
        const apiRequest2 = await handleCodeRequest(body)

        return apiRequest2
      } case "password": {
        const apiRequest3 = await handlePasswordRequest(body)

        return apiRequest3
      } default:
        throw createError({
          status: 400,
          message: "Type d'entité non pris en charge"
        })
    }
  } else {
    throw createError({
      status: 405,
      message: "Méthode non autorisée"
    })
  }
})

async function handleMailRequest(body) {
  const { email } = body

  if (!email) {
    throw createError({
      status: 400,
      message: "Le champ 'email' est requis"
    })
  }

  const connection = await pool.getConnection()
  const [ rows ] = await connection.execute(
    "SELECT idCompte FROM Compte WHERE mail = ?",
    [ email ]
  )

  if (rows.length === 0) {
    connection.release()

    throw createError({
      status: 404,
      message: "Aucun utilisateur trouvé avec cet email"
    })
  }

  const code = generateRandomCode()

  try {
    await connection.execute("UPDATE Compte SET code = ? WHERE mail = ?", [
      code,
      email
    ])
  } catch (error) {
    connection.release()

    throw createError({
      status: 500,
      message: "Erreur lors de la mise à jour du code dans la base de données",
      statusMessage: JSON.stringify(error)
    })
  } finally {
    connection.release()
  }

  const mailOptions = {
    from: `"Senescalade" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: `Réinitialisation du mot de passe : ${code}`,
    text: `Votre code de vérification est : ${code}`,
    html: `<p>Votre code de vérification est : <strong>${code}</strong></p>`
  }

  try {
    await transporter.sendMail(mailOptions)

    return {
      statusCode: 200,
      body: { success: "Email de récupération envoyé avec succès" }
    }
  } catch (error) {
    throw createError({
      status: 500,
      message: "Erreur lors de l'envoi de l'email de récupération",
      statusMessage: JSON.stringify(error)
    })
  }
}

async function handleCodeRequest(body) {
  const { email, code } = body

  if (!email || !code) {
    throw createError({
      status: 400,
      message: "Les champs 'email' et 'code' sont requis"
    })
  }

  const connection = await pool.getConnection()
  const [ rows ] = await connection.execute(
    "SELECT idCompte, code FROM Compte WHERE mail = ?",
    [ email ]
  )

  if (rows.length === 0) {
    connection.release()

    throw createError({
      status: 404,
      message: "Aucun compte trouvé pour cet email"
    })
  }

  const dbCode = rows[0].code

  if (dbCode === "0") {
    connection.release()

    throw createError({
      status: 400,
      message: "Aucun code de vérification n'a été généré"
    })
  }

  if (dbCode !== code) {
    connection.release()

    throw createError({
      status: 404,
      message: "Code incorrect ou expiré"
    })
  }

  await connection.execute(
    "UPDATE Compte SET code = '0', mailIsVerified = true WHERE mail = ?",
    [ email ]
  )

  connection.release()

  return {
    statusCode: 200,
    body: { success: "Code vérifié avec succès, email vérifié" }
  }
}


async function handlePasswordRequest(body) {
  const { email, password } = body

  if (!email || !password) {
    throw createError({
      status: 400,
      message: "Les champs 'email' et 'password' sont requis"
    })
  }

  const connection = await pool.getConnection()

  try {
    await connection.execute(
      "UPDATE Compte SET password = ? WHERE mail = ?",
      [ password, email ]
    )

    return {
      statusCode: 200,
      body: { success: "Mot de passe réinitialisé avec succès" }
    }
  } catch (error) {
    throw createError({
      status: 500,
      message: "Erreur lors de la réinitialisation du mot de passe",
      statusMessage: JSON.stringify(error)
    })
  } finally {
    connection.release()
  }
}

function generateRandomCode() {
  const min = 100000
  const max = 999999

  return Math.floor(Math.random() * (max - min + 1)) + min
}
