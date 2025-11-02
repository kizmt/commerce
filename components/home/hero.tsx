import { Card } from "components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselIndicators,
  CarouselItem,
} from "components/ui/carousel";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative mx-auto mt-4 mb-8 w-9/10 max-w-(--breakpoint-2xl) overflow-hidden rounded-xl border border-neutral-200 bg-gradient-to-br from-neutral-50 to-white dark:border-neutral-800 dark:from-neutral-950 dark:to-black">
      <Carousel className="relative px-0 py-0">
        <CarouselContent>
          <CarouselItem>
            <Slide
              imageSrc="/avatarpromo.jpg"
              imageAlt="Avatar banner"
              eyebrow="Pre‑order Now"
              title=""
              description="Secure boosters and bundles before release. Limited quantities."
              detailText="Release Date: November 21st"
              ctaHref="/search/pre-order"
              ctaText="Pre‑Order Avatar Set"
              secondaryHref="/search/magic-the-gathering"
              secondaryText="Browse MTG"
            />
          </CarouselItem>
          <CarouselItem>
            <Slide
              imageSrc="/flames.png"
              imageAlt="Pokémon banner"
              eyebrow="Just Announced"
              title="Phantasmal Flames" 
              description="Shop best‑sellers and new arrivals from your favorite TCGs."
              detailText="Release Date: November 14th"
              ctaHref="/search/pokemon"
              ctaText="Browse Catalog"
              secondaryHref="/search/pokemon"
              secondaryText="Top Sellers"
            />
          </CarouselItem>
          <CarouselItem>
            <Slide
              imageSrc="/carry.png"
              imageAlt="One Piece"
              eyebrow="Pre-order Now"
              title="Carrying On His Will"
              description="Secure launch‑day products for upcoming sets before they sell out."
              detailText="Release Date: November 7th"
              ctaHref="/search/one-piece-sealed"
              ctaText="Shop One Piece"
              secondaryHref="/search/one-piece"
              secondaryText="Explore All"
            />
          </CarouselItem>
          <CarouselItem>
            <Slide
              imageSrc="/mtgffbanner.jpg"
              imageAlt="Final Fantasy banner"
              eyebrow="Shop MTG Final Fantasy"
              title=""
              description="Explore the latest Final Fantasy TCG singles and sealed product."
              detailText=""
              ctaHref="/search/final-fantasy-sealed"
              ctaText="Shop Sealed Product"
              secondaryHref="/search/final-fantasy"
              secondaryText="Explore All"
            />
          </CarouselItem>
        </CarouselContent>
        <CarouselIndicators />
      </Carousel>
    </section>
  );
}

function Slide({
  imageSrc,
  imageAlt,
  eyebrow,
  title,
  description,
  detailText,
  ctaHref,
  ctaText,
  secondaryHref,
  secondaryText,
}: {
  imageSrc: string;
  imageAlt: string;
  eyebrow: string;
  title: string;
  description: string;
  detailText: string;
  ctaHref: string;
  ctaText: string;
  secondaryHref: string;
  secondaryText: string;
}) {
  return (
    <div className="relative h-[340px] w-full overflow-hidden md:h-[400px] lg:h-[460px]">
      <Image
        src={imageSrc}
        alt={imageAlt}
        fill
        priority={true}
        className="object-cover"
        sizes="(min-width: 1024px) 100vw, 100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
      <div className="relative z-10 mx-auto h-full w-full max-w-(--breakpoint-2xl) px-4 py-6 md:px-6 md:py-8 lg:px-8">
        <div className="flex h-full max-w-xl flex-col justify-between md:max-w-2xl">
          <div>
            <Card className="mb-2 w-fit bg-white/85 px-2.5 py-1 text-black md:mb-3 md:px-3 dark:bg-black/60 dark:text-white">
              <span className="text-xs font-semibold uppercase tracking-wide md:tracking-widest md:text-sm">
                {eyebrow}
              </span>
            </Card>
            {title?.trim() ? (
              <Card className="mb-2 w-fit bg-white/35 px-2.5 py-1.5 text-black md:mb-3 md:px-3 md:py-2 dark:bg-black/60 dark:text-white">
                <h2 className="text-2xl font-extrabold leading-tight tracking-tight md:text-4xl lg:text-5xl">
                  {title}
                </h2>
              </Card>
            ) : null}
            {detailText && (
              <Card className="mt-1.5 w-fit bg-white/35 px-2.5 py-1.5 text-white md:mt-2 md:px-3 md:py-2 dark:bg-black/60 dark:text-white">
                <span className="text-xs font-semibold uppercase tracking-wide md:tracking-widest md:text-sm">
                  {detailText}
                </span>
              </Card>
            )}
          </div>
          <div>
            <div className="flex flex-wrap gap-2 pb-2 md:gap-3">
              <a
                href={ctaHref}
                className="inline-flex items-center rounded-md bg-white px-4 py-2 text-sm font-semibold text-black transition-colors hover:bg-neutral-200 md:px-5 md:py-2.5 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-white/60"
              >
                {ctaText}
              </a>
              <a
                href={secondaryHref}
                className="inline-flex items-center rounded-md bg-white/20 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/30 md:px-5 md:py-2.5 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-white/40"
              >
                {secondaryText}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
