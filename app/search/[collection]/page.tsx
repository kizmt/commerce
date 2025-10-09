import { getCollection, getCollectionProducts } from "lib/shopify";
import { Metadata } from "next";
import { notFound } from "next/navigation";

import Grid from "components/grid";
import ProductGridItems from "components/layout/product-grid-items";
import { defaultSort, sorting } from "lib/constants";
import { baseUrl } from "lib/utils";

export async function generateMetadata(props: {
  params: Promise<{ collection: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const collection = await getCollection(params.collection);

  if (!collection) return notFound();

  const handle = params.collection;
  const title = collection.seo?.title || collection.title;
  const baseDesc =
    collection.seo?.description ||
    collection.description ||
    `Shop ${collection.title} products in New Zealand`;

  // Keyword mapping for major TCG categories
  const keywordMap: Record<string, string[]> = {
    "magic-the-gathering": [
      "Magic The Gathering NZ",
      "MTG cards NZ",
      "MTG singles New Zealand",
      "MTG booster boxes Auckland",
      "buy Magic cards NZ",
    ],
    pokemon: [
      "Pokemon cards NZ",
      "Pokemon TCG New Zealand",
      "Pokemon booster boxes NZ",
      "buy Pokemon cards Auckland",
      "Pokemon singles NZ",
    ],
    "one-piece": [
      "One Piece TCG NZ",
      "One Piece card game New Zealand",
      "One Piece booster boxes NZ",
      "buy One Piece cards NZ",
    ],
    "dragon-ball": [
      "Dragon Ball Super Card Game NZ",
      "DBS TCG New Zealand",
      "Dragon Ball cards NZ",
      "buy Dragon Ball TCG Auckland",
    ],
    "final-fantasy": [
      "Final Fantasy TCG NZ",
      "FF TCG New Zealand",
      "Final Fantasy cards NZ",
      "buy FF TCG Auckland",
    ],
    "pre-order": [
      "TCG pre-orders NZ",
      "pre-order trading cards New Zealand",
      "upcoming TCG releases NZ",
      "reserve TCG products NZ",
    ],
    collectibles: [
      "TCG collectibles NZ",
      "trading card collectibles New Zealand",
      "rare cards NZ",
      "collectible trading cards Auckland",
    ],
  };

  const keywords = keywordMap[handle] || [
    `${collection.title} NZ`,
    `${collection.title} New Zealand`,
    `buy ${collection.title} Auckland`,
  ];

  return {
    title,
    description: baseDesc,
    keywords,
    openGraph: {
      title: `${title} | TCG Cards NZ`,
      description: baseDesc,
      type: "website",
    },
    alternates: {
      canonical: `/search/${handle}`,
    },
  };
}

export default async function CategoryPage(props: {
  params: Promise<{ collection: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const params = await props.params;
  const { sort } = searchParams as { [key: string]: string };
  const { sortKey, reverse } =
    sorting.find((item) => item.slug === sort) || defaultSort;
  const products = await getCollectionProducts({
    collection: params.collection,
    sortKey,
    reverse,
  });

  const collection = await getCollection(params.collection);
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: baseUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Search",
        item: `${baseUrl}/search`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: collection?.title || params.collection,
        item: `${baseUrl}/search/${params.collection}`,
      },
    ],
  };

  return (
    <section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd),
        }}
      />
      {products.length === 0 ? (
        <p className="py-3 text-lg mt-5">{`No products found in this collection`}</p>
      ) : (
        <Grid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <ProductGridItems products={products} />
        </Grid>
      )}
    </section>
  );
}
