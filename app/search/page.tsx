import Grid from "components/grid";
import ProductGridItems from "components/layout/product-grid-items";
import { defaultSort, sorting } from "lib/constants";
import { getProducts } from "lib/shopify";
import { baseUrl } from "lib/utils";

export const metadata = {
  title: "Search TCG Products",
  description:
    "Search our full catalog of trading cards, TCG singles, sealed products, and collectibles. Find Pokémon, Magic: The Gathering, One Piece, Dragon Ball, and Final Fantasy cards in New Zealand.",
  keywords: [
    "search TCG NZ",
    "find trading cards",
    "Pokemon card search NZ",
    "MTG singles search",
    "One Piece card finder",
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    title: "Search Trading Cards & TCG Products | Turtle Island NZ",
    description:
      "Browse our complete inventory of TCG products in New Zealand.",
  },
  alternates: {
    canonical: `${baseUrl}/search`,
  },
};

export default async function SearchPage(props: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const raw = (await props.searchParams) ?? {};
  const sort = typeof raw.sort === "string" ? raw.sort : undefined;
  const searchValue = typeof raw.q === "string" ? raw.q : undefined;
  const stock = typeof raw.stock === "string" ? raw.stock : undefined; // 'in' | 'out' | 'both'
  const { sortKey, reverse } =
    sorting.find((item) => item.slug === sort) || defaultSort;

  // Fetch all products matching the search query
  let products = await getProducts({
    sortKey,
    reverse,
    query: searchValue,
  });

  // Filter by availability client-side (Shopify's available_for_sale query filter doesn't work)
  if (stock === "in") {
    products = products.filter((p) => p.availableForSale);
  } else if (stock === "out") {
    products = products.filter((p) => !p.availableForSale);
  }
  // if stock === 'both' or undefined, show all

  const resultsText = products.length > 1 ? "results" : "result";

  return (
    <>
      {searchValue ? (
        <p className="mb-4">
          {products.length === 0
            ? "There are no products that match "
            : `Showing ${products.length} ${resultsText} for `}
          <span className="font-bold">&quot;{searchValue}&quot;</span>
        </p>
      ) : null}
      {products.length > 0 ? (
        <Grid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          <ProductGridItems products={products} />
        </Grid>
      ) : null}
    </>
  );
}
