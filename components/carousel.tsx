import Price from "components/price";
import { getCollectionProducts, getProducts } from "lib/shopify";
import Link from "next/link";
import { GridTileImage } from "./grid/tile";

export async function Carousel({
  title,
  source,
}: {
  title?: string;
  source?:
    | { type: "collection"; handle: string }
    | { type: "latest"; limit?: number }
    | { type: "preorder"; query?: string; limit?: number };
}) {
  // Collections that start with `hidden-*` are hidden from the search page.
  let products = [] as Awaited<ReturnType<typeof getCollectionProducts>>;

  if (!source || source.type === "collection") {
    const handle =
      source?.type === "collection"
        ? source.handle
        : "hidden-homepage-carousel";
    products = await getCollectionProducts({ collection: handle });
  } else if (source.type === "latest") {
    products = await getProducts({ sortKey: "CREATED_AT", reverse: true });
    if (source.limit) products = products.slice(0, source.limit);
  } else if (source.type === "preorder") {
    const q = source.query ?? 'pre-order OR preorder OR "pre order"';
    products = await getProducts({
      query: q,
      sortKey: "CREATED_AT",
      reverse: true,
    });
    if (source.limit) products = products.slice(0, source.limit);
  }

  if (!products?.length) return null;

  // Duplicate exactly twice so the track is two identical halves; translateX(-50%) loops seamlessly.
  const carouselProducts = [...products, ...products];

  return (
    <div className="w-full overflow-hidden pb-8 pt-1">
      {title ? (
        <h2 className="mx-auto mb-3 max-w-(--breakpoint-2xl) px-4 text-xl font-bold md:text-2xl">
          {title}
        </h2>
      ) : null}
      <ul className="flex animate-carousel gap-4 w-max">
        {carouselProducts.map((product, i) => (
          <li
            key={`${product.handle}${i}`}
            className="relative aspect-square w-60 max-w-[475px] flex-none "
          >
            <div className="relative aspect-square">
              <Link
                href={`/product/${product.handle}`}
                className="relative block h-full w-full"
              >
                <GridTileImage
                  alt={product.title}
                  src={product.featuredImage?.url}
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                />
              </Link>
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
    </div>
  );
}
