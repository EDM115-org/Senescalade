import pool from "./db"

import { createError, defineEventHandler, getQuery, readBody } from "h3"

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const { type, id } = query

  if (event.node.req.method === "GET") {
    switch (type) {
      case "admin": {
        const apiRequest1 = await fetchAdmin()

        return apiRequest1
      } case "compte": {
        const apiRequest2 = await fetchCompte()

        return apiRequest2
      } case "grimpeur": {
        const apiRequest3 = await fetchGrimpeur(id)

        return apiRequest3
      } case "grimpeurSeance": {
        const apiRequest4 = await fetchGrimpeurSeance()

        return apiRequest4
      } case "seance": {
        const apiRequest5 = await fetchSeance()

        return apiRequest5
      } case "csv": {
        const apiRequest6 = await exportGrimpeursToCSV()

        return apiRequest6
      } case "reinscription": {
        const apiRequest7 = await fetchReinscription()

        return apiRequest7
      } case "getInfo": {
        const apiRequest8 = await getInfo()

        return apiRequest8
      } default:
        throw createError({
          status: 400,
          message: "Type de récupération non pris en charge"
        })
    }
  } else if (event.node.req.method === "POST") {
    const body = await readBody(event)

    switch (type) {
      case "adminPerms": {
        const apiRequest1 = await fetchAdminPerms(body)

        return apiRequest1
      } case "compte": {
        const apiRequest2 = await fetchComptePost(body)

        return apiRequest2
      } case "isCompteAdmin": {
        const apiRequest3 = await fetchIsCompteAdmin(body)

        return apiRequest3
      } case "mailIsVerified": {
        const apiRequest4 = await fetchMailIsVerified(body)

        return apiRequest4
      } case "grimpeurAsSeance": {
        const apiRequest5 = await fetchGrimpeurAsSeance(body)

        return apiRequest5
      } case "grimpeur": {
        const apiRequest6 = await fetchGrimpeurPost(body)

        return apiRequest6
      } case "grimpeurSeance": {
        const apiRequest7 = await fetchGrimpeurSeance(body)

        return apiRequest7
      } case "grimpeursForSeance": {
        const apiRequest8 = await fetchGrimpeursForSeance(body)

        return apiRequest8
      } default:
        throw createError({
          status: 400,
          message: "Type de récupération non pris en charge"
        })
    }
  } else {
    throw createError({
      status: 405,
      message: "Méthode non autorisée"
    })
  }
})

async function fetchAdmin() {
  const connection = await pool.getConnection()
  const [ rows ] = await connection.execute(`
    SELECT c.idCompte, c.mail, a.ReadListGrimpeur, a.ReadListSeance, a.ReadListAdmin, a.ReadListUtilisateur, 
            a.UpdateListGrimpeur, a.UpdateListSeance, a.UpdateListAdmin, a.UpdateListUtilisateur, 
            a.DeleteListGrimpeur, a.DeleteListSeance, a.DeleteListAdmin, a.DeleteListUtilisateur, a.AccessReinscription
    FROM Compte c
    LEFT JOIN Admin a ON c.idCompte = a.idAdmin
    WHERE a.idAdmin IS NOT NULL
  `)

  connection.release()

  return {
    status: 200,
    body: rows
  }
}

async function fetchAdminPerms(body) {
  const { user } = body

  if (!user) {
    throw createError({
      status: 401,
      message: "Utilisateur non connecté"
    })
  }

  const connection = await pool.getConnection()
  const query = "SELECT * FROM Compte c INNER JOIN Admin a ON c.idCompte = a.idAdmin WHERE a.idAdmin = ?"
  const [ rows ] = await connection.execute(query, [ user.id ])

  connection.release()

  if (rows.length > 0) {
    return {
      status: 200,
      body: rows[0]
    }
  } else {
    throw createError({
      status: 401,
      message: "Utilisateur non admin"
    })
  }
}

async function fetchCompte() {
  const connection = await pool.getConnection()
  const [ rows ] = await connection.execute(`
    SELECT * FROM Compte c 
    LEFT JOIN Admin a ON c.idCompte = a.idAdmin 
    WHERE a.idAdmin IS NULL
  `)

  connection.release()

  return {
    status: 200,
    body: rows
  }
}

