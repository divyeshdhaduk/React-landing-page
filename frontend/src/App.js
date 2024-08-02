import React from "react";
import { Route, Navigate, Routes } from "react-router-dom";
import Login from "./components/auth/Login";
import Regitration from "./components/auth/Registration";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <div className="d-flex flex-column flex-root">
      <div>
        <Toaster />
      </div>
      <Routes>
        <Route path="/registration" element={<Regitration />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate replace to={"/login"} />} />
      </Routes>
    </div>
  );
}

export default App;
