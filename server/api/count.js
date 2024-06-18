import mysql from "mysql2/promise"
import { createError, defineEventHandler, getQuery } from "h3"

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

  if (event.node.req.method === "GET") {
    switch (type) {
      case "admin":
        return await countAdmin()
      case "compte":
        return await countCompte()
      case "grimpeur":
        return await countGrimpeur()
      case "nonPaye":
        return await countNonPaye()
      case "seance":
        return await countSeance()
      default:
        throw createError({
          status: 400,
          message: "Type de comptage non pris en charge"
        })
    }
  } else {
    throw createError({
      status: 405,
      message: "Méthode non autorisée"
    })
  }
})

async function countAdmin() {
  const [ rows ] = await connection.execute("SELECT COUNT(*) as adminCount FROM Admin")

  return {
    status: 200,
    body: { adminCount: rows[0].adminCount }
  }
}

async function countCompte() {
  const [ rows ] = await connection.execute(`
    SELECT COUNT(*) AS userCount
    FROM Compte c
    LEFT JOIN Admin a ON c.idCompte = a.idAdmin
    WHERE a.idAdmin IS NULL
  `)

  return {
    status: 200,
    body: { userCount: rows[0].userCount }
  }
}

async function countGrimpeur() {
  const [ rows ] = await connection.execute("SELECT COUNT(*) as grimpeurCount FROM Grimpeur")

  return {
    status: 200,
    body: { grimpeurCount: rows[0].grimpeurCount }
  }
}

async function countNonPaye() {
  const [ rows ] = await connection.execute("SELECT COUNT(*) as nonPayeCount FROM Grimpeur WHERE aPaye = 0")

  return {
    status: 200,
    body: { nonPayeCount: rows[0].nonPayeCount }
  }
}

async function countSeance() {
  const [ rows ] = await connection.execute("SELECT COUNT(*) as seanceCount FROM Seance")

  return {
    status: 200,
    body: { seanceCount: rows[0].seanceCount }
  }
}
