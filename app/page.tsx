import { Carousel } from "components/carousel";
import { ThreeItemGrid } from "components/grid/three-items";
import CollectionRow from "components/home/collection-row";
import Hero from "components/home/hero";
import Footer from "components/layout/footer";
import { Truck } from "lucide-react";

export const metadata = {
  description:
    "High-performance ecommerce store built with Next.js, Vercel, and Shopify.",
  openGraph: {
    type: "website",
  },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <div className="mx-auto max-w-(--breakpoint-2xl) pb-8">
        <Carousel
          title="Latest Arrivals"
          source={{ type: "latest", limit: 20 }}
        />
        <div className="flex h-20 py-7 mt-2 mb-8 justify-center items-center border border-neutral-200 bg-gradient-to-r from-[#C9E3BB] to-[#C9E3BB] px-4 py-3 text-sm text-neutral-800 dark:border-neutral-800 dark:from-emerald-900/20 dark:to-cyan-900/20 dark:text-neutral-200">
          <p className="font-medium text-base text-center flex items-center justify-center gap-2">
          <Truck className="w-6 h-6 mr-2" />

            Free Shipping on orders over $300 (within New Zealand only)
            <span className="ml-2 text-base text-neutral-600 dark:text-neutral-400">*Excludes Large shipments*</span>
            <Truck className="w-6 h-6 ml-2" />

          </p>
        </div>
        <CollectionRow
          title="Magic: The Gathering"
          handle="magic-the-gathering"
        />
        <CollectionRow title="Pokémon" handle="pokemon" />
        <CollectionRow title="One Piece" handle="one-piece" />
        <ThreeItemGrid />
        <CollectionRow title="Dragon Ball" handle="dragon-ball" />
      </div>
      <Footer />
    </>
  );
}
