import pool from "./db"
import { createError, defineEventHandler, readBody } from "h3"


export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { mail, password } = body

  if (event.node.req.method === "POST") {
    try {
      const connection = await pool.getConnection()
      const query = "INSERT INTO Compte(mail, password) VALUES (?, ?)"

      await connection.execute(query, [ mail, password ])

      connection.release()

      return {
        status: 200,
        body: { success: "Utilisateur inscrit" }
      }
    } catch (err) {
      throw createError({
        status: 500,
        message: "Erreur durant l'inscription de l'utilisateur",
        statusMessage: JSON.stringify(err)
      })
    }
  } else {
    throw createError({
      status: 405,
      message: "Méthode non autorisée"
    })
  }
})
