/**
 * Loyalty Points Context
 * 
 * Provides points balance and voucher information throughout the app
 */

'use client';

import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface VoucherLevel {
  points: number;
  value: number;
  label: string;
}

interface LoyaltyContextType {
  points: number;
  availableVouchers: VoucherLevel[];
  nextLevel: VoucherLevel | null;
  isLoading: boolean;
  error: string | null;
  refreshPoints: () => Promise<void>;
}

const LoyaltyContext = createContext<LoyaltyContextType | undefined>(undefined);

export function LoyaltyProvider({ children }: { children: ReactNode }) {
  const [points, setPoints] = useState(0);
  const [availableVouchers, setAvailableVouchers] = useState<VoucherLevel[]>([]);
  const [nextLevel, setNextLevel] = useState<VoucherLevel | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPoints = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/loyalty/points');
      
      if (!response.ok) {
        if (response.status === 401) {
          // User not logged in - this is OK
          setPoints(0);
          setAvailableVouchers([]);
          setNextLevel(null);
          return;
        }
        throw new Error('Failed to fetch points');
      }

      const data = await response.json();
      setPoints(data.points);
      setAvailableVouchers(data.availableVouchers);
      setNextLevel(data.nextLevel);
    } catch (err) {
      console.error('Error fetching loyalty points:', err);
      setError(err instanceof Error ? err.message : 'Failed to load points');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPoints();
  }, []);

  return (
    <LoyaltyContext.Provider
      value={{
        points,
        availableVouchers,
        nextLevel,
        isLoading,
        error,
        refreshPoints: fetchPoints,
      }}
    >
      {children}
    </LoyaltyContext.Provider>
  );
}

export function useLoyalty() {
  const context = useContext(LoyaltyContext);
  if (context === undefined) {
    throw new Error('useLoyalty must be used within a LoyaltyProvider');
  }
  return context;
}

