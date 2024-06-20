import pool from "./db"

import { createError, defineEventHandler, getQuery } from "h3"

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const { type } = query

  if (event.node.req.method === "GET") {
    switch (type) {
      case "admin": {
        const apiRequest1 = await countAdmin()

        return apiRequest1
      } case "compte": {
        const apiRequest2 = await countCompte()

        return apiRequest2
      } case "grimpeur": {
        const apiRequest3 = await countGrimpeur()

        return apiRequest3
      } case "nonPaye": {
        const apiRequest4 = await countNonPaye()

        return apiRequest4
      } case "seance": {
        const apiRequest5 = await countSeance()

        return apiRequest5
      } case "isExported": {
        const apiRequest6 = await countIsExported()

        return apiRequest6
      } case "isFileDAttente": {
        const apiRequest7 = await countFileDAttente()

        return apiRequest7
      } default:
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
  const connection = await pool.getConnection()
  const [ rows ] = await connection.execute("SELECT COUNT(*) as adminCount FROM Admin")

  connection.release()

  return {
    status: 200,
    body: { adminCount: rows[0].adminCount }
  }
}

async function countCompte() {
  const connection = await pool.getConnection()
  const [ rows ] = await connection.execute(`
    SELECT COUNT(*) AS userCount
    FROM Compte c
    LEFT JOIN Admin a ON c.idCompte = a.idAdmin
    WHERE a.idAdmin IS NULL
  `)

  connection.release()

  return {
    status: 200,
    body: { userCount: rows[0].userCount }
  }
}

async function countGrimpeur() {
  const connection = await pool.getConnection()
  const [ rows ] = await connection.execute("SELECT COUNT(*) as grimpeurCount FROM Grimpeur")

  connection.release()

  return {
    status: 200,
    body: { grimpeurCount: rows[0].grimpeurCount }
  }
}

async function countNonPaye() {
  const connection = await pool.getConnection()
  const [ rows ] = await connection.execute("SELECT COUNT(*) as nonPayeCount FROM Grimpeur WHERE aPaye = 0")

  connection.release()

  return {
    status: 200,
    body: { nonPayeCount: rows[0].nonPayeCount }
  }
}

async function countSeance() {
  const connection = await pool.getConnection()
  const [ rows ] = await connection.execute("SELECT COUNT(*) as seanceCount FROM Seance")

  connection.release()

  return {
    status: 200,
    body: { seanceCount: rows[0].seanceCount }
  }
}

async function countIsExported() {
  const connection = await pool.getConnection()
  const [ rows ] = await connection.execute("SELECT COUNT(*) as isExportedCount FROM Grimpeur WHERE isExported = 0")

  connection.release()

  return {
    status: 200,
    body: { isExportedCount: rows[0].isExportedCount }
  }
}

async function countFileDAttente() {
  const connection = await pool.getConnection()
  const [ rows ] = await connection.execute("SELECT COUNT(*) as isFileDAttenteCount FROM GrimpeurSeance WHERE isFileDAttente = 0")

  connection.release()

  return {
    status: 200,
    body: { isFileDAttenteCount: rows[0].isFileDAttenteCount }
  }
}
