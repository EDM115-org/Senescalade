import mysql from "mysql2/promise"
import { createError, defineEventHandler, readBody, getQuery } from "h3"
import { ofetch } from "ofetch"

let connection = null
const base_url = `http://localhost:${process.env.DEV_PORT}`

try {
  connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
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
  const headers = event.node.req.headers

  if (event.node.req.method === "DELETE") {
    const body = await readBody(event)

    switch (type) {
      case "admin":
        return await deleteAdmin(body)
      case "compte":
        return await deleteCompte(body)
      case "grimpeur":
        return await deleteGrimpeur(body, headers)
      case "grimpeurSeance":
        return await deleteGrimpeurSeance(body, headers)
      case "seance":
        return await deleteSeance(body)
      default:
        throw createError({
          status: 400,
          message: "Type de suppression non pris en charge"
        })
    }
  } else {
    throw createError({
      status: 405,
      message: "Méthode non autorisée"
    })
  }
})

async function deleteAdmin(body) {
  const { idAdmin } = body

  try {
    await connection.beginTransaction()
    const [ rows ] = await connection.execute("DELETE FROM Admin WHERE idAdmin = ?", [ idAdmin ])

    await connection.commit()

    return {
      status: 200,
      body: rows[0]
    }
  } catch (err) {
    await connection.rollback()

    throw createError({
      status: 500,
      message: "Échec de la suppression de l'administrateur",
      statusMessage: JSON.stringify(err)
    })
  }
}

async function deleteCompte(body) {
  const { idCompte } = body

  try {
    await connection.beginTransaction()
    const [ rows ] = await connection.execute("DELETE FROM Compte WHERE idCompte = ?", [ idCompte ])

    await connection.commit()

    return {
      status: 200,
      body: rows[0]
    }
  } catch (err) {
    await connection.rollback()

    throw createError({
      status: 500,
      message: "Échec de la suppression du compte",
      statusMessage: JSON.stringify(err)
    })
  }
}

async function deleteGrimpeur(body, headers) {
  const { idGrimpeur } = body

  try {
    await connection.beginTransaction()
    await ofetch(`${base_url}/api/fetch?type=grimpeurSeance`, {
      method: "POST",
      body: JSON.stringify({ idGrimpeur }),
      headers: { Authorization: headers.authorization }
    })

    const response = await ofetch(`${base_url}/api/fetch?type=seance`, {
      headers: { Authorization: headers.authorization }
    })
    const seance = response.body

    if (seance.nbPlacesRestantes === 0) {
      const grimpeurSeanceResponse = await ofetch(`${base_url}/api/fetch?type=grimpeurSeance`, {
        headers: { Authorization: headers.authorization }
      })

      for (const grimpeurSeance of grimpeurSeanceResponse.body) {
        if (grimpeurSeance.isFileDAttente) {
          const grimpeurResponse = await ofetch(`${base_url}/api/fetch?type=grimpeur`, {
            method: "POST",
            body: JSON.stringify({
              idGrimpeur: grimpeurSeance.idGrimpeur
            }),
            headers: { Authorization: headers.authorization }
          })

          const compteResponse = await ofetch(`${base_url}/api/fetch?type=compte`, {
            method: "POST",
            body: JSON.stringify({
              idCompte: grimpeurResponse.body.fkCompte
            }),
            headers: { Authorization: headers.authorization }
          })

          await ofetch(`${base_url}/api/notifySeance`, {
            method: "POST",
            body: JSON.stringify({
              email: compteResponse.body.mail
            }),
            headers: { Authorization: headers.authorization }
          })
        }
      }

      await connection.execute("UPDATE Seance SET nbPlacesRestantes = 1 WHERE idSeance = ?", [ seance.idSeance ])
    }

    const [ rows ] = await connection.execute("DELETE FROM Grimpeur WHERE idGrimpeur = ?", [ idGrimpeur ])

    await connection.commit()

    return {
      status: 200,
      body: rows[0]
    }
  } catch (err) {
    await connection.rollback()

    throw createError({
      status: 500,
      message: "Échec de la suppression du grimpeur",
      statusMessage: JSON.stringify(err)
    })
  }
}

async function deleteGrimpeurSeance(body, headers) {
  const { idGrimpeur } = body

  try {
    await connection.beginTransaction()

    const result = await ofetch(`${base_url}/api/fetch?type=grimpeurSeance`, {
      method: "POST",
      body: JSON.stringify({ idGrimpeur }),
      headers: { Authorization: headers.authorization }
    })

    const seanceId = result.body.idSeance
    const response = await ofetch(`${base_url}/api/fetch?type=seance`, {
      headers: { Authorization: headers.authorization }
    })
    const seance = response.body.find((seance) => seance.idSeance === seanceId)

    if (seance.nbPlacesRestantes === 0) {
      const grimpeurSeanceResponse = await ofetch(`${base_url}/api/fetch?type=grimpeurSeance`, {
        headers: { Authorization: headers.authorization }
      })

      for (const grimpeurSeance of grimpeurSeanceResponse) {
        if (grimpeurSeance.isFileDAttente) {
          const grimpeurResponse = await ofetch(`${base_url}/api/fetch?type=grimpeur`, {
            method: "POST",
            body: JSON.stringify({
              idGrimpeur: grimpeurSeance.idGrimpeur
            }),
            headers: { Authorization: headers.authorization }
          })

          const compteResponse = await ofetch(`${base_url}/api/fetch?type=compte`, {
            method: "POST",
            body: JSON.stringify({
              idCompte: grimpeurResponse.body.fkCompte
            }),
            headers: { Authorization: headers.authorization }
          })

          await ofetch(`${base_url}/api/notifySeance`, {
            method: "POST",
            body: JSON.stringify({
              email: compteResponse.body.mail
            }),
            headers: { Authorization: headers.authorization }
          })
        }
      }

      await connection.execute("UPDATE Seance SET nbPlacesRestantes = 1 WHERE idSeance = ?", [ seance.idSeance ])
    }

    const [ rows ] = await connection.execute(
      "DELETE FROM GrimpeurSeance WHERE idGrimpeur = ?",
      [ idGrimpeur ]
    )

    await connection.commit()

    return {
      status: 200,
      body: rows
    }
  } catch (err) {
    await connection.rollback()

    throw createError({
      status: 500,
      message: "Échec de la suppression de la relation entre le grimpeur et la séance",
      statusMessage: JSON.stringify(err)
    })
  }
}

async function deleteSeance(body) {
  const { idSeance } = body

  try {
    await connection.beginTransaction()
    const [ rows ] = await connection.execute("DELETE FROM Seance WHERE idSeance = ?", [ idSeance ])

    await connection.commit()

    return {
      status: 200,
      body: rows
    }
  } catch (err) {
    await connection.rollback()

    throw createError({
      status: 500,
      message: "Échec de la suppression de la séance",
      statusMessage: JSON.stringify(err)
    })
  }
}
