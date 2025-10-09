"use client";

import { AddToCart } from "components/cart/add-to-cart";
import Price from "components/price";
import Prose from "components/prose";
import { Button } from "components/ui/button";
import { Product } from "lib/shopify/types";
import { useState } from "react";
import { useProduct } from "./product-context";
import { VariantSelector } from "./variant-selector";

export function ProductDescription({ product }: { product: Product }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { state } = useProduct();

  // Strip HTML tags to get plain text for character count
  const plainText = product.description || "";
  const shouldTruncate = plainText.length > 300;

  // Create truncated HTML if needed
  const truncatedDescription =
    shouldTruncate && !isExpanded
      ? plainText.substring(0, 300) + "..."
      : product.description;

  // Get selected variant for stock info
  const selectedVariant = product.variants.find((variant) =>
    variant.selectedOptions.every((option) =>
      state[option.name.toLowerCase()]
        ? option.value === state[option.name.toLowerCase()]
        : true,
    ),
  );

  const quantityAvailable = selectedVariant?.quantityAvailable;
  const isAvailable =
    selectedVariant?.availableForSale ?? product.availableForSale;

  // Determine stock status with quantity display
  const getStockStatus = () => {
    if (!isAvailable) {
      return { text: "Out of Stock", color: "text-destructive" };
    }
    if (quantityAvailable === undefined || quantityAvailable === null) {
      return { text: "In Stock", color: "text-green-600 dark:text-green-500" };
    }
    if (quantityAvailable === 0) {
      return { text: "Out of Stock", color: "text-destructive" };
    }
    if (quantityAvailable >= 1 && quantityAvailable <= 3) {
      return {
        text: `Only ${quantityAvailable} left in stock`,
        color: "text-orange-600 dark:text-orange-500",
      };
    }
    if (quantityAvailable >= 4 && quantityAvailable <= 10) {
      return {
        text: `${quantityAvailable} in stock`,
        color: "text-green-600 dark:text-green-500",
      };
    }
    return { text: "In Stock", color: "text-green-600 dark:text-green-500" };
  };

  const stockStatus = getStockStatus();

  return (
    <>
      <div className="mb-6 flex flex-col border-b border-border pb-6">
        <h1 className="mb-2 text-5xl font-medium">{product.title}</h1>
        <div className="flex items-center gap-4">
          <div className="w-auto rounded-sm bg-primary p-2 text-sm text-primary-foreground">
            <Price
              amount={product.priceRange.maxVariantPrice.amount}
              currencyCode={product.priceRange.maxVariantPrice.currencyCode}
            />
          </div>
          <div className={`text-sm font-medium ${stockStatus.color}`}>
            {stockStatus.text}
          </div>
        </div>
      </div>
      <VariantSelector options={product.options} variants={product.variants} />
      {product.descriptionHtml || product.description ? (
        <div className="mb-6">
          <Prose
            className="text-sm leading-tight text-muted-foreground"
            html={
              shouldTruncate && !isExpanded
                ? `<p>${truncatedDescription}</p>`
                : product.descriptionHtml || `<p>${product.description}</p>`
            }
          />
          {shouldTruncate && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-2"
            >
              {isExpanded ? "Show less" : "Show more"}
            </Button>
          )}
        </div>
      ) : null}
      <AddToCart product={product} />
    </>
  );
}
