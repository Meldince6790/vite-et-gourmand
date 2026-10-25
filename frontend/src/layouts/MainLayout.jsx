import { Link, Outlet } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import "../styles/layout.css";

function MainLayout() {
  return (
    <div className="layout">
      <header className="header">
        <h1>
          <Link
            to="/"
            className="header-title-link"
            aria-label="Accueil — Vite et Gourmand"
          >
            Vite & Gourmand
          </Link>
        </h1>
        <Navbar />
      </header>

      <main className="main">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}

export default MainLayout;
