"use client";

import { useEffect, useState } from "react";

const emptyProduct = {
  nom: "",
  categorie: "",
  prix: "",
  quantite: "",
  description: "",
};

export default function ProductForm({
  initialProduct,
  onSubmit,
  submitLabel = "Enregistrer",
  loading = false,
}) {
  const [product, setProduct] = useState(emptyProduct);
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialProduct) {
      setProduct({
        nom: initialProduct.nom || "",
        categorie: initialProduct.categorie || "",
        prix: initialProduct.prix ?? "",
        quantite: initialProduct.quantite ?? "",
        description: initialProduct.description || "",
      });
    }
  }, [initialProduct]);

  function handleChange(event) {
    const { name, value } = event.target;

    setProduct((previousProduct) => ({
      ...previousProduct,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!product.nom.trim()) {
      setError("Le nom du produit est obligatoire.");
      return;
    }

    if (!product.categorie.trim()) {
      setError("La catégorie est obligatoire.");
      return;
    }

    if (product.prix === "" || Number(product.prix) < 0) {
      setError("Le prix doit être supérieur ou égal à zéro.");
      return;
    }

    if (product.quantite === "" || Number(product.quantite) < 0) {
      setError("La quantité doit être supérieure ou égale à zéro.");
      return;
    }

    const productData = {
      nom: product.nom.trim(),
      categorie: product.categorie.trim(),
      prix: Number(product.prix),
      quantite: Number(product.quantite),
      description: product.description.trim(),
    };

    try {
      await onSubmit(productData);
    } catch (submitError) {
      setError(submitError.message);
    }
  }

  return (
    <form className="product-form" onSubmit={handleSubmit}>
      {error && <div className="alert alert-error">{error}</div>}

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="nom">Nom du produit *</label>

          <input
            id="nom"
            name="nom"
            type="text"
            value={product.nom}
            onChange={handleChange}
            placeholder="Exemple : MacBook Air"
            disabled={loading}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="categorie">Catégorie *</label>

          <input
            id="categorie"
            name="categorie"
            type="text"
            value={product.categorie}
            onChange={handleChange}
            placeholder="Exemple : Ordinateur"
            disabled={loading}
            required
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="prix">Prix *</label>

          <input
            id="prix"
            name="prix"
            type="number"
            min="0"
            step="0.01"
            value={product.prix}
            onChange={handleChange}
            placeholder="0.00"
            disabled={loading}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="quantite">Quantité *</label>

          <input
            id="quantite"
            name="quantite"
            type="number"
            min="0"
            step="1"
            value={product.quantite}
            onChange={handleChange}
            placeholder="0"
            disabled={loading}
            required
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="description">Description</label>

        <textarea
          id="description"
          name="description"
          rows="5"
          value={product.description}
          onChange={handleChange}
          placeholder="Description du produit..."
          disabled={loading}
        />
      </div>

      <button
        type="submit"
        className="button button-primary form-submit"
        disabled={loading}
      >
        {loading ? "Traitement..." : submitLabel}
      </button>
    </form>
  );
}