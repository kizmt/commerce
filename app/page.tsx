import { Carousel } from "components/carousel";
import { ThreeItemGrid } from "components/grid/three-items";
import CollectionRow from "components/home/collection-row";
import Hero from "components/home/hero";
import Footer from "components/layout/footer";
import {
  Carousel as BannerCarousel,
  CarouselContent as BannerCarouselContent,
  CarouselItem as BannerCarouselItem,
} from "components/ui/carousel";
import { Truck } from "lucide-react";

export const metadata = {
  title: "Turtle Island Cards | TCG Store NZ | Pokémon, MTG, One Piece",
  description:
    "Shop the latest TCG releases in NZ: Pokémon cards, Magic: The Gathering singles & sealed, One Piece TCG, Dragon Ball Super, Final Fantasy TCG. Pre-orders, booster boxes, and collectibles with fast Auckland shipping.",
  keywords: [
    "buy Pokemon cards NZ",
    "MTG booster boxes NZ",
    "One Piece TCG New Zealand",
    "Dragon Ball card game NZ",
    "Final Fantasy TCG Auckland",
    "TCG pre-orders NZ",
    "latest TCG releases",
    "trading card singles NZ",
  ],
  openGraph: {
    type: "website",
    title: "Turtle Island Cards | TCG Store NZ | Pokémon, MTG, One Piece",
    description:
      "New Zealand's trusted source for trading cards. Latest releases, pre-orders, and singles for all major TCGs.",
  },
  alternates: {
    canonical: "/",
  },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <div className="mx-auto max-w-(--breakpoint-2xl) pb-8">
        <div className="sr-only">
          <h1>
            Turtle Island Cards – New Zealand's Premier TCG Store | Pokémon,
            MTG, One Piece
          </h1>
          <p>
            Shop Pokémon cards, Magic: The Gathering singles & sealed, One Piece
            TCG, Dragon Ball Super, and Final Fantasy TCG. Fast Auckland
            shipping and pre-orders available.
          </p>
        </div>
        <Carousel
          title="Latest Arrivals"
          source={{ type: "latest", limit: 20 }}
        />
        <div className="flex h-20 py-7 mt-2 mb-8 justify-center items-center border border-neutral-200 bg-gradient-to-r from-[#C9E3BB] to-[#C9E3BB] px-4 text-sm text-neutral-800 dark:border-neutral-800 dark:from-emerald-900/20 dark:to-cyan-900/20 dark:text-neutral-200">
          {/* Mobile: carousel banner */}
          <div className="w-full md:hidden">
            <BannerCarousel intervalMs={3500} className="w-full">
              <BannerCarouselContent>
                <BannerCarouselItem>
                  <p className="flex items-center justify-center gap-2 text-center">
                    <Truck className="w-5 h-5" />
                    Free Shipping on orders over $300
                  </p>
                </BannerCarouselItem>
                <BannerCarouselItem>
                  <p className="flex items-center justify-center gap-2 text-center">
                    (Within New Zealand only)
                    <span className="text-neutral-600 dark:text-neutral-400">
                      *Excludes large shipments*
                    </span>
                  </p>
                </BannerCarouselItem>
              </BannerCarouselContent>
            </BannerCarousel>
          </div>
          {/* Desktop/tablet: static text */}
          <p className="hidden md:flex font-medium text-base text-center items-center justify-center gap-2">
            <Truck className="w-6 h-6" />
            Free Shipping on orders over $300 (within New Zealand only)
            <span className="ml-2 text-base text-neutral-600 dark:text-neutral-400">
              *Excludes Large shipments*
            </span>
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
        <CollectionRow title="Final Fantasy" handle="final-fantasy" />
      </div>
      <Footer />
    </>
  );
}
