import { QuickAdd } from "components/cart/quick-add";
import { GridTileImage } from "components/grid/tile";
import Price from "components/price";
import { getCollectionProducts, getProducts } from "lib/shopify";
import Link from "next/link";

export default async function CollectionRow({
  title,
  handle,
}: {
  title: string;
  handle: string;
}) {
  let products = await getCollectionProducts({
    collection: handle,
    sortKey: "CREATED",
    reverse: true,
  });
  let fallbackMode: "collection" | "query" | "global" = "collection";

  if (!products.length) {
    // Fallback: derive a reasonable search query from the handle with synonyms per brand
    const normalized = handle.replace(/-/g, " ");
    let synonyms = normalized;
    if (handle === "magic-the-gathering")
      synonyms = `${synonyms} OR mtg OR magic`;
    if (handle === "pokemon") synonyms = `${synonyms} OR pokémon`;
    if (handle === "one-piece") synonyms = `${synonyms} OR "one piece"`;
    if (handle === "dragon-ball")
      synonyms = `${synonyms} OR dbs OR "dragon ball"`;
    const query = `${synonyms} OR tag:(${synonyms}) OR product_type:(${synonyms}) OR vendor:(${synonyms})`;
    const fallback = await getProducts({
      query,
      sortKey: "CREATED_AT",
      reverse: true,
    });
    if (fallback.length) {
      products = fallback;
      fallbackMode = "query";
    }
  }

  let top = products.slice(0, 5);

  if (!top.length) {
    const global = await getProducts({
      sortKey: "BEST_SELLING",
      reverse: false,
    });
    products = global;
    top = products.slice(0, 5);
    if (!top.length) return null;
    fallbackMode = "global";
  }

  return (
    <section className="mx-auto max-w-(--breakpoint-2xl) px-4">
      <h2 className="mb-3 text-xl font-bold md:text-2xl">{title}</h2>
      <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
        {top.map((product, i) => (
          <li
            key={product.handle}
            className={`relative w-full ${i === 4 ? "hidden sm:block" : ""}`}
          >
            <div className="group relative">
              <Link
                href={`/product/${product.handle}`}
                className="block h-full w-full"
              >
                <GridTileImage
                  alt={product.title}
                  src={product.featuredImage?.url}
                  fill
                  sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw"
                />
              </Link>
              {/* Desktop: hover overlay with View + Add to cart */}
              <div className="pointer-events-none absolute inset-0 hidden items-center justify-center opacity-0 transition-opacity group-hover:opacity-100 md:flex">
                <div className="flex w-1/2 max-w-[200px] flex-col gap-4">
                  <Link
                    href={`/product/${product.handle}`}
                    className="pointer-events-auto rounded-sm border border-border bg-background/90 px-3 py-2 text-center text-xs font-medium text-foreground backdrop-blur"
                  >
                    View
                  </Link>
                  <div className="pointer-events-auto">
                    <QuickAdd
                      product={product}
                      className="w-full justify-center"
                      label="Add to cart"
                    />
                  </div>
                </div>
              </div>
              {/* Mobile: only View button (no Add to cart) */}
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100 md:hidden">
                <Link
                  href={`/product/${product.handle}`}
                  className="pointer-events-auto rounded-sm border border-border bg-background/90 px-4 py-2 text-center text-xs font-medium text-foreground backdrop-blur"
                >
                  View
                </Link>
              </div>
            </div>
            <div className="mt-2">
              <p className="line-clamp-2 text-sm font-medium text-foreground">
                {product.title}
              </p>
              <Price
                className="mt-1 text-sm"
                amount={product.priceRange.maxVariantPrice.amount}
                compareAt={product.compareAtPriceRange?.maxVariantPrice?.amount}
                currencyCode={product.priceRange.maxVariantPrice.currencyCode}
              />
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-6 mb-4 flex justify-center">
        <a
          href={
            fallbackMode === "collection"
              ? `/search/${handle}`
              : fallbackMode === "query"
                ? `/search?q=${encodeURIComponent(handle.replace(/-/g, " "))}`
                : "/search"
          }
          className="inline-flex items-center rounded-md border border-neutral-300 px-5 py-2.5 text-sm font-semibold text-neutral-900 transition-colors hover:bg-neutral-100 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-neutral-400 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-900"
        >
          View all
        </a>
      </div>
    </section>
  );
}
