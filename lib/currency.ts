// Currency conversion rates (to NZD)
// Update these rates regularly for accuracy
export const CURRENCY_RATES: Record<
  string,
  { code: string; symbol: string; name: string; rate: number }
> = {
  NZD: {
    code: "NZD",
    symbol: "$",
    name: "New Zealand Dollar",
    rate: 1,
  },
  USD: {
    code: "USD",
    symbol: "$",
    name: "US Dollar",
    rate: 0.59, // 1 NZD = 0.59 USD (update based on current rates)
  },
  AUD: {
    code: "AUD",
    symbol: "$",
    name: "Australian Dollar",
    rate: 0.88, // 1 NZD = 0.88 AUD
  },
  GBP: {
    code: "GBP",
    symbol: "£",
    name: "British Pound",
    rate: 0.47, // 1 NZD = 0.47 GBP
  },
  EUR: {
    code: "EUR",
    symbol: "€",
    name: "Euro",
    rate: 0.54, // 1 NZD = 0.54 EUR
  },
  JPY: {
    code: "JPY",
    symbol: "¥",
    name: "Japanese Yen",
    rate: 87.5, // 1 NZD = 87.5 JPY
  },
  CAD: {
    code: "CAD",
    symbol: "$",
    name: "Canadian Dollar",
    rate: 0.79, // 1 NZD = 0.79 CAD
  },
  SGD: {
    code: "SGD",
    symbol: "$",
    name: "Singapore Dollar",
    rate: 0.79, // 1 NZD = 0.79 SGD
  },
};

/**
 * Convert an amount from NZD to a target currency
 * @param amountNZD - Amount in NZD
 * @param targetCurrency - Target currency code
 * @returns Converted amount
 */
export function convertCurrency(
  amountNZD: number,
  targetCurrency: string,
): number {
  const rate = CURRENCY_RATES[targetCurrency]?.rate ?? 1;
  return parseFloat((amountNZD * rate).toFixed(2));
}

/**
 * Format a number as currency
 * @param amount - Amount to format
 * @param currencyCode - Currency code
 * @returns Formatted currency string
 */
export function formatCurrency(
  amount: number,
  currencyCode: string = "NZD",
): string {
  const currency = CURRENCY_RATES[currencyCode];
  if (!currency) return `$${amount.toFixed(2)}`;

  // Format with appropriate decimal places (JPY has 0, most others have 2)
  const decimals = currencyCode === "JPY" ? 0 : 2;
  const formatted = amount.toFixed(decimals);

  return `${currency.symbol}${formatted}`;
}

/**
 * Get all available currencies
 * @returns Array of currency objects
 */
export function getAvailableCurrencies() {
  return Object.values(CURRENCY_RATES).sort((a, b) =>
    a.code.localeCompare(b.code),
  );
}

/**
 * Check if a currency code is valid
 * @param code - Currency code to check
 * @returns True if valid
 */
export function isValidCurrency(code: string): boolean {
  return code in CURRENCY_RATES;
}

/**
 * Get currency symbol
 * @param code - Currency code
 * @returns Currency symbol
 */
export function getCurrencySymbol(code: string): string {
  return CURRENCY_RATES[code]?.symbol ?? "$";
}
