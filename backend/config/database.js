const { Pool } = require("pg");
require("dotenv").config();

const requiredEnvironmentVariables = [
  "DB_HOST",
  "DB_PORT",
  "DB_USER",
  "DB_PASSWORD",
  "DB_NAME",
];

const missingVariables = requiredEnvironmentVariables.filter(
  (variableName) => !process.env[variableName]
);

if (missingVariables.length > 0) {
  throw new Error(
    `Variables d'environnement manquantes : ${missingVariables.join(", ")}`
  );
}

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

pool.on("error", (error) => {
  console.error(
    "Erreur inattendue d'une connexion PostgreSQL :",
    error.message
  );
});

async function testDatabaseConnection() {
  const client = await pool.connect();

  try {
    const result = await client.query("SELECT NOW() AS current_time");

    console.log(
      "Connexion à PostgreSQL réussie :",
      result.rows[0].current_time
    );
  } finally {
    client.release();
  }
}

module.exports = {
  pool,
  testDatabaseConnection,
};