async function fetchComptePost(body) {
  const { idCompte } = body
  const connection = await pool.getConnection()
  const query = "SELECT * FROM Compte WHERE idCompte = ?"
  const [ rows ] = await connection.execute(query, [ idCompte ])

  connection.release()

  if (rows.length > 0) {
    return {
      status: 200,
      body: rows
    }
  } else {
    throw createError({
      status: 404,
      message: "Aucun compte trouvé pour l'id donné"
    })
  }
}

async function fetchGrimpeur(id) {
  const connection = await pool.getConnection()
  let rows = []

  if (id === undefined) {
    rows = await connection.execute("SELECT * FROM Grimpeur")
  } else {
    rows = await connection.execute("SELECT * FROM Grimpeur WHERE fkCompte = ?", [ id ])
  }

  connection.release()

  return {
    status: 200,
    body: rows[0]
  }
}

async function fetchGrimpeurPost(body) {
  const { idGrimpeur } = body
  const connection = await pool.getConnection()
  const query = "SELECT * FROM Grimpeur WHERE idGrimpeur = ?"
  const [ rows ] = await connection.execute(query, [ idGrimpeur ])

  connection.release()

  if (rows.length > 0) {
    return {
      status: 200,
      body: rows
    }
  } else {
    throw createError({
      status: 404,
      message: "Aucun grimpeur trouvé pour l'id donné"
    })
  }
}

async function fetchGrimpeurSeance(body) {
  const connection = await pool.getConnection()
  let rows = []
  let idGrimpeur = null

  if (body !== undefined) {
    idGrimpeur = body.idGrimpeur
  }

  if (!idGrimpeur) {
    const query = "SELECT * FROM GrimpeurSeance"

    rows = await connection.execute(query)
  } else {
    const query = "SELECT idSeance FROM GrimpeurSeance WHERE idGrimpeur = ?"

    rows = await connection.execute(query, [ idGrimpeur ])
    rows = rows[0]
  }

  connection.release()

  return {
    status: 200,
    body: rows[0]
  }
}

async function fetchIsCompteAdmin(body) {
  const { idCompte } = body
  const connection = await pool.getConnection()
  const adminQuery = "SELECT * FROM Admin WHERE idAdmin = ?"
  const [ adminRows ] = await connection.execute(adminQuery, [ idCompte ])
  const isAdmin = adminRows.length > 0

  connection.release()

  return {
    status: 200,
    body: { isAdmin }
  }
}

async function fetchMailIsVerified(body) {
  const { mail } = body
  const connection = await pool.getConnection()
  const query = "SELECT mailIsVerified FROM Compte WHERE mail = ?"
  const [ rows ] = await connection.execute(query, [ mail ])

  connection.release()

  if (rows.length > 0) {
    return {
      status: 200,
      body: rows[0]
    }
  } else {
    throw createError({
      status: 404,
      message: "Aucun compte trouvé pour le mail donné"
    })
  }
}

async function fetchGrimpeurAsSeance(body) {
  const { idGrimpeur } = body

  if (!idGrimpeur) {
    throw createError({
      status: 400,
      message: "L'ID du grimpeur est requis"
    })
  }

  const connection = await pool.getConnection()
  const query = "SELECT * FROM GrimpeurSeance WHERE idGrimpeur = ?"
  const [ rows ] = await connection.execute(query, [ idGrimpeur ])

  connection.release()

  if (rows !== undefined && rows.length > 0) {
    return {
      status: 200,
      body: rows[0]
    }
  } else {
    return {
      status: 200,
      body: null
    }
  }
}

async function fetchSeance() {
  const connection = await pool.getConnection()
  const [ rows ] = await connection.execute("SELECT * FROM Seance")

  connection.release()

  return {
    status: 200,
    body: rows
  }
}

