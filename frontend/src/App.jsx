import React from "react";
import { Route, Routes } from "react-router-dom";
import Onboarding from "./pages/Onboarding";
import UserLogin from "./pages/UserLogin";
import UserSignUp from "./pages/UserSignUp";
import CaptainLogin from "./pages/CaptainLogin";
import CaptainSignUp from "./pages/CaptainSignUp";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Onboarding />} />
        <Route path="/login" element={<UserLogin />} />
        <Route path="/signup" element={<UserSignUp />} />
        <Route path="/captain-login" element={<CaptainLogin />} />
        <Route path="/captain-signup" element={<CaptainSignUp />} />
      </Routes>
    </div>
  )
};

export default App;
