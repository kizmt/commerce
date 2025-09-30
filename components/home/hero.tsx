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
              imageSrc="/mtgavatarb.jpg"
              imageAlt="Avatar banner"
            eyebrow="Pre‑order Now"
            title="Avatar x Magic: The Gathering"
            description="Secure boosters and bundles before release. Limited quantities."
            ctaHref="/search/pre-order"
            ctaText="Pre‑Order Avatar Set"
            secondaryHref="/search/magic-the-gathering"
            secondaryText="Browse MTG"
            />
          </CarouselItem>
          <CarouselItem>
            <Slide
              imageSrc="/flames.jpg"
              imageAlt="Pokémon banner"
              eyebrow="Shop Pokemon"
              title="Discover Top Singles and Sealed Product"
              description="Shop best‑sellers and new arrivals from your favorite TCGs."
              ctaHref="/search/pokemon"
              ctaText="Browse Catalog"
              secondaryHref="/search/pokemon"
              secondaryText="Top Sellers"
            />
          </CarouselItem>
          <CarouselItem>
            <Slide
              imageSrc="/prb-02.jpg"
              imageAlt="One Piece/DBS banner"
              eyebrow="Just Released"
              title="One Piece PRB-02"
              description="Secure launch‑day products for upcoming sets before they sell out."
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
  ctaHref: string;
  ctaText: string;
  secondaryHref: string;
  secondaryText: string;
}) {
  return (
    <div className="relative h-[340px] w-full overflow-hidden md:h-[460px]">
      <Image
        src={imageSrc}
        alt={imageAlt}
        fill
        priority={true}
        className="object-cover"
        sizes="(min-width: 1024px) 100vw, 100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
      <div className="relative z-10 mx-auto h-full w-full max-w-(--breakpoint-2xl) px-6 py-10 md:px-12 md:py-14">
        <div className="flex h-full max-w-2xl flex-col justify-between">
          <div>
            <Card className="mb-3 w-fit bg-white/85 px-3 py-1 text-black dark:bg-black/60 dark:text-white">
              <span className="text-xs font-semibold uppercase tracking-widest md:text-sm">
                {eyebrow}
              </span>
            </Card>
            {title?.trim() ? (
              <Card className="mb-3 w-fit bg-white/35 px-3 py-2 text-black dark:bg-black/60 dark:text-white">
                <h2 className="text-3xl font-extrabold leading-tight tracking-tight md:text-5xl">
                  {title}
                </h2>
              </Card>
            ) : null}
          </div>
          <div className="mt-6 flex flex-wrap gap-3 pb-2">
            <a
              href={ctaHref}
              className="inline-flex items-center rounded-md bg-white px-5 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-neutral-200 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-white/60"
            >
              {ctaText}
            </a>
            <a
              href={secondaryHref}
              className="inline-flex items-center rounded-md border border-white/80 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-white/40"
            >
              {secondaryText}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
