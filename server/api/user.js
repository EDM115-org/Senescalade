import mysql from "mysql2/promise"
import { defineEventHandler, readBody } from "h3"

let connection = null

try {
  connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  })
} catch {
  connection = null
}

export default defineEventHandler(async (event) => {
  if (!connection) {
    return {
      status: 500,
      body: { error: "Database connection not available" }
    }
  }
  const body = await readBody(event)
  const {
    action, nom, prenom, dateNaissance, sexe, nationalite, adresse, complementAdresse,
    codePostal, ville, pays, telephone, mobile, courriel2, personneNom, personnePrenom,
    personneTelephone, personneCourriel, assurance, optionSki,
    optionSlackline, optionTrail, optionVTT, optionAssurance, lInscription
  } = body

  try {
    const query = "INSERT INTO Personne(action, nom, prenom, dateNaissance, sexe, nationalite, adresse, complementAdresse, codePostal, ville, pays, telephone, mobile, courriel2, personneNom, personnePrenompersonneTelephone, personneCourriel, assurance, optionSki, optionSlackline, optionTrail, optionVTT, optionAssurance, lInscription) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"

    await connection.execute(query, [
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
      assurance,
      optionSki,
      optionSlackline,
      optionTrail,
      optionVTT,
      optionAssurance,
      lInscription
    ])

    return {
      status: 200,
      body: { success: "Person added" }
    }
  } catch (err) {
    return {
      status: 500,
      body: { error: `Error adding person, ${err}` }
    }
  }
})
