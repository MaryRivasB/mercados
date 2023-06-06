import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import * as React from "react";
import Login from "./views/Login";
import DashBoard_Executive from "./views/executiveViews/DashBoard_Executive";
import DashBoard_Admin from "./views/adminViews/DashBoard_Admin";
export default function App() {


  return (
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login/>}/>
          <Route path="/DashBoard_E" element={<DashBoard_Executive/>} />
          <Route path="/DashBoard_A" element={<DashBoard_Admin />} />
          
        </Routes>
    </BrowserRouter>
  );
}