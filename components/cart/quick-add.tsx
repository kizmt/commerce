"use client";

import { PlusIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { addItem } from "components/cart/actions";
import { useCart } from "components/cart/cart-context";
import { Product, ProductVariant } from "lib/shopify/types";
import Link from "next/link";
import { useActionState } from "react";

export function QuickAdd({
  product,
  className,
  label = "Add",
}: {
  product: Product;
  className?: string;
  label?: string;
}) {
  const { addCartItem } = useCart();
  const [message, formAction] = useActionState(addItem, null);

  const hasSingleVariant = product.variants.length === 1;
  const defaultVariant: ProductVariant | undefined = hasSingleVariant
    ? product.variants[0]
    : undefined;
  const canQuickAdd = Boolean(
    defaultVariant &&
      defaultVariant.availableForSale &&
      product.availableForSale,
  );

  if (!canQuickAdd) {
    return (
      <Link
        href={`/product/${product.handle}`}
        prefetch={true}
        className="rounded-sm border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground transition hover:bg-muted"
        aria-label="Choose options"
      >
        Choose options
      </Link>
    );
  }

  const addItemAction = formAction.bind(null, defaultVariant!.id);

  return (
    <form
      action={async () => {
        addCartItem(defaultVariant!, product);
        addItemAction();
      }}
    >
      <button
        aria-label="Add to cart"
        className={clsx(
          "flex items-center justify-center gap-1 rounded-sm bg-green-900 px-3 py-2 text-xs font-medium text-primary-foreground transition hover:opacity-90",
          className,
        )}
      >
        <PlusIcon className="h-4 w-4" />
        {label}
      </button>
      <p aria-live="polite" className="sr-only" role="status">
        {message}
      </p>
    </form>
  );
}
