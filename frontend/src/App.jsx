import { Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

import Home from "./pages/Home.jsx";
import Menus from "./pages/Menus.jsx";
import MenuDetail from "./pages/MenuDetail.jsx";
import Commander from "./pages/Commander.jsx";
import ClientSpace from "./pages/ClientSpace.jsx";
import EmployeeSpace from "./pages/EmployeeSpace.jsx";
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

        <Route
          path="/espace-client"
          element={
            <ProtectedRoute allowedRoles={[1]}>
              <ClientSpace />
            </ProtectedRoute>
          }
        />

        <Route
          path="/espace-employe"
          element={
            <ProtectedRoute allowedRoles={[2]}>
              <EmployeeSpace />
            </ProtectedRoute>
          }
        />

        <Route path="/mes-commandes" element={<MesCommandes />} />
        <Route path="/login" element={<Login />} />
        <Route path="/contact" element={<Contact />} />
      </Route>
    </Routes>
  );
}

export default App;
