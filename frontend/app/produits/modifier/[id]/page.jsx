"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ProductForm from "../../../../components/ProductForm";
import {
  getProductById,
  updateProduct,
} from "../../../../services/productService";

export default function EditProductPage({ params }) {
  const { id } = use(params);

  const router = useRouter();

  const [product, setProduct] = useState(null);
  const [loadingPage, setLoadingPage] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProduct() {
      try {
        setLoadingPage(true);
        setError("");

        const data = await getProductById(id);

        setProduct(data.product || data.produit || data);
      } catch (loadError) {
        setError(loadError.message);
      } finally {
        setLoadingPage(false);
      }
    }

    loadProduct();
  }, [id]);

  async function handleUpdate(productData) {
    try {
      setSaving(true);

      await updateProduct(id, productData);

      router.push("/produits");
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  if (loadingPage) {
    return (
      <div className="loading-message">
        Chargement du produit...
      </div>
    );
  }

  if (error) {
    return (
      <section>
        <div className="alert alert-error">{error}</div>

        <Link href="/produits" className="button button-light">
          Retour aux produits
        </Link>
      </section>
    );
  }

  return (
    <section className="form-page">
      <div className="page-header">
        <div>
          <p className="page-label">MODIFICATION</p>
          <h1>Modifier le produit</h1>
          <p>Modifiez les informations du produit sélectionné.</p>
        </div>

        <Link href="/produits" className="button button-light">
          Retour
        </Link>
      </div>

      <div className="form-card">
        <ProductForm
          initialProduct={product}
          onSubmit={handleUpdate}
          submitLabel="Enregistrer les modifications"
          loading={saving}
        />
      </div>
    </section>
  );
}