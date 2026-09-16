
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ProductForm from "../../../components/ProductForm";
import { createProduct } from "../../../services/productService";

export default function AddProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleCreate(productData) {
    try {
      setLoading(true);

      await createProduct(productData);

      router.push("/produits");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="form-page">
      <div className="page-header">
        <div>
          <p className="page-label">NOUVEAU PRODUIT</p>
          <h1>Ajouter un produit</h1>
          <p>Remplissez les informations du nouveau produit.</p>
        </div>

        <Link href="/produits" className="button button-light">
          Retour
        </Link>
      </div>

      <div className="form-card">
        <ProductForm
          onSubmit={handleCreate}
          submitLabel="Ajouter le produit"
          loading={loading}
        />
      </div>
    </section>
  );
}