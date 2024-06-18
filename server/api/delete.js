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

  if (event.node.req.method === "DELETE") {
    const body = await readBody(event)

    try {
      switch (type) {
        case "admin":
          return await deleteAdmin(body)
        case "compte":
          return await deleteCompte(body)
        case "grimpeur":
          return await deleteGrimpeur(body)
        case "grimpeurSeance":
          return await deleteGrimpeurSeance(body)
        case "seance":
          return await deleteSeance(body)
        default:
          return {
            status: 400,
            body: { error: "Type de suppression non pris en charge" },
          }
      }
    } catch (err) {
      return {
        status: 500,
        body: { error: "Erreur durant la suppression", message: err.message },
      }
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

    throw err
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

    throw err
  }
}

async function deleteGrimpeur(body) {
  const { idGrimpeur } = body

  try {
    await connection.beginTransaction()
    const result = await ofetch(`${base_url}/api/fetch?type=grimpeurSeance`, {
      method: "POST",
      body: JSON.stringify({ idGrimpeur })
    })

    if (result.status === 200) {
      const response = await ofetch(`${base_url}/api/fetch?type=seance`)

      if (response.status === 200) {
        const seance = response.body

        if (seance.nbPlacesRestantes === 0) {
          const grimpeurSeanceResponse = await ofetch(`${base_url}/api/fetch?type=grimpeurSeance`)

          if (grimpeurSeanceResponse.status === 200) {
            for (const grimpeurSeance of grimpeurSeanceResponse.body) {
              if (grimpeurSeance.isFileDAttente) {
                const grimpeurResponse = await ofetch(`${base_url}/api/fetch?type=grimpeur`, {
                  method: "POST",
                  body: JSON.stringify({
                    idGrimpeur: grimpeurSeance.idGrimpeur
                  })
                })

                if (grimpeurResponse.status === 200) {
                  const compteResponse = await ofetch(`${base_url}/api/fetch?type=compte`, {
                    method: "POST",
                    body: JSON.stringify({
                      idCompte: grimpeurResponse.body.fkCompte
                    })
                  })

                  if (compteResponse.status === 200) {
                    await ofetch(`${base_url}/api/notifySeance`, {
                      method: "POST",
                      body: JSON.stringify({
                        email: compteResponse.body.mail
                      })
                    })
                  }
                }
              }
            }
          }

          await connection.execute("UPDATE Seance SET nbPlacesRestantes = 1 WHERE idSeance = ?", [ seance.idSeance ])
        }
      }
    }

    const [ rows ] = await connection.execute("DELETE FROM Grimpeur WHERE idGrimpeur = ?", [ idGrimpeur ])

    await connection.commit()

    return {
      status: 200,
      body: rows[0]
    }
  } catch (err) {
    await connection.rollback()

    throw err
  }
}

async function deleteGrimpeurSeance(body) {
  const { idGrimpeur } = body

  try {
    await connection.beginTransaction()

    const result = await ofetch(`${base_url}/api/fetch?type=grimpeurSeance`, {
      method: "POST",
      body: JSON.stringify({ idGrimpeur })
    })

    if (result.status === 200) {
      const seanceId = result.body[0].idSeance

      const response = await ofetch(`${base_url}/api/fetch?type=seance`)

      if (response.status === 200) {
        const seance = response.body.find((seance) => seance.idSeance === seanceId)

        if (seance.nbPlacesRestantes === 0) {
          const grimpeurSeanceResponse = await ofetch(`${base_url}/api/fetch?type=grimpeurSeance`)

          if (grimpeurSeanceResponse.status === 200) {
            const grimpeurSeances = await grimpeurSeanceResponse.json()

            for (const grimpeurSeance of grimpeurSeances) {
              if (grimpeurSeance.isFileDAttente) {
                const grimpeurResponse = await ofetch(`${base_url}/api/fetch?type=grimpeur`, {
                  method: "POST",
                  body: JSON.stringify({
                    idGrimpeur: grimpeurSeance.idGrimpeur
                  })
                })

                if (grimpeurResponse.status === 200) {
                  const compteResponse = await ofetch(`${base_url}/api/fetch?type=compte`, {
                    method: "POST",
                    body: JSON.stringify({
                      idCompte: grimpeurResponse.body.fkCompte
                    })
                  })

                  if (compteResponse.status === 200) {
                    await ofetch(`${base_url}/api/notifySeance`, {
                      method: "POST",
                      body: JSON.stringify({
                        email: compteResponse.body.mail
                      })
                    })
                  }
                }
              }
            }
          }

          await connection.execute("UPDATE Seance SET nbPlacesRestantes = 1 WHERE idSeance = ?", [ seance.idSeance ])
        }
      }
    }

    const [ rows ] = await connection.execute(
      "DELETE FROM GrimpeurSeance WHERE idGrimpeur = ?",
      [ idGrimpeur ]
    )

    await connection.commit()

    return {
      status: 200,
      body: rows,
    }
  } catch (err) {
    await connection.rollback()

    throw err
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
      body: rows,
    }
  } catch (err) {
    await connection.rollback()

    throw err
  }
}
