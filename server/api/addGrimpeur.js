import mysql from "mysql2/promise"
import { defineEventHandler, readBody } from "h3"

let connection = null

try {
  connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  })
} catch {
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
  const {
    action,
    nom,
    prenom,
    dateNaissance,
    sexe,
    nationalite,
    adresse,
    complementAdresse,
    codePostal,
    ville,
    pays,
    telephone,
    mobile,
    courriel2,
    personneNom,
    personnePrenom,
    personneTelephone,
    personneCourriel,
    numLicence,
    typeLicence,
    assurance,
    optionSki,
    optionSlackline,
    optionTrail,
    optionVTT,
    optionAssurance,
    lInscription,
  } = body

  const params = [
    action,
    nom,
    prenom,
    dateNaissance,
    sexe,
    nationalite,
    adresse,
    complementAdresse,
    codePostal,
    ville,
    pays,
    telephone,
    mobile,
    courriel2,
    personneNom,
    personnePrenom,
    personneTelephone,
    personneCourriel,
    numLicence,
    typeLicence,
    assurance,
    optionSki,
    optionSlackline,
    optionTrail,
    optionVTT,
    optionAssurance,
    lInscription,
  ].map((param) => (param !== undefined ? param : null))


  if (event.node.req.method === "POST") {
    try {
      const query = `
        INSERT INTO Personne (
          action, nom, prenom, dateNaissance, sexe, nationalite, adresse, complementAdresse,
          codePostal, ville, pays, telephone, mobile, courriel2, personneNom, personnePrenom,
          personneTelephone, personneCourriel, numLicence, typeLicence, assurance, optionSki,
          optionSlackline, optionTrail, optionVTT, optionAssurance, lInscription
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `

      await connection.execute(query, params)

      return {
        status: 200,
        body: { success: "Grimpeur ajouté" },
      }
    } catch (err) {
      return {
        status: 500,
        body: { error: "Erreur durant l'ajout d'un grimpeur", message: err },
      }
    }
  } else {
    return {
      status: 405,
      body: { error: "Méthode non autorisée" },
    }
  }
})
