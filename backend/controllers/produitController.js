const { pool } = require("../config/database");

function parseProductId(idValue) {
  const id = Number(idValue);

  if (!Number.isInteger(id) || id <= 0) {
    return null;
  }

  return id;
}

function validateProduct(body) {
  const errors = [];

  const nom =
    typeof body.nom === "string" ? body.nom.trim() : "";

  const categorie =
    typeof body.categorie === "string"
      ? body.categorie.trim()
      : "";

  const description =
    typeof body.description === "string"
      ? body.description.trim()
      : "";

  const prix = Number(body.prix);
  const quantite = Number(body.quantite);

  if (!nom) {
    errors.push("Le nom du produit est obligatoire.");
  } else if (nom.length > 150) {
    errors.push(
      "Le nom du produit ne doit pas dépasser 150 caractères."
    );
  }

  if (!categorie) {
    errors.push("La catégorie du produit est obligatoire.");
  } else if (categorie.length > 100) {
    errors.push(
      "La catégorie ne doit pas dépasser 100 caractères."
    );
  }

  if (
    body.prix === "" ||
    body.prix === null ||
    body.prix === undefined ||
    !Number.isFinite(prix) ||
    prix < 0
  ) {
    errors.push(
      "Le prix doit être un nombre supérieur ou égal à zéro."
    );
  }

  if (
    body.quantite === "" ||
    body.quantite === null ||
    body.quantite === undefined ||
    !Number.isInteger(quantite) ||
    quantite < 0
  ) {
    errors.push(
      "La quantité doit être un entier supérieur ou égal à zéro."
    );
  }

  return {
    errors,
    product: {
      nom,
      categorie,
      prix,
      quantite,
      description,
    },
  };
}

async function getAllProducts(req, res, next) {
  try {
    const search =
      typeof req.query.search === "string"
        ? req.query.search.trim()
        : "";

    let query;
    let values;

    if (search) {
      query = `
        SELECT
          id,
          nom,
          categorie,
          prix,
          quantite,
          description,
          created_at,
          updated_at
        FROM produits
        WHERE nom ILIKE $1
           OR categorie ILIKE $1
           OR description ILIKE $1
        ORDER BY id DESC
      `;

      values = [`%${search}%`];
    } else {
      query = `
        SELECT
          id,
          nom,
          categorie,
          prix,
          quantite,
          description,
          created_at,
          updated_at
        FROM produits
        ORDER BY id DESC
      `;

      values = [];
    }

    const result = await pool.query(query, values);

    res.status(200).json({
      success: true,
      count: result.rowCount,
      products: result.rows,
    });
  } catch (error) {
    next(error);
  }
}

async function getProductById(req, res, next) {
  try {
    const id = parseProductId(req.params.id);

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "L'identifiant du produit est invalide.",
      });
    }

    const result = await pool.query(
      `
        SELECT
          id,
          nom,
          categorie,
          prix,
          quantite,
          description,
          created_at,
          updated_at
        FROM produits
        WHERE id = $1
      `,
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Produit introuvable.",
      });
    }

    return res.status(200).json({
      success: true,
      product: result.rows[0],
    });
  } catch (error) {
    return next(error);
  }
}

async function createProduct(req, res, next) {
  try {
    const { errors, product } = validateProduct(req.body || {});

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: errors[0],
        errors,
      });
    }

    const result = await pool.query(
      `
        INSERT INTO produits (
          nom,
          categorie,
          prix,
          quantite,
          description
        )
        VALUES ($1, $2, $3, $4, $5)
        RETURNING
          id,
          nom,
          categorie,
          prix,
          quantite,
          description,
          created_at,
          updated_at
      `,
      [
        product.nom,
        product.categorie,
        product.prix,
        product.quantite,
        product.description || null,
      ]
    );

    return res.status(201).json({
      success: true,
      message: "Produit ajouté avec succès.",
      product: result.rows[0],
    });
  } catch (error) {
    return next(error);
  }
}

async function updateProduct(req, res, next) {
  try {
    const id = parseProductId(req.params.id);

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "L'identifiant du produit est invalide.",
      });
    }

    const { errors, product } = validateProduct(req.body || {});

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: errors[0],
        errors,
      });
    }

    const result = await pool.query(
      `
        UPDATE produits
        SET
          nom = $1,
          categorie = $2,
          prix = $3,
          quantite = $4,
          description = $5,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $6
        RETURNING
          id,
          nom,
          categorie,
          prix,
          quantite,
          description,
          created_at,
          updated_at
      `,
      [
        product.nom,
        product.categorie,
        product.prix,
        product.quantite,
        product.description || null,
        id,
      ]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Produit introuvable.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Produit modifié avec succès.",
      product: result.rows[0],
    });
  } catch (error) {
    return next(error);
  }
}

async function deleteProduct(req, res, next) {
  try {
    const id = parseProductId(req.params.id);

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "L'identifiant du produit est invalide.",
      });
    }

    const result = await pool.query(
      `
        DELETE FROM produits
        WHERE id = $1
        RETURNING id, nom
      `,
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Produit introuvable.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Produit supprimé avec succès.",
      product: result.rows[0],
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};