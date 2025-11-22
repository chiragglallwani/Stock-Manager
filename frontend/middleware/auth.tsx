"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { apiClient } from "@/lib/api-client";

export function useRequireAuth() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      const token = apiClient.getAccessToken();
      if (!token || !isAuthenticated) {
        router.push("/login");
      }
    }
  }, [isAuthenticated, isLoading, router]);

  return { isAuthenticated, isLoading };
}
