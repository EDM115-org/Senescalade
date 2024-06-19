import mysql from "mysql2/promise"
import bcrypt from "bcryptjs"
import { createError, defineEventHandler, readBody, getQuery } from "h3"
import { ofetch } from "ofetch"

let connection = null
const base_url = `http://localhost:${process.env.DEV_PORT}`

try {
  connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  })
} catch (err) {
  console.error("Erreur de connexion à la base de données:", err)
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
  const headers = event.node.req.headers

  if (event.node.req.method === "POST") {
    const body = await readBody(event)

    switch (type) {
      case "admin":
        return await updateAdmin(body)
      case "grimpeur":
        return await updateGrimpeur(body)
      case "password":
        return await updatePassword(body)
      case "seance":
        return await updateSeance(body, headers)
      default:
        throw createError({
          status: 400,
          message: "Type de mise à jour non pris en charge"
        })
    }
  } else if (event.node.req.method === "PUT") {
    switch (type) {
      case "grimpeurIsExported":
        return await updateGrimpeurIsExported()
      default:
        throw createError({
          status: 400,
          message: "Type de mise à jour non pris en charge"
        })
    }
  } else {
    throw createError({
      status: 405,
      message: "Méthode non autorisée"
    })
  }
})

async function updateAdmin(body) {
  const { idCompte, ReadListGrimpeur, ReadListSeance, ReadListAdmin, ReadListUtilisateur, UpdateListGrimpeur, UpdateListSeance, UpdateListAdmin, UpdateListUtilisateur, DeleteListGrimpeur, DeleteListSeance, DeleteListAdmin, DeleteListUtilisateur, AccessReinscription } = body

  try {
    await connection.beginTransaction()

    const [ rows ] = await connection.execute("UPDATE Admin SET ReadListGrimpeur = ?, ReadListSeance = ?, ReadListAdmin = ?, ReadListUtilisateur = ?, UpdateListGrimpeur = ?, UpdateListSeance = ?, UpdateListAdmin = ?, UpdateListUtilisateur = ?, DeleteListGrimpeur = ?, DeleteListSeance = ?, DeleteListAdmin = ?, DeleteListUtilisateur = ?, AccessReinscription = ? WHERE idAdmin = ?", [ ReadListGrimpeur, ReadListSeance, ReadListAdmin, ReadListUtilisateur, UpdateListGrimpeur, UpdateListSeance, UpdateListAdmin, UpdateListUtilisateur, DeleteListGrimpeur, DeleteListSeance, DeleteListAdmin, DeleteListUtilisateur, AccessReinscription, idCompte ])

    await connection.commit()

    return {
      status: 200,
      body: rows[0]
    }
  } catch (err) {
    await connection.rollback()

    throw createError({
      status: 500,
      message: "Erreur lors de la mise à jour de l'administrateur",
      statusMessage: JSON.stringify(err)
    })
  }
}

async function updateGrimpeur(body) {
  const { idGrimpeur, action, nom, prenom, dateNaissance, sexe, nationalite, adresse, complementAdresse, codePostal, ville, pays, telephone, mobile, courriel2, personneNom, personnePrenom, personneTelephone, personneCourriel, numLicence, typeLicence, assurance, optionSki, optionSlackline, optionTrail, optionVTT, optionAssurance, optionProtectionAgression, fkCompte, aPaye, dateExport, isExported } = body

  try {
    await connection.beginTransaction()

    const [ rows ] = await connection.execute("UPDATE Grimpeur SET action = ?, nom = ?, prenom = ?, dateNaissance = ?, sexe = ?, nationalite = ?, adresse = ?, complementAdresse = ?, codePostal = ?, ville = ?, pays = ?, telephone = ?, mobile = ?, courriel2 = ?, personneNom = ?, personnePrenom = ?, personneTelephone = ?, personneCourriel = ?, numLicence = ?, typeLicence = ?, assurance = ?, optionSki = ?, optionSlackline = ?, optionTrail = ?, optionVTT = ?, optionAssurance = ?, optionProtectionAgression = ?, fkCompte = ?, aPaye = ?, dateExport = ?, isExported = ? WHERE idGrimpeur = ?", [ action, nom, prenom, dateNaissance, sexe, nationalite, adresse, complementAdresse, codePostal, ville, pays, telephone, mobile, courriel2, personneNom, personnePrenom, personneTelephone, personneCourriel, numLicence, typeLicence, assurance, optionSki, optionSlackline, optionTrail, optionVTT, optionAssurance, optionProtectionAgression, fkCompte, aPaye, dateExport, isExported, idGrimpeur ])

    await connection.commit()

    return {
      status: 200,
      body: rows[0]
    }
  } catch (err) {
    await connection.rollback()

    throw createError({
      status: 500,
      message: "Erreur lors de la mise à jour du grimpeur",
      statusMessage: JSON.stringify(err)
    })
  }
}

