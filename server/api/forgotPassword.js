// Import des fonctions nécessaires depuis H3
import { defineEventHandler, readBody } from "h3"
import nodemailer from "nodemailer"
import mysql from "mysql2/promise"

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

// Configuration de la connexion MySQL
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

// Définition de l'événement handler avec H3
export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const { email } = body

  if (!email) {
    return {
      statusCode: 400,
      body: { error: "Le champ 'email' est requis" },
    }
  }

  // Vérifier si l'email existe dans la base de données
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

    // Email existe, générer le lien de réinitialisation
    const resetLink = "http://localhost:8000/reset-password?token=abcd1234"

    // Configurer les options d'email
    const mailOptions = {
      from: "\"Admin Team\" <admin@example.com>",
      to: email,
      subject: "Réinitialisation de votre mot de passe",
      text: `Pour réinitialiser votre mot de passe, veuillez cliquer sur le lien suivant : ${resetLink}`,
      html: `<p>Pour réinitialiser votre mot de passe, veuillez cliquer sur le lien suivant : <a href="${resetLink}">Réinitialiser le mot de passe</a></p>`
    }

    // Envoyer l'email
    await transporter.sendMail(mailOptions)

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
