-- Ce fichier doit être exécuté dans la base gestion_produits.

CREATE TABLE IF NOT EXISTS produits (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(150) NOT NULL,
    categorie VARCHAR(100) NOT NULL,
    prix NUMERIC(10, 2) NOT NULL CHECK (prix >= 0),
    quantite INTEGER NOT NULL DEFAULT 0 CHECK (quantite >= 0),
    description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_produits_nom
ON produits(nom);

CREATE INDEX IF NOT EXISTS idx_produits_categorie
ON produits(categorie);

INSERT INTO produits (
    nom,
    categorie,
    prix,
    quantite,
    description
)
SELECT
    'MacBook Air M4',
    'Ordinateur',
    1299.99,
    5,
    'Ordinateur portable Apple'
WHERE NOT EXISTS (
    SELECT 1
    FROM produits
    WHERE nom = 'MacBook Air M4'
);

INSERT INTO produits (
    nom,
    categorie,
    prix,
    quantite,
    description
)
SELECT
    'Logitech MX Master 3S',
    'Souris',
    99.90,
    12,
    'Souris sans fil ergonomique'
WHERE NOT EXISTS (
    SELECT 1
    FROM produits
    WHERE nom = 'Logitech MX Master 3S'
);

INSERT INTO produits (
    nom,
    categorie,
    prix,
    quantite,
    description
)
SELECT
    'Dell UltraSharp 27',
    'Écran',
    499.00,
    3,
    'Écran professionnel 27 pouces'
WHERE NOT EXISTS (
    SELECT 1
    FROM produits
    WHERE nom = 'Dell UltraSharp 27'
);