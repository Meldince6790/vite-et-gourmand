import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";

function MainLayout() {
  return (
    <div>
      <header>
        <h1>Vite & Gourmand</h1>
        <Navbar />
      </header>

      <main>
        <Outlet />
      </main>

      <footer>
        <p>@ 2026 - Vite & Gourmand</p>
      </footer>
    </div>
  );
}

export default MainLayout;