"use client";

import Link from "next/link";

export default function ProductTable({ products, onDelete }) {
  if (!products || products.length === 0) {
    return (
      <div className="empty-message">
        Aucun produit trouvé.
      </div>
    );
  }

  return (
    <div className="table-container">
      <table className="product-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nom</th>
            <th>Catégorie</th>
            <th>Prix</th>
            <th>Quantité</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.id}</td>

              <td>
                <strong>{product.nom}</strong>
              </td>

              <td>{product.categorie}</td>

              <td>
                {Number(product.prix).toLocaleString("fr-FR", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}{" "}
                €
              </td>

              <td>
                <span
                  className={
                    Number(product.quantite) > 0
                      ? "stock available"
                      : "stock unavailable"
                  }
                >
                  {product.quantite}
                </span>
              </td>

              <td>{product.description || "—"}</td>

              <td>
                <div className="action-buttons">
                  <Link
                    href={`/produits/modifier/${product.id}`}
                    className="button button-edit"
                  >
                    Modifier
                  </Link>

                  <button
                    type="button"
                    className="button button-danger"
                    onClick={() => onDelete(product.id)}
                  >
                    Supprimer
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}