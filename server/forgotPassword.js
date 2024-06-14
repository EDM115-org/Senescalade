import { defineEventHandler, readBody } from "h3"
import nodemailer from "nodemailer"

// Configuration de Nodemailer
const transporter = nodemailer.createTransport({
  host: "localhost",
  port: 1025,
  secure: false,
  auth: {
    user: "",
    pass: "",
  },
})

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  console.log("Requête reçue avec body:", body)

  const { email } = body

  if (!email) {
    console.log("Email non fourni dans la requête")

    return {
      statusCode: 400,
      body: { error: "Le champ 'email' est requis" },
    }
  }

  try {
    // Simulation de l'envoi d'email réussi sans interaction avec une base de données
    const resetLink = "http://localhost:3000/reset-password?token=abcd1234"

    console.log(`Lien de réinitialisation: ${resetLink}`)

    const mailOptions = {
      from: "\"Admin Team\" <admin@example.com>",
      to: email,
      subject: "Réinitialisation de votre mot de passe",
      text: `Pour réinitialiser votre mot de passe, veuillez cliquer sur le lien suivant : ${resetLink}`,
      html: `<p>Pour réinitialiser votre mot de passe, veuillez cliquer sur le lien suivant : <a href="${resetLink}">Réinitialiser le mot de passe</a></p>`
    }

    console.log("Envoi de l'email...")
    await transporter.sendMail(mailOptions)
    console.log("Email envoyé avec succès")

    return {
      statusCode: 200,
      body: { success: "Email de récupération envoyé avec succès" },
    }
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email de récupération:", error)

    return {
      statusCode: 500,
      body: { error: "Erreur lors de l'envoi de l'email de récupération", message: error.message },
    }
  }
})
