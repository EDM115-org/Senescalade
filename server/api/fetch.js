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
  const { type, id } = query

  if (event.node.req.method === "GET") {
    try {
      switch (type) {
        case "admin":
          return await fetchAdmin()
        case "compte":
          return await fetchCompte()
        case "grimpeur":
          return await fetchGrimpeur(id)
        case "grimpeurSeance":
          return await fetchGrimpeurSeance()
        case "seance":
          return await fetchSeance()
        case "csv":
          return await exportGrimpeursToCSV()
        default:
          return {
            status: 400,
            body: { error: "Type de récupération non pris en charge" },
          }
      }
    } catch (err) {
      return {
        status: 500,
        body: { error: "Erreur durant la récupération", message: err.message },
      }
    }
  } else if (event.node.req.method === "POST") {
    const body = await readBody(event)

    try {
      switch (type) {
        case "adminPerms":
          return await fetchAdminPerms(body)
        case "compte":
          return await fetchComptePost(body)
        case "isCompteAdmin":
          return await fetchIsCompteAdmin(body)
        case "mailIsVerified":
          return await fetchMailIsVerified(body)
        case "grimpeur":
          return await fetchGrimpeurPost(body)
        case "grimpeurSeance":
          return await fetchGrimpeurSeance(body)
        case "grimpeursForSeance":
          return await fetchGrimpeursForSeance(body)
        default:
          return {
            status: 400,
            body: { error: "Type de récupération non pris en charge" },
          }
      }
    } catch (err) {
      return {
        status: 500,
        body: { error: "Erreur durant la récupération", message: err.message },
      }
    }
  } else {
    return {
      status: 405,
      body: { error: "Méthode non autorisée" },
    }
  }
})

async function fetchAdmin() {
  const [ rows ] = await connection.execute(`
    SELECT c.idCompte, c.mail, a.ReadListGrimpeur, a.ReadListSeance, a.ReadListAdmin, a.ReadListUtilisateur, 
            a.UpdateListGrimpeur, a.UpdateListSeance, a.UpdateListAdmin, a.UpdateListUtilisateur, 
            a.DeleteListGrimpeur, a.DeleteListSeance, a.DeleteListAdmin, a.DeleteListUtilisateur
    FROM Compte c
    LEFT JOIN Admin a ON c.idCompte = a.idAdmin
    WHERE a.idAdmin IS NOT NULL
  `)

  return {
    status: 200,
    body: rows,
  }
}

async function fetchAdminPerms(body) {
  const { user } = body

  if (!user) {
    return {
      status: 401,
      body: { error: "Utilisateur non connecté" },
    }
  }

  const query = "SELECT * FROM Compte c INNER JOIN Admin a ON c.idCompte = a.idAdmin WHERE a.idAdmin = ?"
  const [ rows ] = await connection.execute(query, [ user.id ])

  if (rows.length > 0) {
    return {
      status: 200,
      body: rows,
    }
  } else {
    return {
      status: 404,
      body: { error: "L'utilisateur n'est pas admin" },
    }
  }
}

async function fetchCompte() {
  const [ rows ] = await connection.execute(`
    SELECT * FROM Compte c 
    LEFT JOIN Admin a ON c.idCompte = a.idAdmin 
    WHERE a.idAdmin IS NULL
  `)

  return {
    status: 200,
    body: rows,
  }
}

async function fetchComptePost(body) {
  const { idCompte } = body

  const query = "SELECT * FROM Compte WHERE idCompte = ?"
  const [ rows ] = await connection.execute(query, [ idCompte ])

  if (rows.length > 0) {
    return {
      status: 200,
      body: rows,
    }
  } else {
    return {
      status: 404,
      body: { error: "Aucun compte trouvé pour l'id donné" },
    }
  }
}

