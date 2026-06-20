import React, { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";

export default function ProtectedRoute({ 
  children, 
  adminOnly = false 
}: { 
  children: React.ReactNode;
  adminOnly?: boolean;
}) {
  const { user, isLoading, token } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading && !token) {
      setLocation("/login");
    } else if (!isLoading && user && adminOnly && user.role !== "admin") {
      setLocation("/dashboard");
    }
  }, [isLoading, token, user, adminOnly, setLocation]);

  if (isLoading || !token) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (adminOnly && user?.role !== "admin") {
    return null;
  }

  return <>{children}</>;
}
