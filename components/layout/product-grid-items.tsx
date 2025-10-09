import { QuickAdd } from "components/cart/quick-add";
import Grid from "components/grid";
import { GridTileImage } from "components/grid/tile";
import Price from "components/price";
import { Product } from "lib/shopify/types";
import Link from "next/link";

export default function ProductGridItems({
  products,
}: {
  products: Product[];
}) {
  return (
    <>
      {products.map((product) => (
        <Grid.Item key={product.handle} className="animate-fadeIn">
          <div className="flex h-full flex-col">
            <div className="group relative">
              <Link
                className="block h-full w-full"
                href={`/product/${product.handle}`}
                prefetch={true}
              >
                <GridTileImage
                  alt={product.title}
                  src={product.featuredImage?.url}
                  fill
                  sizes="(min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
                />
              </Link>
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                <div className="flex w-1/2 max-w-[200px] flex-col gap-4">
                  <Link
                    href={`/product/${product.handle}`}
                    prefetch={true}
                    className="pointer-events-auto rounded-sm border border-border bg-background/90 px-3 py-2 text-center text-xs font-medium text-foreground backdrop-blur"
                  >
                    View
                  </Link>
                  <div className="pointer-events-auto">
                    <QuickAdd product={product} className="w-full justify-center" label="Add to cart" />
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-2 flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="line-clamp-2 text-sm font-medium text-foreground">
                  {product.title}
                </p>
                <Price
                  className="mt-1 text-sm"
                  amount={product.priceRange.maxVariantPrice.amount}
                  compareAt={(product as any).compareAtPriceRange?.maxVariantPrice?.amount}
                  currencyCode={product.priceRange.maxVariantPrice.currencyCode}
                />
              </div>
              {/* Quick Add moved to hover overlay */}
            </div>
          </div>
        </Grid.Item>
      ))}
    </>
  );
}
