import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import AuthLayout from "@/pages/AuthLayout";
import AuthPage from "@/pages/AuthPage";
import Dashboard from "@/pages/Dashboard";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/signin" element={<AuthPage mode="signin" />} />
          <Route path="/signup" element={<AuthPage mode="signup" />} />
        </Route>

        <Route path="/Dashboard" element={<Dashboard />} />

        {/* Defaults */}
        <Route path="/" element={<Navigate to="/signin" replace />} />
        <Route path="*" element={<Navigate to="/signin" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
