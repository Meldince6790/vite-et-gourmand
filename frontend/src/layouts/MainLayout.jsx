import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
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

      <Footer />
    </div>
  );
}

export default MainLayout;
