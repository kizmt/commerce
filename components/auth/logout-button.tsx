"use client";

import { useRouter } from "next/navigation";

interface LogoutButtonProps {
  className?: string;
  children?: React.ReactNode;
}

export function LogoutButton({ className, children }: LogoutButtonProps) {
  const router = useRouter();

  const handleLogout = () => {
    // Clear all localStorage data
    if (typeof window !== "undefined") {
      localStorage.clear();
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
