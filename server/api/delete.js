import pool from "./db"
import { createError, defineEventHandler, readBody, getQuery } from "h3"
import { ofetch } from "ofetch"

const base_url = `http://localhost:${process.env.DEV_PORT}`

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const { type } = query
  const headers = event.node.req.headers

  if (event.node.req.method === "DELETE") {
    const body = await readBody(event)

    switch (type) {
      case "admin": {
        const apiRequest1 = await deleteAdmin(body)

        return apiRequest1
      } case "compte": {
        const apiRequest2 = await deleteCompte(body)

        return apiRequest2
      } case "grimpeur": {
        const apiRequest3 = await deleteGrimpeur(body, headers)

        return apiRequest3
      } case "grimpeurSeance": {
        const apiRequest4 = await deleteGrimpeurSeance(body, headers)

        return apiRequest4
      } case "seance": {
        const apiRequest5 = await deleteSeance(body)

        return apiRequest5
      } default:
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
  const connection = await pool.getConnection()

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
  } finally {
    connection.release()
  }
}

async function deleteCompte(body) {
  const { idCompte } = body
  const connection = await pool.getConnection()

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
  } finally {
    connection.release()
  }
}

async function deleteGrimpeur(body, headers) {
  const { idGrimpeur } = body
  const connection = await pool.getConnection()

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
  } finally {
    connection.release()
  }
}

async function deleteGrimpeurSeance(body, headers) {
  const { idGrimpeur } = body
  const connection = await pool.getConnection()

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
    const seance = response.body.find((seance2) => seance2.idSeance === seanceId)

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
  } finally {
    connection.release()
  }
}

async function deleteSeance(body) {
  const { idSeance } = body
  const connection = await pool.getConnection()

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
  } finally {
    connection.release()
  }
}
