import mysql from "mysql2/promise"
import bcrypt from "bcryptjs"
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
  console.error("Erreur de connexion à la base de données:", err)
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
          return await updateAdmin(body)
        case "grimpeur":
          return await updateGrimpeur(body)
        case "password":
          return await updatePassword(body)
        case "seance":
          return await updateSeance(body)
        default:
          return {
            status: 400,
            body: { error: "Type de mise à jour non pris en charge" },
          }
      }
    } catch (err) {
      return {
        status: 500,
        body: { error: "Erreur durant la mise à jour", message: err.message },
      }
    }
  } else if (event.node.req.method === "PUT") {
    try {
      switch (type) {
        case "grimpeurIsExported":
          return await updateGrimpeurIsExported()
        default:
          return {
            status: 400,
            body: { error: "Type de mise à jour non pris en charge" },
          }
      }
    } catch (err) {
      return {
        status: 500,
        body: { error: "Erreur durant la mise à jour", message: err.message },
      }
    }
  } else {
    return {
      status: 405,
      body: { error: "Méthode non autorisée" },
    }
  }
})

async function updateAdmin(body) {
  const { idCompte, ReadListGrimpeur, ReadListSeance, ReadListAdmin, ReadListUtilisateur, UpdateListGrimpeur, UpdateListSeance, UpdateListAdmin, UpdateListUtilisateur, DeleteListGrimpeur, DeleteListSeance, DeleteListAdmin, DeleteListUtilisateur } = body

  try {
    await connection.beginTransaction()

    const [ rows ] = await connection.execute("UPDATE Admin SET ReadListGrimpeur = ?, ReadListSeance = ?, ReadListAdmin = ?, ReadListUtilisateur = ?, UpdateListGrimpeur = ?, UpdateListSeance = ?, UpdateListAdmin = ?, UpdateListUtilisateur = ?, DeleteListGrimpeur = ?, DeleteListSeance = ?, DeleteListAdmin = ?, DeleteListUtilisateur = ? WHERE idAdmin = ?", [ ReadListGrimpeur, ReadListSeance, ReadListAdmin, ReadListUtilisateur, UpdateListGrimpeur, UpdateListSeance, UpdateListAdmin, UpdateListUtilisateur, DeleteListGrimpeur, DeleteListSeance, DeleteListAdmin, DeleteListUtilisateur, idCompte ])

    await connection.commit()

    return {
      status: 200,
      body: rows[0]
    }
  } catch (err) {
    await connection.rollback()

    throw err
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

    throw err
  }
}

async function updatePassword(body) {
  const { oldPassword, newPassword, user } = body

  if (!user) {
    return {
      status: 401,
      body: { error: "Utilisateur non connecté" },
    }
  }

  try {
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
          body: { success: "Mot de passe mis à jour" },
        }
      } else {
        await connection.rollback()

        return {
          status: 401,
          body: { error: "Ancien mot de passe invalide" },
        }
      }
    } else {
      await connection.rollback()

      return {
        status: 404,
        body: { error: "L'utilisateur n'existe pas" },
      }
    }
  } catch (err) {
    await connection.rollback()

    throw err
  }
}

async function updateSeance(body) {
  const { idSeance, jour, heureDebutSeance, heureFinSeance, typeSeance, niveau, nbPlaces, nbPlacesRestantes, professeur } = body

  try {
    await connection.beginTransaction()

    const [ rows ] = await connection.execute("UPDATE Seance SET jour = ?, heureDebutSeance = ?, heureFinSeance = ?, typeSeance = ?, niveau = ?, nbPlaces = ?, nbPlacesRestantes = ?, professeur = ? WHERE idSeance = ?", [ jour, heureDebutSeance, heureFinSeance, typeSeance, niveau, nbPlaces, nbPlacesRestantes, professeur, idSeance ])

    await connection.commit()

    return {
      status: 200,
      body: rows[0]
    }
  } catch (err) {
    await connection.rollback()

    throw err
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

    throw err
  }
}
