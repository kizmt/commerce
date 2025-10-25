"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface CurrencyContextType {
  selectedCurrency: string;
  setCurrency: (code: string) => void;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(
  undefined,
);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [selectedCurrency, setSelectedCurrency] = useState("NZD");
  const [mounted, setMounted] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("preferred-currency");
    if (saved) {
      setSelectedCurrency(saved);
    }
    setMounted(true);
  }, []);

  // Save to localStorage when currency changes
  const setCurrency = (code: string) => {
    setSelectedCurrency(code);
    localStorage.setItem("preferred-currency", code);
  };

  // Always return provider context to avoid "used outside provider" error
  // The mounted check is just to know when hydration is complete
  return (
    <CurrencyContext.Provider value={{ selectedCurrency, setCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error("useCurrency must be used within CurrencyProvider");
  }
  return context;
}
