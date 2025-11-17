// src/app/ProtectedRoute.tsx
import { useEffect, type ReactElement } from "react";
import { useAuth } from "./AuthProvider";

export default function ProtectedRoute({ children }: { children: ReactElement }) {
  const { user, loading, openLogin } = useAuth();

  useEffect(() => {
    if (!loading && !user) openLogin(); 
  }, [loading, user, openLogin]);

  if (loading) {
    return <div className="grid place-items-center h-screen">Loading…</div>;
  }

  if (!user) {
    return <div className="h-screen" />;
  }

  return children;
}
