"use client";

import { useRouter } from "next/navigation";

interface LogoutButtonProps {
  className?: string;
  children?: React.ReactNode;
}

export function LogoutButton({ className, children }: LogoutButtonProps) {
  const router = useRouter();

  const handleLogout = () => {
    // Clear all browser storage
    if (typeof window !== "undefined") {
      localStorage.clear();
      sessionStorage.clear();
      
      // Clear any Shopify-specific cookies that might cache the session
      document.cookie.split(";").forEach((c) => {
        document.cookie = c
          .replace(/^ +/, "")
          .replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`);
      });
    }
    
    // Navigate to logout endpoint
    router.push("/api/auth/customer/logout");
  };

  return (
    <button onClick={handleLogout} className={className}>
      {children || "Logout"}
    </button>
  );
}
