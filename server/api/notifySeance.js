import nodemailer from "nodemailer"
import mysql from "mysql2/promise"
import { defineEventHandler, readBody } from "h3"

const transporter = nodemailer.createTransport({
  host: "maildev",
  port: 1025,
  secure: false,
  auth: {
    user: "",
    pass: "",
  },
})

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
  const body = await readBody(event)

  const { email } = body

  if (!email) {
    return {
      statusCode: 400,
      body: { error: "Le champ 'email' est requis" },
    }
  }

  try {
    if (!connection) {
      throw new Error("Connexion à la base de données non disponible")
    }

    const [ rows ] = await connection.execute(
      "SELECT idCompte FROM Compte WHERE mail = ?",
      [ email ]
    )

    if (rows.length === 0) {
      return {
        statusCode: 404,
        body: { error: "Aucun utilisateur trouvé avec cet email" },
      }
    }

    const mailOptions = {
      from: "\"Admin Team\" <admin@example.com>",
      to: email,
      subject: "Senescalade - Séance disponible",
      text: "La séance pour laquelle vous êtes en file d'attente est maintenant disponible. Connectez-vous pour réserver votre place.",
      html: "<p>La séance pour laquelle vous êtes en file d'attente est maintenant disponible. Connectez-vous pour réserver votre place.</p>"
    }

    await transporter.sendMail(mailOptions)

    return {
      statusCode: 200,
      body: { success: "Email de séance envoyé avec succès" },
    }
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email de séance:", error)

    return {
      statusCode: 500,
      body: { error: "Erreur lors de l'envoi de l'email de séance", message: error.message },
    }
  }
})
