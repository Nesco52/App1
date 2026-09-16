const express = require("express");
const cors = require("cors");
require("dotenv").config();

const produitRoutes = require("./routes/produitRoutes");

const {
  testDatabaseConnection,
  pool,
} = require("./config/database");

const {
  notFoundHandler,
  errorHandler,
} = require("./middlewares/errorMiddleware");

const app = express();

const PORT = Number(process.env.PORT) || 5000;

const allowedOrigins = [
  process.env.FRONTEND_URL || "http://localhost:3000",
];

app.use(
  cors({
    origin(origin, callback) {
      // Autorise Postman, curl et les requêtes sans origine.
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      const corsError = new Error(
        `Origine non autorisée par CORS : ${origin}`
      );

      corsError.status = 403;

      return callback(corsError);
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json({ limit: "1mb" }));

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API de gestion des produits opérationnelle.",
    endpoints: {
      products: "/api/produits",
      health: "/api/health",
    },
  });
});

app.get("/api/health", async (req, res, next) => {
  try {
    const result = await pool.query(
      "SELECT NOW() AS current_time"
    );

    res.status(200).json({
      success: true,
      message: "Le serveur et PostgreSQL fonctionnent.",
      databaseTime: result.rows[0].current_time,
    });
  } catch (error) {
    next(error);
  }
});

app.use("/api/produits", produitRoutes);

app.use(notFoundHandler);

app.use(errorHandler);

async function startServer() {
  try {
    await testDatabaseConnection();

    app.listen(PORT, () => {
      console.log(
        `Serveur démarré sur http://localhost:${PORT}`
      );

      console.log(
        `API produits : http://localhost:${PORT}/api/produits`
      );
    });
  } catch (error) {
    console.error(
      "Le serveur n'a pas pu démarrer :",
      error.message
    );

    console.error(
      "Vérifiez PostgreSQL et les informations du fichier .env."
    );

    process.exit(1);
  }
}

startServer();