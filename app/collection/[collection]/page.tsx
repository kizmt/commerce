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

  // Keyword-optimized titles for high-intent searches
  const keywordTitles: Record<string, string> = {
    "magic-the-gathering":
      "Buy Magic The Gathering Cards NZ | MTG Singles & Booster Boxes | Turtle Island",
    pokemon:
      "Buy Pokemon TCG Cards NZ | Booster Boxes & Singles | Turtle Island",
    "one-piece":
      "Buy One Piece TCG Cards NZ | Sealed Booster Boxes & Singles | Turtle Island",
    "dragon-ball":
      "Dragon Ball Super Card Game NZ | DBS TCG Booster Boxes & Singles | Turtle Island",
    "final-fantasy":
      "Buy Final Fantasy TCG Cards NZ | FF TCG Booster Boxes & Singles | Turtle Island",
    "pre-order":
      "Pre-Order TCG Games & Trading Cards NZ | Upcoming Releases | Turtle Island",
    collectibles:
      "TCG Collectibles & Rare Cards NZ | Graded & Sealed | Turtle Island",
  };

  // Keyword-optimized descriptions for CTR and relevance
  const keywordDescriptions: Record<string, string> = {
    "magic-the-gathering":
      "Shop Magic The Gathering cards in New Zealand. Premium MTG singles, booster boxes, graded cards, and sealed products. Fast shipping from Auckland to all of NZ. Check prices and availability now.",
    pokemon:
      "Buy authentic Pokemon TCG cards in New Zealand. Rare Charizards, booster boxes, ETBs, graded cards, and singles. Fast NZ-wide shipping from Auckland. Browse our full Pokemon inventory.",
    "one-piece":
      "Shop One Piece Trading Card Game in NZ. Booster boxes, starter decks, singles, and sealed products. Official distributor. Quick Auckland-based shipping to all of New Zealand.",
    "dragon-ball":
      "Dragon Ball Super Card Game store in NZ. DBS TCG booster boxes, starter decks, singles, and collectibles. Competitive prices with fast New Zealand shipping.",
    "final-fantasy":
      "Buy Final Fantasy TCG cards in New Zealand. FF TCG booster boxes, sealed products, singles, and accessories. Authentic stock with fast NZ shipping.",
    "pre-order":
      "Pre-order upcoming TCG games and trading cards in New Zealand. Secure your copies before release. Fast shipping to Auckland and nationwide NZ.",
    collectibles:
      "Premium TCG collectibles and rare trading cards in New Zealand. Graded cards, sealed boxes, vintage products. Authentic stock for serious collectors.",
  };

  const title =
    keywordTitles[handle] || collection.seo?.title || collection.title;
  const baseDesc =
    keywordDescriptions[handle] ||
    collection.seo?.description ||
    collection.description ||
    `Shop ${collection.title} products in New Zealand`;

  // Keyword mapping for additional SEO keywords
  const keywordMap: Record<string, string[]> = {
    "magic-the-gathering": [
      "Magic The Gathering NZ",
      "MTG cards NZ",
      "MTG singles New Zealand",
      "MTG booster boxes Auckland",
      "buy Magic cards NZ",
      "MTG store New Zealand",
    ],
    pokemon: [
      "Pokemon cards NZ",
      "Pokemon TCG New Zealand",
      "Pokemon booster boxes NZ",
      "buy Pokemon cards Auckland",
      "Pokemon singles NZ",
      "Charizard cards NZ",
    ],
    "one-piece": [
      "One Piece TCG NZ",
      "One Piece card game New Zealand",
      "One Piece booster boxes NZ",
      "buy One Piece cards NZ",
      "One Piece singles New Zealand",
    ],
    "dragon-ball": [
      "Dragon Ball Super Card Game NZ",
      "DBS TCG New Zealand",
      "Dragon Ball cards NZ",
      "buy Dragon Ball TCG Auckland",
      "Dragon Ball singles NZ",
    ],
    "final-fantasy": [
      "Final Fantasy TCG NZ",
      "FF TCG New Zealand",
      "Final Fantasy cards NZ",
      "buy FF TCG Auckland",
      "Final Fantasy singles",
    ],
    "pre-order": [
      "TCG pre-orders NZ",
      "pre-order trading cards New Zealand",
      "upcoming TCG releases NZ",
      "reserve TCG products NZ",
      "pre-order Pokemon cards NZ",
    ],
    collectibles: [
      "TCG collectibles NZ",
      "trading card collectibles New Zealand",
      "rare cards NZ",
      "collectible trading cards Auckland",
      "graded cards NZ",
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
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
    openGraph: {
      title: `${title} | TCG Cards NZ`,
      description: baseDesc,
      type: "website",
    },
    alternates: {
      canonical: `${baseUrl}/collection/${handle}`,
    },
  };
}

export default async function CategoryPage(props: {
  params: Promise<{ collection: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const params = await props.params;
  const { sort, stock } = searchParams as { [key: string]: string };
  const { sortKey, reverse } =
    sorting.find((item) => item.slug === sort) || defaultSort;
  let products = await getCollectionProducts({
    collection: params.collection,
    sortKey,
    reverse,
  });

  if (stock === "in") {
    products = products.filter((p) => p.availableForSale);
  } else if (stock === "out") {
    products = products.filter((p) => !p.availableForSale);
  }

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
        name: collection?.title || params.collection,
        item: `${baseUrl}/collection/${params.collection}`,
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
