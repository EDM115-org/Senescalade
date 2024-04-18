import mysql from "mysql2/promise"

// Create a connection to the database
let connection = null
try {
  connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  })
} catch (err) {
  console.error(err)
  connection = null
}

// eslint-disable-next-line no-undef
//add user to database

export default defineEventHandler(async (event) => {
  console.log("Received event", event)
  if (!connection) {
    return {
      status: 500,
      body: { error: "Database connection not available" }
    }
  }
  // add user to database
  const { email, password } = event.body
  try {
    const [rows] = await connection.execute(`INSERT INTO users (email, password) VALUES ('${email}', '${password}')`)
    console.log(rows)
    return {
      status: 200,
      body: { success: "User added" }
    }
  } catch (err) {
    console.error(err)
    return {
      status: 500,
      body: { error: "Error adding user" }
    }
  }
})
