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

  if (event.node.req.method === "GET") {
    try {
      switch (type) {
        case "admin":
          return await fetchAdmin()
        case "compte":
          return await fetchCompte()
        case "grimpeur":
          return await fetchGrimpeur()
        case "seance":
          return await fetchSeance()
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
        case "isCompteAdmin":
          return await fetchIsCompteAdmin(body)
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

async function fetchGrimpeur() {
  const [ rows ] = await connection.execute("SELECT * FROM Grimpeur")

  return {
    status: 200,
    body: rows,
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

async function fetchSeance() {
  const [ rows ] = await connection.execute("SELECT * FROM Seance")

  return {
    status: 200,
    body: rows,
  }
}
