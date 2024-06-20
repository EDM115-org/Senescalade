import pool from "./db"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { createError, defineEventHandler, readBody } from "h3"

const JWT_SECRET = process.env.JWT_SECRET ?? "secret"

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { mail, password, stayConnected } = body

  if (event.node.req.method === "POST") {
    const connection = await pool.getConnection()
    const query = "SELECT * FROM Compte WHERE mail = ?"

    const [ rows ] = await connection.execute(query, [ mail ])

    if (rows.length > 0) {
      const user = rows[0]
      const passwordMatch = await bcrypt.compare(password, user.password)

      if (passwordMatch) {
        const adminQuery = "SELECT * FROM Admin WHERE idAdmin = ?"
        const [ adminRows ] = await connection.execute(adminQuery, [ user.idCompte ])

        connection.release()

        const isAdmin = adminRows.length > 0

        const token = jwt.sign(
          { id: user.idCompte, mail: user.mail, isAdmin },
          JWT_SECRET,
          { expiresIn: stayConnected ? "30d" : "1d" }
        )

        return {
          status: 200,
          body: { success: "Utilisateur connecté", token, user: { id: user.idCompte, mail: user.mail, isAdmin }, stayConnected }
        }
      } else {
        connection.release()

        throw createError({
          status: 401,
          message: "Mot de passe invalide"
        })
      }
    } else {
      connection.release()

      throw createError({
        status: 401,
        message: "L'utilisateur n'existe pas"
      })
    }
  } else {
    throw createError({
      status: 405,
      message: "Méthode non autorisée"
    })
  }
})
