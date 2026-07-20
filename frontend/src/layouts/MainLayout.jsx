import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import "../styles/layout.css";

function MainLayout() {
  return (
    <div className="layout">
      <header className="header">
        <h1>Vite & Gourmand</h1>
        <Navbar />
      </header>

      <main className="main">
        <Outlet />
      </main>

      <footer className="footer">
        <p>@ 2026 - Vite & Gourmand</p>
      </footer>
    </div>
  );
}

export default MainLayout;
