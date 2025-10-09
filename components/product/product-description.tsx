"use client";

import { AddToCart } from "components/cart/add-to-cart";
import Price from "components/price";
import Prose from "components/prose";
import { Button } from "components/ui/button";
import { Product } from "lib/shopify/types";
import { useState } from "react";
import { VariantSelector } from "./variant-selector";

export function ProductDescription({ product }: { product: Product }) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Strip HTML tags to get plain text for character count
  const plainText = product.description || "";
  const shouldTruncate = plainText.length > 300;

  // Create truncated HTML if needed
  const truncatedDescription =
    shouldTruncate && !isExpanded
      ? plainText.substring(0, 300) + "..."
      : product.description;

  return (
    <>
      <div className="mb-6 flex flex-col border-b border-border pb-6">
        <h1 className="mb-2 text-5xl font-medium">{product.title}</h1>
        <div className="mr-auto w-auto rounded-sm bg-primary p-2 text-sm text-primary-foreground">
          <Price
            amount={product.priceRange.maxVariantPrice.amount}
            currencyCode={product.priceRange.maxVariantPrice.currencyCode}
          />
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
