import nodemailer from "nodemailer"
import mysql from "mysql2/promise"
import { createError, defineEventHandler, readBody } from "h3"

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

  if (event.node.req.method === "POST") {
    const body = await readBody(event)

    const { email } = body

    if (!email) {
      return {
        statusCode: 400,
        body: { error: "Le champ 'email' est requis" }
      }
    }

    try {
      const [ rows ] = await connection.execute(
        "SELECT idCompte FROM Compte WHERE mail = ?",
        [ email ]
      )

      if (rows.length === 0) {
        return {
          statusCode: 404,
          body: { error: "Aucun utilisateur trouvé avec cet email" }
        }
      }

      const mailOptions = {
        from: `"Senescalade" <${process.env.GMAIL_USER}>`,
        to: email,
        subject: "Senescalade : Séance disponible",
        text: "La séance pour laquelle vous êtes en file d'attente est maintenant disponible. Connectez-vous pour réserver votre place.",
        html: "<p>La séance pour laquelle vous êtes en file d'attente est maintenant disponible. Connectez-vous pour réserver votre place.</p>"
      }

      await transporter.sendMail(mailOptions)

      return {
        statusCode: 200,
        body: { success: "Email de séance envoyé avec succès" }
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi de l'email de séance:", error)

      return {
        statusCode: 500,
        body: { error: "Erreur lors de l'envoi de l'email de séance", message: error.message }
      }
    }
  } else {
    return {
      statusCode: 405,
      body: { error: "Méthode non autorisée" }
    }
  }
})
