import pool from "./db"
import nodemailer from "nodemailer"
import { createError, defineEventHandler, readBody } from "h3"

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

    connection.release()

    if (rows.length === 0) {
      throw createError({
        status: 404,
        message: "Aucun utilisateur trouvé avec cet email"
      })
    }

    const mailOptions = {
      from: `"Senescalade" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "Senescalade : Séance disponible",
      text: "La séance pour laquelle vous êtes en file d'attente est maintenant disponible. Connectez-vous pour réserver votre place.",
      html: "<p>La séance pour laquelle vous êtes en file d'attente est maintenant disponible. Connectez-vous pour réserver votre place.</p>"
    }

    try {
      await transporter.sendMail(mailOptions)

      return {
        statusCode: 200,
        body: { success: "Email de séance envoyé avec succès" }
      }
    } catch (error) {
      throw createError({
        status: 500,
        message: "Échec de l'envoi de l'email de séance",
        statusMessage: JSON.stringify(error)
      })
    }
  } else {
    return {
      statusCode: 405,
      body: { error: "Méthode non autorisée" }
    }
  }
})
