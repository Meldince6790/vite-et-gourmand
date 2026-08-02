import { Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

import Home from "./pages/Home.jsx";
import Menus from "./pages/Menus.jsx";
import MenuDetail from "./pages/MenuDetail.jsx";
import Commander from "./pages/Commander.jsx";

import ClientSpace from "./pages/ClientSpace.jsx";

import EmployeeSpace from "./pages/EmployeeSpace.jsx";
import EmployeeCommandes from "./pages/EmployeeCommandes.jsx";
import EmployeeAvis from "./pages/EmployeeAvis.jsx";
import EmployeeMenus from "./pages/EmployeeMenus.jsx";
import EmployeePlats from "./pages/EmployeePlats.jsx";
import EmployeeHoraires from "./pages/EmployeeHoraires.jsx";

import AdminSpace from "./pages/AdminSpace.jsx";
import AdminUtilisateur from "./pages/AdminUtilisateur.jsx";
import AdminStatistiques from "./pages/AdminStatistiques.jsx";
import AdminChiffreAffaires from "./pages/AdminChiffreAffaires.jsx";

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

        <Route
          path="/commander/:id"
          element={
            <ProtectedRoute allowedRoles={[1]}>
              <Commander />
            </ProtectedRoute>
          }
        />

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
            <ProtectedRoute allowedRoles={[2, 3]}>
              <EmployeeSpace />
            </ProtectedRoute>
          }
        />

        <Route
          path="/espace-admin"
          element={
            <ProtectedRoute allowedRoles={[3]}>
              <AdminSpace />
            </ProtectedRoute>
          }
        />

        <Route
          path="/espace-admin/utilisateurs"
          element={
            <ProtectedRoute allowedRoles={[3]}>
              <AdminUtilisateur />
            </ProtectedRoute>
          }
        />

        <Route
          path="/espace-admin/statistiques"
          element={
            <ProtectedRoute allowedRoles={[3]}>
              <AdminStatistiques />
            </ProtectedRoute>
          }
        />

        <Route
          path="/espace-admin/chiffre-affaires"
          element={
            <ProtectedRoute allowedRoles={[3]}>
              <AdminChiffreAffaires />
            </ProtectedRoute>
          }
        />

        <Route
          path="/espace-employe/commandes"
          element={
            <ProtectedRoute allowedRoles={[2, 3]}>
              <EmployeeCommandes />
            </ProtectedRoute>
          }
        />

        <Route
          path="/espace-employe/avis"
          element={
            <ProtectedRoute allowedRoles={[2, 3]}>
              <EmployeeAvis />
            </ProtectedRoute>
          }
        />

        <Route
          path="/espace-employe/menus"
          element={
            <ProtectedRoute allowedRoles={[2, 3]}>
              <EmployeeMenus />
            </ProtectedRoute>
          }
        />

        <Route
          path="/espace-employe/plats"
          element={
            <ProtectedRoute allowedRoles={[2, 3]}>
              <EmployeePlats />
            </ProtectedRoute>
          }
        />

        <Route
          path="/espace-employe/horaires"
          element={
            <ProtectedRoute allowedRoles={[2, 3]}>
              <EmployeeHoraires />
            </ProtectedRoute>
          }
        />

        <Route
          path="/mes-commandes"
          element={
            <ProtectedRoute allowedRoles={[1]}>
              <MesCommandes />
            </ProtectedRoute>
          }
        />

        <Route path="/login" element={<Login />} />

        <Route path="/contact" element={<Contact />} />
      </Route>
    </Routes>
  );
}

export default App;
