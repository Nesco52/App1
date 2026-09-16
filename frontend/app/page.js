import Link from "next/link";

export default function HomePage() {
  return (
    <section className="home-page">
      <div className="hero">
        <p className="hero-label">GESTION DE STOCK</p>

        <h1>Gestion des produits informatiques</h1>

        <p className="hero-description">
          Ajoutez, recherchez, modifiez et supprimez facilement les produits
          disponibles dans votre stock.
        </p>

        <div className="hero-actions">
          <Link href="/produits" className="button button-primary">
            Voir les produits
          </Link>

          <Link href="/produits/ajouter" className="button button-secondary">
            Ajouter un produit
          </Link>
        </div>
      </div>
    </section>
  );
}