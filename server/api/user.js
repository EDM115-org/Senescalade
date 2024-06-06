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
      body: { error: "Database connection not available" },
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

  console.log("Received lInscription:", lInscription)

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
      body: { success: "Person added" },
    }
  } catch (err) {
    console.error("Error executing query:", err)

    return {
      status: 500,
      body: { error: `Error adding person, ${err}` },
    }
  }
})
