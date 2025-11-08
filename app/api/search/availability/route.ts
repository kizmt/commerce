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
      // Fetch all products matching the search query and count locally
      const products = await getProducts({
        sortKey: defaultSort.sortKey,
        reverse: defaultSort.reverse,
        query: q,
      });

      const inStock = products.filter((p) => p.availableForSale).length;
      const outOfStock = products.length - inStock;
      return NextResponse.json({
        inStock,
        outOfStock,
        total: products.length,
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
