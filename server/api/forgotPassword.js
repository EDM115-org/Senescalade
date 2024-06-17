import { defineEventHandler, readBody, getQuery } from "h3"
import nodemailer from "nodemailer"
import mysql from "mysql2/promise"

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
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
  if (!connection) {
    return {
      statusCode: 500,
      body: { error: "Connexion à la base de données non disponible" },
    }
  }

  const body = await readBody(event)
  const query = getQuery(event)
  const { type } = query

  try {
    switch (type) {
      case "mail":
        return await handleMailRequest(body)
      case "code":
        return await handleCodeRequest(body)
      case "password":
        return await handlePasswordRequest(body)
      default:
        return {
          statusCode: 400,
          body: { error: "Type de requête non pris en charge" },
        }
    }
  } catch (err) {
    return {
      statusCode: 500,
      body: { error: "Erreur durant la requête", message: err.message },
    }
  }
})

async function handleMailRequest(body) {
  const { email } = body

  if (!email) {
    return {
      statusCode: 400,
      body: { error: "Le champ 'email' est requis" },
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
        body: { error: "Aucun utilisateur trouvé avec cet email" },
      }
    }

    const code = generateRandomCode()

    try {
      await connection.execute("UPDATE Compte SET code = ? WHERE mail = ?", [
        code,
        email,
      ])
    } catch (error) {
      console.error(
        "Erreur lors de la mise à jour du code dans la base de données:",
        error
      )

      return {
        statusCode: 500,
        body: { error: "Erreur lors de l'envoi de l'email de récupération" },
      }
    }

    const mailOptions = {
      from: `"Senescalade" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: `Réinitialisation du mot de passe : ${code}`,
      text: `Votre code de vérification est : ${code}`,
      html: `<p>Votre code de vérification est : <strong>${code}</strong></p>`,
    }

    try {
      await transporter.sendMail(mailOptions)

      return {
        statusCode: 200,
        body: { success: "Email de récupération envoyé avec succès" },
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi de l'email de récupération:", error)

      return {
        statusCode: 500,
        body: { error: "Erreur lors de l'envoi de l'email de récupération" },
      }
    }
  } catch (error) {
    console.error("Erreur lors de la vérification de l'email dans la base de données:", error)

    return {
      statusCode: 500,
      body: { error: "Erreur lors de la vérification de l'email dans la base de données" },
    }
  }
}

async function handleCodeRequest(body) {
  const { email, code } = body

  if (!email || !code) {
    return {
      statusCode: 400,
      body: { error: "Les champs 'email' et 'code' sont requis" },
    }
  }

  try {
    const [ rows ] = await connection.execute(
      "SELECT idCompte FROM Compte WHERE mail = ? AND code = ?",
      [ email, code ]
    )

    if (rows.length === 0) {
      return {
        statusCode: 404,
        body: { error: "Code incorrect ou expiré" },
      }
    }

    await connection.execute(
      "UPDATE Compte SET code = '0' WHERE mail = ?",
      [ email ]
    )

    return {
      statusCode: 200,
      body: { success: "Code vérifié avec succès" },
    }
  } catch (error) {
    console.error("Erreur lors de la vérification du code:", error)

    return {
      statusCode: 500,
      body: { error: "Erreur lors de la vérification du code" },
    }
  }
}

async function handlePasswordRequest(body) {
  const { email, password } = body

  if (!email || !password) {
    return {
      statusCode: 400,
      body: { error: "Les champs 'email' et 'password' sont requis" },
    }
  }

  try {
    await connection.execute(
      "UPDATE Compte SET password = ? WHERE mail = ?",
      [ password, email ]
    )

    return {
      statusCode: 200,
      body: { success: "Mot de passe réinitialisé avec succès" },
    }
  } catch (error) {
    console.error("Erreur lors de la réinitialisation du mot de passe:", error)

    return {
      statusCode: 500,
      body: { error: "Erreur lors de la réinitialisation du mot de passe" },
    }
  }
}

function generateRandomCode() {
  const min = 100000
  const max = 999999

  return Math.floor(Math.random() * (max - min + 1)) + min
}
