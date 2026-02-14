import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Home() {
  const { token } = useAuth();
  if (token) {
    return <Navigate to="/expenses" replace />;
  }
  return <Navigate to="/login" replace />;
}