"use client";

import { useRouter } from "next/navigation";

interface LogoutButtonProps {
  className?: string;
  children?: React.ReactNode;
}

export function LogoutButton({ className, children }: LogoutButtonProps) {
  const router = useRouter();

  const handleLogout = async () => {
    // Clear all browser storage
    if (typeof window !== "undefined") {
      localStorage.clear();
      sessionStorage.clear();
    }

    // Navigate to logout endpoint which will handle cookie deletion
    window.location.href = "/api/auth/customer/logout";
  };

  return (
    <button onClick={handleLogout} className={className}>
      {children || "Logout"}
    </button>
  );
}
