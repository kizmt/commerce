import clsx from "clsx";
import Price from "./price";

const Label = ({
  title,
  amount,
  currencyCode,
  position = "bottom",
  action,
}: {
  title: string;
  amount: string;
  currencyCode: string;
  position?: "bottom" | "center";
  action?: React.ReactNode;
}) => {
  return (
    <div
      className={clsx(
        "absolute bottom-0 left-0 flex w-full px-4 pb-4 @container/label",
        {
          "lg:px-20 lg:pb-[35%]": position === "center",
        },
      )}
    >
      <div className="flex items-center gap-2 rounded-sm border border-border bg-card/70 p-1 text-xs font-semibold text-foreground backdrop-blur-md">
        <h3 className="mr-2 line-clamp-2 grow pl-2 leading-none tracking-tight">
          {title}
        </h3>
        <Price
          className="flex-none rounded-sm bg-primary p-2 text-primary-foreground"
          amount={amount}
          currencyCode={currencyCode}
          currencyCodeClassName="hidden @[275px]/label:inline"
        />
        {action ? <div className="flex-none pr-1">{action}</div> : null}
      </div>
    </div>
  );
};

export default Label;
