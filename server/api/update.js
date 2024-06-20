import pool from "./db"
import bcrypt from "bcryptjs"
import { createError, defineEventHandler, readBody, getQuery } from "h3"
import { ofetch } from "ofetch"

const base_url = `http://localhost:${process.env.DEV_PORT}`

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const { type } = query
  const headers = event.node.req.headers

  if (event.node.req.method === "POST") {
    const body = await readBody(event)

    switch (type) {
      case "admin": {
        const apiRequest1 = await updateAdmin(body)

        return apiRequest1
      } case "grimpeur": {
        const apiRequest2 = await updateGrimpeur(body)

        return apiRequest2
      } case "password": {
        const apiRequest3 = await updatePassword(body)

        return apiRequest3
      } case "seance": {
        const apiRequest4 = await updateSeance(body, headers)

        return apiRequest4
      } default:
        throw createError({
          status: 400,
          message: "Type de mise à jour non pris en charge"
        })
    }
  } else if (event.node.req.method === "PUT") {
    switch (type) {
      case "grimpeurIsExported": {
        const apiRequest = await updateGrimpeurIsExported()

        return apiRequest
      } default:
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
  const connection = await pool.getConnection()

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
  } finally {
    connection.release()
  }
}

async function updateGrimpeur(body) {
  const { idGrimpeur, action, nom, prenom, dateNaissance, sexe, nationalite, adresse, complementAdresse, codePostal, ville, pays, telephone, mobile, courriel2, personneNom, personnePrenom, personneTelephone, personneCourriel, numLicence, typeLicence, assurance, optionSki, optionSlackline, optionTrail, optionVTT, optionAssurance, optionProtectionAgression, fkCompte, aPaye, isExported } = body
  const connection = await pool.getConnection()

  try {
    await connection.beginTransaction()

    const [ rows ] = await connection.execute("UPDATE Grimpeur SET action = ?, nom = ?, prenom = ?, dateNaissance = ?, sexe = ?, nationalite = ?, adresse = ?, complementAdresse = ?, codePostal = ?, ville = ?, pays = ?, telephone = ?, mobile = ?, courriel2 = ?, personneNom = ?, personnePrenom = ?, personneTelephone = ?, personneCourriel = ?, numLicence = ?, typeLicence = ?, assurance = ?, optionSki = ?, optionSlackline = ?, optionTrail = ?, optionVTT = ?, optionAssurance = ?, optionProtectionAgression = ?, fkCompte = ?, aPaye = ?,  isExported = ? WHERE idGrimpeur = ?", [ action, nom, prenom, dateNaissance, sexe, nationalite, adresse, complementAdresse, codePostal, ville, pays, telephone, mobile, courriel2, personneNom, personnePrenom, personneTelephone, personneCourriel, numLicence, typeLicence, assurance, optionSki, optionSlackline, optionTrail, optionVTT, optionAssurance, optionProtectionAgression, fkCompte, aPaye, isExported, idGrimpeur ])

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
  } finally {
    connection.release()
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

  const connection = await pool.getConnection()

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

      connection.release()

      return {
        status: 200,
        body: { success: "Mot de passe mis à jour" }
      }
    } else {
      await connection.rollback()
      connection.release()

      throw createError({
        status: 401,
        message: "Ancien mot de passe invalide"
      })
    }
  } else {
    await connection.rollback()
    connection.release()

    throw createError({
      status: 404,
      message: "L'utilisateur n'existe pas"
    })
  }
}

async function updateSeance(body, headers) {
  const { idSeance, jour, heureDebutSeance, heureFinSeance, typeSeance, niveau, nbPlaces, nbPlacesRestantes, professeur } = body
  const connection = await pool.getConnection()

  await connection.beginTransaction()

  const [ seanceRows ] = await connection.execute("SELECT * FROM Seance WHERE idSeance = ?", [ idSeance ])
  const seance = seanceRows[0]

  if (!seance) {
    connection.release()

    throw createError({
      status: 404,
      message: "Séance non trouvée"
    })
  }

  try {
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
  } catch (err) {
    await connection.rollback()
    connection.release()

    throw createError({
      status: 500,
      message: "Erreur lors de la notification des grimpeurs en file d'attente",
      statusMessage: JSON.stringify(err)
    })
  }

  const [ updateRows ] = await connection.execute(
    "UPDATE Seance SET jour = ?, heureDebutSeance = ?, heureFinSeance = ?, typeSeance = ?, niveau = ?, nbPlaces = ?, nbPlacesRestantes = ?, professeur = ? WHERE idSeance = ?",
    [ jour, heureDebutSeance, heureFinSeance, typeSeance, niveau, nbPlaces, nbPlacesRestantes, professeur, idSeance ]
  )

  await connection.commit()

  connection.release()

  return {
    status: 200,
    body: updateRows[0]
  }
}

async function updateGrimpeurIsExported() {
  const connection = await pool.getConnection()

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
  } finally {
    connection.release()
  }
}
