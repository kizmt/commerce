"use client";

import clsx from "clsx";
import * as React from "react";

type CarouselContextType = {
  index: number;
  setIndex: (i: number) => void;
  count: number;
  setCount: (c: number) => void;
};

const CarouselContext = React.createContext<CarouselContextType | null>(null);

export function Carousel({
  children,
  autoPlay = true,
  intervalMs = 5000,
  className,
}: {
  children: React.ReactNode;
  autoPlay?: boolean;
  intervalMs?: number;
  className?: string;
}) {
  const [index, setIndex] = React.useState(0);
  const [count, setCount] = React.useState(React.Children.count(children));

  React.useEffect(() => {
    if (!autoPlay || count <= 1) return;
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % count);
    }, intervalMs);
    return () => clearInterval(id);
  }, [autoPlay, intervalMs, count]);

  return (
    <CarouselContext.Provider value={{ index, setIndex, count, setCount }}>
      <div className={clsx("relative", className)}>{children}</div>
    </CarouselContext.Provider>
  );
}

export function CarouselContent({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ctx = React.useContext(CarouselContext)!;
  const slides = React.Children.count(children);
  const safeSlides = Math.max(1, slides);
  const widthPercent = 100 * safeSlides;
  // Ensure the provider knows the actual number of slides inside CarouselContent
  React.useEffect(() => {
    if (slides && slides !== ctx.count) {
      ctx.setCount(slides);
    }
  }, [slides, ctx]);
  return (
    <div className={clsx("overflow-hidden", className)}>
      <div
        className="flex transition-transform duration-500 ease-out"
        style={{
          width: `${widthPercent}%`,
          transform: `translateX(-${(100 / safeSlides) * ctx.index}%)`,
        }}
      >
        {React.Children.map(children, (child) => (
          <div
            className="w-full flex-none"
            style={{ width: `${100 / safeSlides}%` }}
          >
            {child}
          </div>
        ))}
      </div>
    </div>
  );
}

export function CarouselItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={clsx("h-full", className)}>{children}</div>;
}

function useCarousel() {
  const ctx = React.useContext(CarouselContext);
  if (!ctx) throw new Error("Carousel controls must be used within <Carousel>");
  return ctx;
}

export function CarouselPrevious({ className }: { className?: string }) {
  const { index, setIndex, count } = useCarousel();
  return (
    <button
      aria-label="Previous slide"
      onClick={() => setIndex((index - 1 + count) % count)}
      className={clsx(
        "absolute left-2 top-1/2 -translate-y-1/2 rounded-full border border-neutral-300 bg-white/80 px-3 py-2 text-sm backdrop-blur transition hover:bg-white dark:border-neutral-700 dark:bg-black/60 dark:hover:bg-black",
        className,
      )}
    >
      ‹
    </button>
  );
}

export function CarouselNext({ className }: { className?: string }) {
  const { index, setIndex, count } = useCarousel();
  return (
    <button
      aria-label="Next slide"
      onClick={() => setIndex((index + 1) % count)}
      className={clsx(
        "absolute right-2 top-1/2 -translate-y-1/2 rounded-full border border-neutral-300 bg-white/80 px-3 py-2 text-sm backdrop-blur transition hover:bg-white dark:border-neutral-700 dark:bg-black/60 dark:hover:bg-black",
        className,
      )}
    >
      ›
    </button>
  );
}

export function CarouselIndicators({ className }: { className?: string }) {
  const { index, setIndex, count } = useCarousel();
  return (
    <div
      className={clsx(
        "absolute bottom-3 left-0 right-0 flex justify-center gap-2",
        className,
      )}
    >
      {Array.from({ length: count }).map((_, i) => (
        <button
          key={i}
          aria-label={`Go to slide ${i + 1}`}
          onClick={() => setIndex(i)}
          className={clsx(
            "h-1.5 w-6 rounded-full transition",
            i === index
              ? "bg-neutral-900 dark:bg-neutral-200"
              : "bg-neutral-300 dark:bg-neutral-700",
          )}
        />
      ))}
    </div>
  );
}
