import "./globals.css";
import Navbar from "../components/Navbar";

export const metadata = {
  title: "Gestion des produits",
  description: "Application de gestion de produits informatiques",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>
        <Navbar />

        <main className="main-container">
          {children}
        </main>
      </body>
    </html>
  );
}