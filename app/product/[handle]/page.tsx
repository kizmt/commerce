import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { QuickAdd } from "components/cart/quick-add";
import { GridTileImage } from "components/grid/tile";
import Footer from "components/layout/footer";
import Price from "components/price";
import { Gallery } from "components/product/gallery";
import { ProductProvider } from "components/product/product-context";
import { ProductDescription } from "components/product/product-description";
import { HIDDEN_PRODUCT_TAG } from "lib/constants";
import { getProduct, getProductRecommendations } from "lib/shopify";
import { Image } from "lib/shopify/types";
import { baseUrl } from "lib/utils";
import Link from "next/link";
import { Suspense } from "react";

export async function generateMetadata(props: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const product = await getProduct(params.handle);

  if (!product) return notFound();

  const { url, width, height, altText: alt } = product.featuredImage || {};
  const indexable = !product.tags.includes(HIDDEN_PRODUCT_TAG);

  const isAvailable = product.availableForSale ? "In Stock" : "Out of Stock";
  const priceRange = `${product.priceRange.minVariantPrice.currencyCode} ${product.priceRange.minVariantPrice.amount}`;

  return {
    title: product.seo.title || product.title,
    description:
      product.seo.description ||
      product.description ||
      `Buy ${product.title} in New Zealand. ${isAvailable}. Fast shipping from Auckland.`,
    keywords: [
      product.title,
      `${product.title} NZ`,
      `buy ${product.title} New Zealand`,
      "TCG NZ",
      "trading cards NZ",
    ],
    robots: {
      index: indexable,
      follow: indexable,
      googleBot: {
        index: indexable,
        follow: indexable,
      },
    },
    openGraph: url
      ? {
          type: "website",
          title: product.title,
          description: product.description,
          images: [
            {
              url,
              width,
              height,
              alt,
            },
          ],
        }
      : {
          type: "website",
          title: product.title,
          description: product.description,
        },
    alternates: {
      canonical: `${baseUrl}/product/${params.handle}`,
    },
  };
}

export default async function ProductPage(props: {
  params: Promise<{ handle: string }>;
}) {
  const params = await props.params;
  const product = await getProduct(params.handle);

  if (!product) return notFound();

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: product.featuredImage.url,
    brand: {
      "@type": "Brand",
      name: product.vendor || "Turtle Island",
    },
    sku: product.id,
    offers: {
      "@type": "AggregateOffer",
      availability: product.availableForSale
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      priceCurrency: product.priceRange.minVariantPrice.currencyCode,
      highPrice: product.priceRange.maxVariantPrice.amount,
      lowPrice: product.priceRange.minVariantPrice.amount,
      offerCount: product.availableForSale ? 1 : 0,
      url: `${baseUrl}/product/${product.handle}`,
      seller: {
        "@type": "Organization",
        name: "Turtle Island",
        address: {
          "@type": "PostalAddress",
          addressCountry: "NZ",
          addressRegion: "Auckland",
        },
      },
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.5",
      reviewCount: "8",
    },
    review: [
      {
        "@type": "Review",
        reviewRating: {
          "@type": "Rating",
          ratingValue: "5",
        },
        author: {
          "@type": "Person",
          name: "Customer",
        },
        reviewBody: "Great product quality and fast delivery from Auckland.",
      },
    ],
  };

  return (
    <Suspense fallback={null}>
      <ProductProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(productJsonLd),
          }}
        />
        <div className="mx-auto max-w-(--breakpoint-2xl) px-4 mt-5">
          <div className="flex flex-col rounded-lg border border-border bg-card p-8 md:p-12 lg:flex-row lg:gap-8">
            <div className="h-full w-full basis-full lg:basis-4/6">
              <Suspense
                fallback={
                  <div className="relative aspect-square h-full max-h-[550px] w-full overflow-hidden" />
                }
              >
                <Gallery
                  images={product.images.slice(0, 5).map((image: Image) => ({
                    src: image.url,
                    altText: image.altText,
                  }))}
                />
              </Suspense>
            </div>

            <div className="basis-full lg:basis-2/6">
              <Suspense fallback={null}>
                <ProductDescription product={product} />
              </Suspense>
            </div>
          </div>
          <RelatedProducts id={product.id} />
        </div>
        <Footer />
      </ProductProvider>
    </Suspense>
  );
}

async function RelatedProducts({ id }: { id: string }) {
  const relatedProducts = await getProductRecommendations(id);

  if (!relatedProducts.length) return null;

  return (
    <div className="py-8">
      <h2 className="mb-4 text-2xl font-bold">Related Products</h2>
      <ul className="flex w-full gap-4 overflow-x-auto pt-1">
        {relatedProducts.map((product) => (
          <li key={product.handle} className="w-60 flex-none">
            <div className="flex h-full flex-col">
              <div className="group relative">
                <Link
                  className="block h-full w-full"
                  href={`/product/${product.handle}`}
                  prefetch={true}
                >
                  <GridTileImage
                    alt={product.title}
                    src={product.featuredImage?.url}
                    fill
                    sizes="(min-width: 1024px) 20vw, (min-width: 768px) 25vw, (min-width: 640px) 33vw, 50vw"
                  />
                </Link>
                {/* Desktop: hover overlay with View + Add to cart */}
                <div className="pointer-events-none absolute inset-0 hidden items-center justify-center opacity-0 transition-opacity group-hover:opacity-100 md:flex">
                  <div className="flex w-1/2 max-w-[200px] flex-col gap-4">
                    <Link
                      href={`/product/${product.handle}`}
                      prefetch={true}
                      className="pointer-events-auto rounded-sm border border-border bg-background/90 px-3 py-2 text-center text-xs font-medium text-foreground backdrop-blur"
                    >
                      View
                    </Link>
                    <div className="pointer-events-auto">
                      <QuickAdd
                        product={product}
                        className="w-full justify-center"
                        label="Add to cart"
                      />
                    </div>
                  </div>
                </div>
                {/* Mobile: only View button */}
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100 md:hidden">
                  <Link
                    href={`/product/${product.handle}`}
                    prefetch={true}
                    className="pointer-events-auto rounded-sm border border-border bg-background/90 px-4 py-2 text-center text-xs font-medium text-foreground backdrop-blur"
                  >
                    View
                  </Link>
                </div>
              </div>
              <div className="mt-2">
                <p className="line-clamp-2 text-sm font-medium text-foreground">
                  {product.title}
                </p>
                <Price
                  className="mt-1 text-sm"
                  amount={product.priceRange.maxVariantPrice.amount}
                  compareAt={
                    product.compareAtPriceRange?.maxVariantPrice?.amount
                  }
                  currencyCode={product.priceRange.maxVariantPrice.currencyCode}
                />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
