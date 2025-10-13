"use client";
import { useEffect } from "react";
import { useAuthStore } from "../stores/authStore";

export default function AuthCleanup() {
  const clearAuth = useAuthStore((state) => state.clearAuth);

  useEffect(() => {
    // Run only in the browser
    if (typeof window === "undefined") return;

    const token = localStorage.getItem("token");

    // ✅ If there's no token, clear everything
    if (!token) {
      localStorage.removeItem("auth-storage");
      localStorage.removeItem("token");
      clearAuth();
    }
  }, [clearAuth]);

  return null; 
}
