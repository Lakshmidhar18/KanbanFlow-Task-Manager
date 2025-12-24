import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

import { AuthProvider, AuthContext } from "./context/AuthContext";

/* 🔐 Protect dashboard */
function ProtectedRoute({ children }) {
  const { token } = useContext(AuthContext);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

/* 🚫 Block login/register if already logged in */
function PublicRoute({ children }) {
  const { token } = useContext(AuthContext);

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Login */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />

          {/* Register */}
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />

          {/* Dashboard */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Default redirect */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
