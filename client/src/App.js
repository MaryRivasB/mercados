import { BrowserRouter, Routes, Route } from "react-router-dom";
import * as React from "react";
import Login from "./views/Login";
import DashBoard_Executive from "./views/executiveViews/DashBoard_Executive";
import DashBoard_Admin from "./views/adminViews/DashBoard_Admin";
import NewComercianteView from "./views/executiveViews/NewComercianteView";
import NewComercianteEventView from "./views/executiveViews/NewComercianteEventView";
import NewComercioView from "./views/executiveViews/NewCommerce";
import NewComercioEventView from "./views/executiveViews/NewCommerceEvent";
import OrdenPago from "./views/executiveViews/OrdenPago";
import TerceraEdad from "./views/PDFViews/TerceraEdad";
import OrdenPagoPDF from "./views/PDFViews/OrdenPagoPDF";
import { LogOut, ExecutiveProtectedRoute } from "./components/Middlewares";
import { useState } from "react";
import DataComerciante from "./views/executiveViews/DataComerciante";
import Cedulacommerce from "./views/PDFViews/CedulaCommerce";
import BajaCommerce from "./views/PDFViews/BajaCommerce";
export default function App() {
  
  const [userData, setuserData] = useState(null);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <LogOut setuserData={setuserData}>
              <Login userData={userData} setUserData={setuserData} />
            </LogOut>
          }
        />

        <Route
          path="/DashBoard_E"
          element={
            <ExecutiveProtectedRoute user={userData}>
              <DashBoard_Executive />
            </ExecutiveProtectedRoute>
          }
        />
        <Route path="/DashBoard_A" element={<DashBoard_Admin />} />
        <Route
          path="/Registrar-comerciante"
          element={
            <ExecutiveProtectedRoute user={userData}>
              <NewComercianteView />
            </ExecutiveProtectedRoute>
          }
        />
        <Route
          path="/Registrar-comerciante-evento"
          element={
            <ExecutiveProtectedRoute user={userData}>
              <NewComercianteEventView />
            </ExecutiveProtectedRoute>
          }
        />
        <Route
          path="/Registrar-comercio"
          element={
            <ExecutiveProtectedRoute user={userData}>
              <NewComercioView />
            </ExecutiveProtectedRoute>
          }
        />
        <Route
          path="/Registrar-comercio-evento"
          element={
            <ExecutiveProtectedRoute user={userData}>
              <NewComercioEventView />
            </ExecutiveProtectedRoute>
          }
        />
        <Route
          path="/Orden-de-Pago"
          element={
            // <ExecutiveProtectedRoute user={userData}>
              <OrdenPago />
            // </ExecutiveProtectedRoute>
          }
        />
        <Route
          path="/TerceraEdad/:id_comerciante"
          element={
            // <ExecutiveProtectedRoute user={userData}>
              <TerceraEdad />
            // </ExecutiveProtectedRoute>
          }
        />
        <Route
          path="/OrdenPagoPDF"
          element={
            // <ExecutiveProtectedRoute user={userData}>
              <OrdenPagoPDF />
            // </ExecutiveProtectedRoute>
          }
        />
        <Route
          path="/Datos-Comerciante-Comercio"
          element={
            // <ExecutiveProtectedRoute user={userData}>
              <DataComerciante />
            // </ExecutiveProtectedRoute>
          }
        />
        <Route
          path="/Cédula-de-comercio"
          element={
            // <ExecutiveProtectedRoute user={userData}>
              <Cedulacommerce/>
            // </ExecutiveProtectedRoute>
          }
        />
        <Route
          path="/Formato-baja-comercio"
          element={
            // <ExecutiveProtectedRoute user={userData}>
              <BajaCommerce/>
            // </ExecutiveProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