async function fetchGrimpeursForSeance(body) {
  const { idSeance } = body

  if (!idSeance) {
    throw createError({
      status: 400,
      message: "L'ID de la séance est requis"
    })
  }

  const connection = await pool.getConnection()
  const [ rows ] = await connection.execute(
    `SELECT g.idGrimpeur, g.nom, g.prenom, s.idSeance, s.jour, s.typeSeance, s.heureDebutSeance, s.heureFinSeance, s.nbPlaces, s.nbPlacesRestantes
      FROM Grimpeur g
      INNER JOIN GrimpeurSeance gs ON g.idGrimpeur = gs.idGrimpeur
      INNER JOIN Seance s ON gs.idSeance = s.idSeance
      WHERE gs.idSeance = ?`,
    [ idSeance ]
  )

  connection.release()

  if (rows.length > 0) {
    return {
      status: 200,
      body: rows
    }
  } else {
    throw createError({
      status: 404,
      message: "Aucun grimpeur trouvé pour cette séance"
    })
  }
}

async function exportGrimpeursToCSV() {
  const connection = await pool.getConnection()
  const [ rows ] = await connection.execute("SELECT * FROM Grimpeur WHERE isExported = 0")

  if (!rows || rows.length === 0) {
    throw createError({
      status: 404,
      message: "Aucun grimpeur trouvé"
    })
  }

  const header = [
    "nom",
    "prenom",
    "dateNaissance",
    "sexe",
    "nationalite",
    "adresse",
    "complementAdresse",
    "codePostal",
    "ville",
    "pays",
    "telephone",
    "mobile",
    "courriel2",
    "personneNom",
    "personnePrenom",
    "personneTelephone",
    "personneCourriel",
    "numLicence",
    "typeLicence",
    "assurance",
    "optionSki",
    "optionSlackline",
    "optionTrail",
    "optionVTT",
    "optionAssurance",
    "optionProtectionAgression"
  ]

  try {
    const data = rows.map((row) => [
      row.nom,
      row.prenom,
      new Date(row.dateNaissance).toLocaleDateString("fr-FR"),
      row.sexe,
      row.nationalite,
      row.adresse,
      row.complementAdresse || "",
      row.codePostal,
      row.ville,
      row.pays,
      row.telephone || "",
      row.mobile || "",
      row.courriel2 || "",
      row.personneNom || "",
      row.personnePrenom || "",
      row.personneTelephone || "",
      row.personneCourriel || "",
      row.numLicence || "",
      row.typeLicence,
      row.assurance,
      row.optionSki ? "Oui" : "Non",
      row.optionSlackline ? "Oui" : "Non",
      row.optionTrail ? "Oui" : "Non",
      row.optionVTT ? "Oui" : "Non",
      row.optionAssurance,
      row.optionProtectionAgression ? "Oui" : "Non"
    ])

    const chunkSize = 100
    const chunks = []

    for (let i = 0; i < data.length; i += chunkSize) {
      const chunk = data.slice(i, i + chunkSize)
      const csvContent = [ header, ...chunk ].map((row) => row.join(";")).join("\n")

      chunks.push(csvContent)
    }

    const idsToUpdate = rows.map((row) => row.idGrimpeur)

    const updateQuery = `UPDATE Grimpeur SET isExported = 1 WHERE idGrimpeur IN (${idsToUpdate.join(",")})`

    await connection.execute(updateQuery)

    return {
      status: 200,
      body: chunks
    }
  } catch (err) {
    throw createError({
      status: 500,
      message: "Erreur lors de la génération du fichier CSV",
      statusMessage: JSON.stringify(err)
    })
  } finally {
    connection.release()
  }
}

async function fetchReinscription() {
  const connection = await pool.getConnection()
  const [ rows ] = await connection.execute("SELECT * FROM Reinscription")

  connection.release()

  if (rows.length > 0) {
    return {
      status: 200,
      body: rows[0]
    }
  } else {
    throw createError({
      status: 404,
      message: "Aucune réinscription trouvée"
    })
  }
}

async function getInfo() {
  const connection = await pool.getConnection()
  const query = "SELECT * FROM Reinscription"
  const [ results ] = await connection.execute(query)

  connection.release()

  if (results.length === 0) {
    throw createError({
      status: 404,
      message: "Aucune réinscription trouvée"
    })
  }

  return { status: 200, body: results[0] }
}