async function updatePassword(body) {
  const { oldPassword, newPassword, user } = body

  if (!user) {
    throw createError({
      status: 401,
      message: "Utilisateur non connecté"
    })
  }

  await connection.beginTransaction()

  const query = "SELECT * FROM Compte WHERE idCompte = ?"
  const [ rows ] = await connection.execute(query, [ user.id ])

  if (rows.length > 0) {
    const userFromDB = rows[0]
    const passwordMatch = await bcrypt.compare(oldPassword, userFromDB.password)

    if (passwordMatch) {
      const updateQuery = "UPDATE Compte SET password = ? WHERE idCompte = ?"

      await connection.execute(updateQuery, [ newPassword, userFromDB.idCompte ])

      await connection.commit()

      return {
        status: 200,
        body: { success: "Mot de passe mis à jour" }
      }
    } else {
      await connection.rollback()

      throw createError({
        status: 401,
        message: "Ancien mot de passe invalide"
      })
    }
  } else {
    await connection.rollback()

    throw createError({
      status: 404,
      message: "L'utilisateur n'existe pas"
    })
  }
}

async function updateSeance(body, headers) {
  const { idSeance, jour, heureDebutSeance, heureFinSeance, typeSeance, niveau, nbPlaces, nbPlacesRestantes, professeur } = body

  try {
    await connection.beginTransaction()

    const [ seanceRows ] = await connection.execute("SELECT * FROM Seance WHERE idSeance = ?", [ idSeance ])
    const seance = seanceRows[0]

    if (!seance) {
      throw createError({
        status: 404,
        message: "Séance non trouvée"
      })
    }

    if (seance.nbPlacesRestantes === 0 && seance.nbPlacesRestantes !== nbPlacesRestantes) {
      const [ grimpeurSeanceRows ] = await connection.execute("SELECT idGrimpeur FROM GrimpeurSeance WHERE idSeance = ? AND isFileDAttente = 1", [ idSeance ])

      for (const grimpeurSeance of grimpeurSeanceRows) {
        const [ grimpeurRows ] = await connection.execute("SELECT * FROM Grimpeur WHERE idGrimpeur = ?", [ grimpeurSeance.idGrimpeur ])
        const grimpeur = grimpeurRows[0]

        if (grimpeur) {
          const [ compteRows ] = await connection.execute("SELECT * FROM Compte WHERE idCompte = ?", [ grimpeur.fkCompte ])
          const compte = compteRows[0]

          if (compte) {
            await ofetch(`${base_url}/api/notifySeance`, {
              method: "POST",
              body: JSON.stringify({
                email: compte.mail
              }),
              headers: { Authorization: headers.authorization }
            })
          }
        }
      }
    }

    const [ updateRows ] = await connection.execute(
      "UPDATE Seance SET jour = ?, heureDebutSeance = ?, heureFinSeance = ?, typeSeance = ?, niveau = ?, nbPlaces = ?, nbPlacesRestantes = ?, professeur = ? WHERE idSeance = ?",
      [ jour, heureDebutSeance, heureFinSeance, typeSeance, niveau, nbPlaces, nbPlacesRestantes, professeur, idSeance ]
    )

    await connection.commit()

    return {
      status: 200,
      body: updateRows[0]
    }
  } catch (err) {
    await connection.rollback()

    throw createError({
      status: 500,
      message: "Erreur lors de la mise à jour de la séance",
      statusMessage: JSON.stringify(err)
    })
  }
}

async function updateGrimpeurIsExported() {
  try {
    await connection.beginTransaction()

    const [ rows ] = await connection.execute("UPDATE Grimpeur SET isExported = 0 WHERE isExported = 1")

    await connection.commit()

    return {
      status: 200,
      body: rows[0]
    }
  } catch (err) {
    await connection.rollback()

    throw createError({
      status: 500,
      message: "Erreur lors de la mise à jour de l'état exporté du grimpeur",
      statusMessage: JSON.stringify(err)
    })
  }
}
