import { defaultSort } from "lib/constants";
import { getCollectionProducts, getProducts } from "lib/shopify";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams, pathname } = new URL(req.url);
    const q = searchParams.get("q") || undefined;
    const collection = searchParams.get("collection") || undefined;

    // When on /search (no collection): use product search.
    if (!collection) {
      // Compute counts by issuing two lightweight queries to respect Shopify's search.
      const queryBase: string[] = [];
      if (q) queryBase.push(q);

      const inQuery =
        [...queryBase, "available_for_sale:true"].join(" ") || undefined;
      const outQuery =
        [...queryBase, "available_for_sale:false"].join(" ") || undefined;

      const [inStockProducts, outStockProducts] = await Promise.all([
        getProducts({
          sortKey: defaultSort.sortKey,
          reverse: defaultSort.reverse,
          query: inQuery,
        }),
        getProducts({
          sortKey: defaultSort.sortKey,
          reverse: defaultSort.reverse,
          query: outQuery,
        }),
      ]);

      const inStock = inStockProducts.length;
      const outOfStock = outStockProducts.length;
      return NextResponse.json({
        inStock,
        outOfStock,
        total: inStock + outOfStock,
      });
    }

    // When on /search/[collection]: fetch collection products and count locally.
    const products = await getCollectionProducts({
      collection,
      sortKey: defaultSort.sortKey,
      reverse: defaultSort.reverse,
    });

    const inStock = products.filter((p) => p.availableForSale).length;
    const outOfStock = products.length - inStock;
    return NextResponse.json({ inStock, outOfStock, total: products.length });
  } catch (e) {
    return NextResponse.json(
      { error: "failed_to_compute_counts" },
      { status: 500 },
    );
  }
}
