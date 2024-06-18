import mysql from "mysql2/promise"
import { createError, defineEventHandler, readBody, getQuery } from "h3"

let connection = null

try {
  connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
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

  const query = getQuery(event)
  const { type } = query

  if (event.node.req.method === "POST") {
    const body = await readBody(event)

    switch (type) {
      case "admin":
        return await addAdmin(body)
      case "grimpeur":
        return await addGrimpeur(body)
      case "seance":
        return await addSeance(body)
      default:
        throw createError({
          status: 400,
          message: "Type d'entité non pris en charge"
        })
    }
  } else {
    throw createError({
      status: 405,
      message: "Méthode non autorisée"
    })
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
      body: { success: "Admin ajouté avec succès" }
    }
  } catch (err) {
    await connection.rollback()

    throw createError({
      status: 500,
      message: "Erreur durant l'ajout de l'admin",
      statusMessage: err
    })
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
    idSeance
  } = body
  let isFileDAttente = body.isFileDAttente

  if (isFileDAttente === undefined || isFileDAttente === null) {
    isFileDAttente = false
  }

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
    fkCompte
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

    const [ grimpeurResult ] = await connection.execute(query, params)
    const idGrimpeur = grimpeurResult.insertId

    if (isFileDAttente === false) {
      const [ seanceResult ] = await connection.execute(
        "SELECT nbPlacesRestantes FROM Seance WHERE idSeance = ?",
        [ idSeance ]
      )

      const nbPlacesRestantes = seanceResult[0].nbPlacesRestantes

      await connection.execute(
        "UPDATE Seance SET nbPlacesRestantes = ? WHERE idSeance = ?",
        [ nbPlacesRestantes - 1, idSeance ]
      )

      await connection.execute(
        "INSERT INTO GrimpeurSeance (idGrimpeur, idSeance) VALUES (?, ?)",
        [ idGrimpeur, idSeance ]
      )
    } else {
      await connection.execute(
        "INSERT INTO GrimpeurSeance (idGrimpeur, idSeance, isFileDAttente) VALUES (?, ?, ?)",
        [ idGrimpeur, idSeance, isFileDAttente ]
      )
    }

    await connection.commit()

    return {
      status: 200,
      body: { success: "Grimpeur ajouté" }
    }
  } catch (err) {
    await connection.rollback()

    throw createError({
      status: 500,
      message: "Erreur durant l'ajout du grimpeur",
      statusMessage: err
    })
  }
}

async function addSeance(body) {
  const { jour, heureDebutSeance, heureFinSeance, typeSeance, nbPlaces, nbPlacesRestantes } = body
  let niveau = body.niveau
  let professeur = body.professeur

  if (niveau === undefined) {
    niveau = null
  }

  if (professeur === undefined) {
    professeur = null
  }

  try {
    await connection.beginTransaction()

    const [ rows ] = await connection.execute(
      "INSERT INTO Seance(jour, heureDebutSeance, heureFinSeance, typeSeance, niveau, nbPlaces, nbPlacesRestantes, professeur) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [ jour, heureDebutSeance, heureFinSeance, typeSeance, niveau, nbPlaces, nbPlacesRestantes, professeur ]
    )

    await connection.commit()

    return {
      status: 200,
      body: rows[0]
    }
  } catch (err) {
    await connection.rollback()

    throw createError({
      status: 500,
      message: "Erreur durant l'ajout de la séance",
      statusMessage: err
    })
  }
}
