import clsx from "clsx";

function formatCurrency(value: number, currencyCode: string) {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: currencyCode,
    currencyDisplay: "narrowSymbol",
  }).format(value);
}

const Price = ({
  amount,
  compareAt,
  showBadge = true,
  className,
  currencyCode = "USD",
  currencyCodeClassName,
}: {
  amount: string;
  compareAt?: string;
  showBadge?: boolean;
  className?: string;
  currencyCode: string;
  currencyCodeClassName?: string;
} & React.ComponentProps<"div">) => {
  const current = parseFloat(amount);
  const was = compareAt ? parseFloat(compareAt) : undefined;
  const onSale = Boolean(was && was > current);
  const percentOff = onSale && was ? Math.round(((was - current) / was) * 100) : 0;

  return (
    <div className={clsx("flex items-center gap-2", className)}>
      <span
        suppressHydrationWarning={true}
        className={clsx(onSale ? "font-semibold text-destructive" : undefined)}
      >
        {formatCurrency(current, currencyCode)}
        <span className={clsx("ml-1 inline", currencyCodeClassName)}>
          {currencyCode}
        </span>
      </span>
      {onSale && was ? (
        <>
          <span className="text-xs text-muted-foreground line-through">
            {formatCurrency(was, currencyCode)}
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
