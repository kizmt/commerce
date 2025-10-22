"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "components/ui/dropdown-menu";
import { getAvailableCurrencies } from "lib/currency";
import { Globe } from "lucide-react";
import { useCurrency } from "./currency-context";

export function CurrencySelector() {
  const { selectedCurrency, setCurrency } = useCurrency();
  const currencies = getAvailableCurrencies();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="flex items-center gap-2 rounded-full border border-neutral-300 px-3 py-2 text-sm hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800 transition-colors"
          title="Change currency"
        >
          <Globe className="w-4 h-4" />
          <span className="font-medium">{selectedCurrency}</span>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        {currencies.map((currency) => (
          <DropdownMenuItem
            key={currency.code}
            onClick={() => setCurrency(currency.code)}
            className={`cursor-pointer ${
              selectedCurrency === currency.code ? "bg-teal-50 dark:bg-teal-950/30" : ""
            }`}
          >
            <div className="flex flex-col gap-1 w-full">
              <div className="flex items-center justify-between">
                <span className="font-semibold">{currency.code}</span>
                {selectedCurrency === currency.code && (
                  <span className="text-teal-600 dark:text-teal-400">✓</span>
                )}
              </div>
              <span className="text-xs text-neutral-600 dark:text-neutral-400">
                {currency.symbol} {currency.name}
              </span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
