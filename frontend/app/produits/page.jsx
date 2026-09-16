"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import ProductTable from "../../components/ProductTable";
import SearchBar from "../../components/SearchBar";
import {
  deleteProduct,
  getProducts,
} from "../../services/productService";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadProducts = useCallback(async (searchValue = "") => {
    try {
      setLoading(true);
      setError("");

      const data = await getProducts(searchValue);

      // Accepte soit un tableau direct, soit { products: [...] }
      const productList = Array.isArray(data)
        ? data
        : data.products || data.produits || [];

      setProducts(productList);
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  function handleSearch() {
    loadProducts(search);
  }

  function handleReset() {
    setSearch("");
    loadProducts();
  }

  async function handleDelete(id) {
    const confirmed = window.confirm(
      "Voulez-vous vraiment supprimer ce produit ?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setMessage("");

      const data = await deleteProduct(id);

      setMessage(data.message || "Produit supprimé avec succès.");

      setProducts((currentProducts) =>
        currentProducts.filter((product) => product.id !== id)
      );
    } catch (deleteError) {
      setError(deleteError.message);
    }
  }

  return (
    <section>
      <div className="page-header">
        <div>
          <p className="page-label">INVENTAIRE</p>
          <h1>Liste des produits</h1>
          <p>Consultez et gérez les produits informatiques.</p>
        </div>

        <Link
          href="/produits/ajouter"
          className="button button-primary"
        >
          + Ajouter un produit
        </Link>
      </div>

      <SearchBar
        search={search}
        setSearch={setSearch}
        onSearch={handleSearch}
        onReset={handleReset}
      />

      {error && <div className="alert alert-error">{error}</div>}

      {message && (
        <div className="alert alert-success">{message}</div>
      )}

      {loading ? (
        <div className="loading-message">
          Chargement des produits...
        </div>
      ) : (
        <>
          <p className="result-count">
            {products.length} produit(s) trouvé(s)
          </p>

          <ProductTable
            products={products}
            onDelete={handleDelete}
          />
        </>
      )}
    </section>
  );
}