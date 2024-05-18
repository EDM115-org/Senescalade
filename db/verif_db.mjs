import mysql from "mysql2/promise"

let connection = null

try {
  connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
  })
} catch {
  try {
    const root_connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: "root",
      password: process.env.MYSQL_ROOT_PASSWORD
    })

    console.warn(`User ${process.env.DB_USER} isn't available. Creating it...`)
    await root_connection.execute("SOURCE ./create_user.sql")

    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD
    })
  } catch {
    console.error("Database connection not available.")
    process.exit(1)
  }
}

// check that the database process.env.DB_NAME exists, else run the create_db.sql script
const [ rows ] = await connection.execute("SHOW DATABASES")
const databases = rows.map((row) => row.Database)

if (!databases.includes(process.env.DB_NAME)) {
  console.warn(`Database ${process.env.DB_NAME} doesn't exist. Creating it...`)
  await connection.execute("SOURCE ./create_db.sql")
}

connection = await mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
})

// for each table and trigger of process.env.DB_NAME, check if it exists, else run the table's/trigger create script (instantiate_db.sql)
const [ tables ] = await connection.execute("SHOW TABLES")
const tableNames = tables.map((row) => row[`Tables_in_${process.env.DB_NAME}`])

for (const tableName of tableNames) {
  const [ triggers ] = await connection.execute(`SHOW TRIGGERS WHERE Trigger_Table = '${tableName}'`)
  const triggerNames = triggers.map((row) => row.Trigger)

  for (const triggerName of triggerNames) {
    const [ triggers ] = await connection.execute(`SHOW TRIGGERS WHERE Trigger_Name = '${triggerName}'`)
    const triggerNames = triggers.map((row) => row.Trigger)

    if (!triggerNames.includes(triggerName)) {
      console.warn(`Trigger ${triggerName} doesn't exist. Creating it...`)
      await connection.execute(`SOURCE ./triggers/${triggerName}.sql`)
    }
  }

  if (!tableNames.includes(tableName)) {
    console.warn(`Table ${tableName} doesn't exist. Creating it...`)
    await connection.execute(`SOURCE ./tables/${tableName}.sql`)
  }
}
