import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { getCurrentUser } from "../services/api";

export default function ProtectedRoute({ children, adminOnly = false }: {
  children: ReactNode; adminOnly?: boolean;
}) {
  const user = getCurrentUser();
  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && user.role !== "admin") return <Navigate to="/dashboard" replace />;
  return children;
}