async function fetchGrimpeur(id) {
  let rows = []

  if (id === undefined) {
    rows = await connection.execute("SELECT * FROM Grimpeur")
  } else {
    rows = await connection.execute("SELECT * FROM Grimpeur WHERE fkCompte = ?", [ id ])
  }

  return {
    status: 200,
    body: rows[0],
  }
}

async function fetchGrimpeurPost(body) {
  const { idGrimpeur } = body

  const query = "SELECT * FROM Grimpeur WHERE idGrimpeur = ?"
  const [ rows ] = await connection.execute(query, [ idGrimpeur ])

  if (rows.length > 0) {
    return {
      status: 200,
      body: rows,
    }
  } else {
    return {
      status: 404,
      body: { error: "Aucun grimpeur trouvé pour l'id donné" },
    }
  }
}

async function fetchGrimpeurSeance(body) {
  const { idGrimpeur } = body
  let rows = []

  if (!idGrimpeur) {
    const query = "SELECT * FROM GrimpeurSeance"

    rows = await connection.execute(query)
  } else {
    const query = "SELECT idSeance FROM GrimpeurSeance WHERE idGrimpeur = ?"

    rows = await connection.execute(query, [ idGrimpeur ])
  }


  if (rows.length > 0) {
    return {
      status: 200,
      body: rows[0]
    }
  } else {
    return {
      status: 404,
      body: { error: "Aucune séance trouvée pour le grimpeur donné" },
    }
  }
}

async function fetchIsCompteAdmin(body) {
  const { idCompte } = body

  const adminQuery = "SELECT * FROM Admin WHERE idAdmin = ?"
  const [ adminRows ] = await connection.execute(adminQuery, [ idCompte ])
  const isAdmin = adminRows.length > 0

  return {
    status: 200,
    body: { isAdmin },
  }
}

async function fetchMailIsVerified(body) {
  const { mail } = body

  const query = "SELECT mailIsVerified FROM Compte WHERE mail = ?"
  const [ rows ] = await connection.execute(query, [ mail ])

  if (rows.length > 0) {
    return {
      status: 200,
      body: rows[0],
    }
  } else {
    return {
      status: 404,
      body: { error: "Aucun compte trouvé pour le mail donné" },
    }
  }
}

async function fetchSeance() {
  const [ rows ] = await connection.execute("SELECT * FROM Seance")

  return {
    status: 200,
    body: rows,
  }
}

async function fetchGrimpeursForSeance(body) {
  const { idSeance } = body

  if (!idSeance) {
    return {
      status: 400,
      body: { error: "L'ID de la séance est requis" },
    }
  }

  try {
    const [ rows ] = await connection.execute(
      `SELECT g.idGrimpeur, g.nom, g.prenom, s.jour, s.typeSeance, s.heureDebutSeance, s.heureFinSeance, s.nbPlaces, s.nbPlacesRestantes
       FROM Grimpeur g
       INNER JOIN GrimpeurSeance gs ON g.idGrimpeur = gs.idGrimpeur
       INNER JOIN Seance s ON gs.idSeance = s.idSeance
       WHERE gs.idSeance = ?`,
      [ idSeance ]
    )

    if (rows.length > 0) {
      return {
        status: 200,
        body: rows,
      }
    } else {
      return {
        status: 404,
        body: { error: "Aucun grimpeur trouvé pour cette séance" },
      }
    }
  } catch (err) {
    console.error("Erreur lors de la récupération des grimpeurs pour la séance:", err)

    return {
      status: 500,
      body: { error: "Erreur lors de la récupération des grimpeurs pour la séance", message: err.message },
    }
  }
}

async function exportGrimpeursToCSV() {
  try {
    const [ rows ] = await connection.execute("SELECT * FROM Grimpeur WHERE isExported = 0")

    if (!rows || rows.length === 0) {
      return {
        status: 404,
        body: { error: "Aucun grimpeur trouvé" },
      }
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
  } catch (error) {
    return {
      status: 500,
      body: { error: "Erreur durant la récupération des données", message: error.message },
    }
  }
}

