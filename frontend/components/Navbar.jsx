import Link from "next/link";

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-content">
        <Link href="/" className="logo">
          TechStock
        </Link>

        <nav className="nav-links">
          <Link href="/">Accueil</Link>
          <Link href="/produits">Produits</Link>
          <Link href="/produits/ajouter" className="nav-add-button">
            Ajouter
          </Link>
        </nav>
      </div>
    </header>
  );
}