"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { apiClient } from "@/lib/api-client";

const publicRoutes = [
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
];

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Skip protection for public routes
    if (publicRoutes.includes(pathname)) {
      return;
    }

    if (!isLoading) {
      const token = apiClient.getAccessToken();
      if (!token || !isAuthenticated) {
        router.push("/login");
      }
    }
  }, [isAuthenticated, isLoading, router, pathname]);

  // Allow public routes to render without authentication
  if (publicRoutes.includes(pathname)) {
    return <>{children}</>;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return <>{children}</>;
}
