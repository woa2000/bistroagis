import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import type { ApiUser } from "../types/api";

export function useAuth() {
  const token = localStorage.getItem("authToken");
  
  const { data: user, isLoading, error } = useQuery<ApiUser>({
    queryKey: ["/api/auth/user"],
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!token, // Only run query if token exists
    queryFn: async () => {
      try {
        const response = await fetch("/api/auth/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (!response.ok) {
          if (response.status === 401) {
            // Token inválido, remove do localStorage
            localStorage.removeItem("authToken");
            return null;
          }
          throw new Error(`${response.status}: ${response.statusText}`);
        }
        
        return await response.json();
      } catch (err) {
        console.warn("Auth check failed:", err);
        // Em caso de erro de rede ou API, não falha completamente
        return null;
      }
    },
  });

  useEffect(() => {
    if (token) {
      // Set auth header for requests
      const originalFetch = window.fetch;
      window.fetch = function(...args) {
        const [resource, config] = args;
        return originalFetch(resource, {
          ...config,
          headers: {
            ...config?.headers,
            Authorization: `Bearer ${token}`,
          },
        });
      };
    }
  }, [token]);

  return {
    user,
    isLoading,
    isAuthenticated: !!user && !!token,
    error,
  };
}
