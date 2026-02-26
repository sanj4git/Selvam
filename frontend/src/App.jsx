/*
  App.jsx
  -------
  Root component of the Selvam frontend.

  Routing structure:
  - /              → Landing page (unauthenticated) or redirect to /dashboard
  - /login         → Login page (public)
  - /register      → Register page (public)
  - /dashboard     → Financial dashboard with charts (protected)
  - /expenses      → Expense management CRUD (protected)
  - /assets        → Asset management CRUD (protected)
  - /liabilities   → Liability management CRUD (protected)
  - *              → Redirect to /

  All protected routes are wrapped in ProtectedRoute (checks JWT)
  and Layout (provides the header + nav shell).
*/

import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Layout from "./components/Layout.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Home from "./pages/Home.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Expenses from "./pages/Expenses.jsx";
import Assets from "./pages/Assets.jsx";
import Liabilities from "./pages/Liabilities.jsx";

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes — wrapped in auth guard + app shell */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/expenses"
          element={
            <ProtectedRoute>
              <Layout>
                <Expenses />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/assets"
          element={
            <ProtectedRoute>
              <Layout>
                <Assets />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/liabilities"
          element={
            <ProtectedRoute>
              <Layout>
                <Liabilities />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Catch-all — redirect unknown paths to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}