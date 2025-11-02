import clsx from "clsx";
import { QuickAdd } from "components/cart/quick-add";
import { Product } from "lib/shopify/types";
import Image from "next/image";
import Label from "../label";

export function GridTileImage({
  isInteractive = true,
  active,
  label,
  priority = false,
  ...props
}: {
  isInteractive?: boolean;
  active?: boolean;
  label?: {
    title: string;
    amount: string;
    currencyCode: string;
    position?: "bottom" | "center";
  };
  product?: Product;
  priority?: boolean;
} & React.ComponentProps<typeof Image>) {
  return (
    <div
      className={clsx(
        "group relative w-full aspect-square overflow-hidden rounded-lg border bg-card hover:border-primary",
        {
          "border-2 border-primary": active,
          "border-border": !active,
        },
      )}
    >
      {props.src ? (
        <Image
          className={clsx("object-contain", {
            "transition duration-300 ease-in-out group-hover:scale-105":
              isInteractive,
          })}
          priority={priority}
          fetchPriority={priority ? "high" : "auto"}
          {...props}
        />
      ) : null}
      {label ? (
        <Label
          title={label.title}
          amount={label.amount}
          currencyCode={label.currencyCode}
          position={label.position}
          action={props.product ? <QuickAdd product={props.product} /> : null}
        />
      ) : null}
    </div>
  );
}
