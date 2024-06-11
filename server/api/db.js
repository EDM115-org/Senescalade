import mysql from "mysql2/promise"
import { defineEventHandler } from "h3"

let connection = null

try {
  connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
  })
} catch (err) {
  console.error(err)
  connection = null
}

export default defineEventHandler(async (event) => {
  if (!connection) {
    return {
      status: 500,
      body: { error: "Connexion à la base de données non disponible", event }
    }
  }
  // Get tables, and columns for all tables
  const returnData = {
    tables: [],
    rows: {},
    values: {}
  }

  try {
    const [ rows ] = await connection.execute("SHOW TABLES")

    returnData.tables = rows

    for (let i = 0; i < rows.length; i++) {
      const table = rows[i][`Tables_in_${connection.config.database}`]
      const [ columns ] = await connection.execute(`SHOW COLUMNS FROM ${table}`)

      returnData.rows[table] = columns
    }

    // get values from all tables
    for (let i = 0; i < rows.length; i++) {
      const table = rows[i][`Tables_in_${connection.config.database}`]
      const [ values ] = await connection.execute(`SELECT * FROM ${table}`)

      returnData.values[table] = values
    }
  } catch (err) {
    return {
      status: 500,
      body: { error: "Erreur durant la récupération des données", message: err }
    }
  }

  return {
    status: 200,
    body: returnData
  }
})
