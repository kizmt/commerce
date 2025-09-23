import { Carousel, CarouselContent, CarouselIndicators, CarouselItem } from 'components/ui/carousel';

export default function Hero() {
  return (
    <section className="relative mx-auto mb-8 w-full max-w-(--breakpoint-2xl) overflow-hidden rounded-xl border border-neutral-200 bg-gradient-to-br from-neutral-50 to-white dark:border-neutral-800 dark:from-neutral-950 dark:to-black">
      <Carousel className="px-6 py-12 md:px-12 md:py-16">
        <CarouselContent>
          <CarouselItem>
            <Slide
              eyebrow="Welcome to your TCG HQ"
              title="Cards, Sealed Product, and Pre‑Orders — All in One Place"
              description="Browse the latest arrivals, secure upcoming releases, and complete your collection with a curated selection of trading cards and accessories."
              ctaHref="/search"
              ctaText="Shop All Products"
              secondaryHref="/search?q=pre-order"
              secondaryText="View Pre‑Orders"
            />
          </CarouselItem>
          <CarouselItem>
            <Slide
              eyebrow="Magic • Pokémon • One Piece • Dragon Ball"
              title="Discover Top Singles and Sealed Product"
              description="Shop best‑sellers and new arrivals from your favorite TCGs."
              ctaHref="/search"
              ctaText="Browse Catalog"
              secondaryHref="/search?sort=best-selling"
              secondaryText="Top Sellers"
            />
          </CarouselItem>
          <CarouselItem>
            <Slide
              eyebrow="Pre‑Orders Open"
              title="Lock In Upcoming Releases Now"
              description="Secure launch‑day products for upcoming sets before they sell out."
              ctaHref="/search?q=pre-order"
              ctaText="Shop Pre‑Orders"
              secondaryHref="/search"
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
  eyebrow,
  title,
  description,
  ctaHref,
  ctaText,
  secondaryHref,
  secondaryText
}: {
  eyebrow: string;
  title: string;
  description: string;
  ctaHref: string;
  ctaText: string;
  secondaryHref: string;
  secondaryText: string;
}) {
  return (
    <div className="relative">
      <div className="max-w-2xl">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-neutral-500 md:text-sm dark:text-neutral-400">
          {eyebrow}
        </p>
        <h1 className="mb-4 text-4xl font-extrabold leading-tight tracking-tight md:text-5xl">{title}</h1>
        <p className="mb-6 max-w-prose text-neutral-600 md:text-lg dark:text-neutral-300">{description}</p>
        <div className="flex flex-wrap gap-3">
          <a
            href={ctaHref}
            className="inline-flex items-center rounded-md bg-black px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-neutral-800 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-neutral-400 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
          >
            {ctaText}
          </a>
          <a
            href={secondaryHref}
            className="inline-flex items-center rounded-md border border-neutral-300 px-5 py-2.5 text-sm font-semibold text-neutral-900 transition-colors hover:bg-neutral-100 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-neutral-400 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-900"
          >
            {secondaryText}
          </a>
        </div>
      </div>
      <div className="pointer-events-none absolute -right-24 -top-24 aspect-square w-72 rounded-full bg-gradient-to-br from-indigo-500/10 via-fuchsia-500/10 to-amber-500/10 blur-3xl md:-right-16 md:-top-16 md:w-96 dark:from-indigo-500/15 dark:via-fuchsia-500/15 dark:to-amber-500/15" />
    </div>
  );
}


