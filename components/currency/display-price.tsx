"use client";

import { convertCurrency, formatCurrency } from "lib/currency";
import { useCurrency } from "./currency-context";

interface DisplayPriceProps {
  amount: number; // Amount in NZD
  className?: string;
  showCurrency?: boolean;
}

/**
 * Display price converted to the user's selected currency
 */
export function DisplayPrice({
  amount,
  className = "",
  showCurrency = true,
}: DisplayPriceProps) {
  const { selectedCurrency } = useCurrency();

  // Convert from NZD to selected currency
  const convertedAmount = convertCurrency(amount, selectedCurrency);
  const formatted = formatCurrency(convertedAmount, selectedCurrency);

  return (
    <span className={className} title={`${amount} NZD`}>
      {formatted}
      {showCurrency && selectedCurrency !== "NZD" && (
        <span className="text-xs ml-1 text-neutral-500">
          ({selectedCurrency})
        </span>
      )}
    </span>
  );
}

/**
 * Display price range converted to the user's selected currency
 */
export function DisplayPriceRange({
  min,
  max,
  className = "",
}: {
  min: number; // In NZD
  max: number; // In NZD
  className?: string;
}) {
  const { selectedCurrency } = useCurrency();

  const convertedMin = convertCurrency(min, selectedCurrency);
  const convertedMax = convertCurrency(max, selectedCurrency);
  const formattedMin = formatCurrency(convertedMin, selectedCurrency);
  const formattedMax = formatCurrency(convertedMax, selectedCurrency);

  return (
    <span className={className} title={`${min} - ${max} NZD`}>
      {formattedMin} - {formattedMax}
    </span>
  );
}
