"use client";

import clsx from "clsx";
import { convertCurrency, formatCurrency as formatCurrencyUtil } from "lib/currency";
import { useCurrency } from "./currency/currency-context";

const Price = ({
  amount,
  compareAt,
  showBadge = true,
  className,
  currencyCode = "NZD",
  currencyCodeClassName,
}: {
  amount: string;
  compareAt?: string;
  showBadge?: boolean;
  className?: string;
  currencyCode?: string;
  currencyCodeClassName?: string;
} & React.ComponentProps<"div">) => {
  const { selectedCurrency } = useCurrency();
  
  const current = parseFloat(amount);
  const was = compareAt ? parseFloat(compareAt) : undefined;
  const onSale = Boolean(was && was > current);
  const percentOff =
    onSale && was ? Math.round(((was - current) / was) * 100) : 0;

  // Convert prices from NZD (assumed base currency) to selected currency
  const convertedCurrent = convertCurrency(current, selectedCurrency);
  const convertedWas = was ? convertCurrency(was, selectedCurrency) : undefined;

  return (
    <div className={clsx("flex items-center gap-2", className)}>
      <span
        suppressHydrationWarning={true}
        className={clsx(onSale ? "font-semibold text-destructive" : undefined)}
      >
        {formatCurrencyUtil(convertedCurrent, selectedCurrency)}
        {selectedCurrency !== "NZD" && (
          <span className={clsx("ml-1 inline text-xs", currencyCodeClassName)}>
            ({selectedCurrency})
          </span>
        )}
      </span>
      {onSale && convertedWas ? (
        <>
          <span className="text-xs text-muted-foreground line-through">
            {formatCurrencyUtil(convertedWas, selectedCurrency)}
          </span>
          {showBadge ? (
            <span className="rounded-sm bg-green-600/10 px-2 py-0.5 text-[10px] font-semibold text-green-700 dark:text-green-400">
              -{percentOff}%
            </span>
          ) : null}
        </>
      ) : null}
    </div>
  );
};

export default Price;
