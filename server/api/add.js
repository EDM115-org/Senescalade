import mysql from "mysql2/promise"
import { defineEventHandler, readBody, getQuery } from "h3"

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
      status: 500,
      body: { error: "Connexion à la base de données non disponible" },
    }
  }

  const query = getQuery(event)
  const { type } = query

  if (event.node.req.method === "POST") {
    const body = await readBody(event)

    try {
      switch (type) {
        case "admin":
          return await addAdmin(body)
        case "grimpeur":
          return await addGrimpeur(body)
        case "seance":
          return await addSeance(body)
        default:
          return {
            status: 400,
            body: { error: "Type d'entité non pris en charge" },
          }
      }
    } catch (err) {
      return {
        status: 500,
        body: { error: "Erreur durant l'ajout", message: err.message },
      }
    }
  } else {
    return {
      status: 405,
      body: { error: "Méthode non autorisée" },
    }
  }
})

async function addAdmin(body) {
  const {
    mail,
    password,
    ReadListGrimpeur,
    ReadListSeance,
    ReadListAdmin,
    ReadListUtilisateur,
    UpdateListGrimpeur,
    UpdateListSeance,
    UpdateListAdmin,
    UpdateListUtilisateur,
    DeleteListGrimpeur,
    DeleteListSeance,
    DeleteListAdmin,
    DeleteListUtilisateur,
  } = body

  try {
    await connection.beginTransaction()

    const [ compteResult ] = await connection.execute(
      "INSERT INTO Compte (mail, password) VALUES (?, ?)",
      [ mail, password ]
    )

    const idCompte = compteResult.insertId

    await connection.execute(
      `INSERT INTO Admin (
        idAdmin, ReadListGrimpeur, ReadListSeance, ReadListAdmin, ReadListUtilisateur,
        UpdateListGrimpeur, UpdateListSeance, UpdateListAdmin, UpdateListUtilisateur,
        DeleteListGrimpeur, DeleteListSeance, DeleteListAdmin, DeleteListUtilisateur
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        idCompte,
        ReadListGrimpeur,
        ReadListSeance,
        ReadListAdmin,
        ReadListUtilisateur,
        UpdateListGrimpeur,
        UpdateListSeance,
        UpdateListAdmin,
        UpdateListUtilisateur,
        DeleteListGrimpeur,
        DeleteListSeance,
        DeleteListAdmin,
        DeleteListUtilisateur
      ]
    )

    await connection.commit()

    return {
      status: 200,
      body: { success: "Admin ajouté avec succès" },
    }
  } catch (err) {
    await connection.rollback()

    throw err
  }
}

async function addGrimpeur(body) {
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
    optionProtectionAgression,
    fkCompte,
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
    optionProtectionAgression,
    fkCompte,
  ].map((param) => (param !== undefined ? param : null))

  try {
    await connection.beginTransaction()

    const query = `
      INSERT INTO Grimpeur (
        action, nom, prenom, dateNaissance, sexe, nationalite, adresse, complementAdresse,
        codePostal, ville, pays, telephone, mobile, courriel2, personneNom, personnePrenom,
        personneTelephone, personneCourriel, numLicence, typeLicence, assurance, optionSki,
        optionSlackline, optionTrail, optionVTT, optionAssurance, optionProtectionAgression, fkCompte
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `

    await connection.execute(query, params)

    await connection.commit()

    return {
      status: 200,
      body: { success: "Grimpeur ajouté" },
    }
  } catch (err) {
    await connection.rollback()

    throw err
  }
}

async function addSeance(body) {
  const { jour, heureDebutSeance, heureFinSeance, typeSeance, niveau, nbPlaces, nbPlacesRestantes, professeur } = body

  try {
    await connection.beginTransaction()

    const [ rows ] = await connection.execute(
      "INSERT INTO Seance(jour, heureDebutSeance, heureFinSeance, typeSeance, niveau, nbPlaces, nbPlacesRestantes, professeur) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [ jour, heureDebutSeance, heureFinSeance, typeSeance, niveau, nbPlaces, nbPlacesRestantes, professeur ]
    )

    await connection.commit()

    return {
      status: 200,
      body: rows,
    }
  } catch (err) {
    await connection.rollback()

    throw err
  }
}
