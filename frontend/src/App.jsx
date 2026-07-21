import { Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout.jsx";
import Home from "./pages/Home.jsx";
import Menus from "./pages/Menus.jsx";
import MenuDetail from "./pages/MenuDetail.jsx";
import Commander from "./pages/Commander.jsx";
import MesCommandes from "./pages/MesCommandes.jsx";
import Login from "./pages/Login.jsx";
import Contact from "./pages/Contact.jsx";

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/menus" element={<Menus />} />
        <Route path="/menus/:id" element={<MenuDetail />} />
        <Route path="/commander/:id" element={<Commander />} />
        <Route path="/mes-commandes" element={<MesCommandes />} />
        <Route path="/login" element={<Login />} />
        <Route path="/contact" element={<Contact />} />
      </Route>
    </Routes>
  );
}

export default App;
