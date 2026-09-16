function notFoundHandler(req, res) {
  res.status(404).json({
    success: false,
    message: `Route introuvable : ${req.method} ${req.originalUrl}`,
  });
}

function errorHandler(error, req, res, next) {
  console.error("Erreur API :", error);

  if (error.code === "ECONNREFUSED") {
    return res.status(503).json({
      success: false,
      message:
        "Impossible de se connecter à PostgreSQL. Vérifiez que PostgreSQL est démarré.",
    });
  }

  if (error.code === "3D000") {
    return res.status(500).json({
      success: false,
      message:
        "La base de données n'existe pas. Créez la base gestion_produits.",
    });
  }

  if (error.code === "42P01") {
    return res.status(500).json({
      success: false,
      message:
        "La table produits n'existe pas. Exécutez le fichier database.sql.",
    });
  }

  if (error.code === "28P01") {
    return res.status(500).json({
      success: false,
      message:
        "Authentification PostgreSQL refusée. Vérifiez DB_USER et DB_PASSWORD.",
    });
  }

  if (error.code === "23514") {
    return res.status(400).json({
      success: false,
      message:
        "Le prix ou la quantité ne respecte pas les règles de validation.",
    });
  }

  return res.status(error.status || 500).json({
    success: false,
    message:
      process.env.NODE_ENV === "development"
        ? error.message
        : "Une erreur interne est survenue.",
  });
}

module.exports = {
  notFoundHandler,
  errorHandler,
};