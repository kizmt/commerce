import { Analytics } from "@vercel/analytics/next";
import { CartProvider } from "components/cart/cart-context";
import { CurrencyProvider } from "components/currency/currency-context";
import { Navbar } from "components/layout/navbar";
import { GeistSans } from "geist/font/sans";
import { getCart } from "lib/shopify";
import { baseUrl } from "lib/utils";
import { ReactNode } from "react";
import "./globals.css";

const {
  SITE_NAME,
  TWITTER_CREATOR,
  TWITTER_SITE,
  NEXT_PUBLIC_GSC_VERIFICATION,
} = process.env;
const siteName = SITE_NAME || "Turtle Island";
const siteDescription =
  "New Zealand's premier TCG store for Magic: The Gathering, Pokémon, One Piece, Dragon Ball, Final Fantasy TCG and more. Buy trading cards, sealed products, singles, and collectibles with fast NZ shipping.";

export const metadata = {
  metadataBase: new URL(baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`),
  title: {
    default: `${siteName} | TCG Store NZ | Pokémon, MTG, One Piece and more`,
    template: `%s | ${siteName} TCG Store NZ`,
  },
  description: siteDescription,
  keywords: [
    "TCG NZ",
    "trading cards New Zealand",
    "Pokemon cards NZ",
    "Magic The Gathering NZ",
    "MTG NZ",
    "One Piece TCG NZ",
    "Dragon Ball Super Card Game NZ",
    "Final Fantasy TCG NZ",
    "TCG singles NZ",
    "sealed booster boxes NZ",
    "collectibles NZ",
    "trading card game store Auckland",
    "buy TCG cards online NZ",
    "pre-order TCG NZ",
  ],
  authors: [{ name: siteName }],
  creator: siteName,
  publisher: siteName,
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_NZ",
    alternateLocale: ["en_AU"],
    url: baseUrl,
    siteName,
    title: `${siteName} | TCG Store New Zealand`,
    description: siteDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteName} | TCG Store New Zealand`,
    description: siteDescription,
    creator: TWITTER_CREATOR,
    site: TWITTER_SITE,
  },
  robots: {
    follow: true,
    index: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  verification: NEXT_PUBLIC_GSC_VERIFICATION
    ? { google: NEXT_PUBLIC_GSC_VERIFICATION }
    : undefined,
  alternates: {
    canonical: baseUrl,
    languages: {
      "en-NZ": `${baseUrl}`,
      "en-AU": `${baseUrl}`,
      "en": `${baseUrl}`,
    },
  },
};

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  // Don't await the fetch, pass the Promise to the context provider
  const cart = getCart();

  return (
    <html lang="en" className={GeistSans.variable}>
      <head>
        {/* Hreflang tags for geo-targeting */}
        <link rel="alternate" hrefLang="en-NZ" href={baseUrl} />
        <link rel="alternate" hrefLang="en-AU" href={baseUrl} />
        <link rel="alternate" hrefLang="en" href={baseUrl} />
        <link rel="alternate" hrefLang="x-default" href={baseUrl} />
        
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Store",
              name: siteName,
              description: siteDescription,
              url: baseUrl,
              address: {
                "@type": "PostalAddress",
                addressCountry: "NZ",
                addressRegion: "Auckland",
                streetAddress: "Auckland",
              },
              geo: {
                "@type": "GeoCoordinates",
                latitude: "-37.0742",
                longitude: "174.6052",
              },
              areaServed: [
                {
                  "@type": "Country",
                  name: "NZ",
                },
                {
                  "@type": "Country",
                  name: "AU",
                },
              ],
              priceRange: "$$",
              telephone: "+64223537438",
              email: "info@turtleisland.co.nz",
              image: `${baseUrl}/turtleog.jpg`,
              sameAs: [
                "https://www.facebook.com/people/Turtle-Island/61583393482378/",
                "https://www.instagram.com/turtleislandtcg/",
              ],
            }),
          }}
        />
      </head>
      <body className="bg-neutral-50 text-black selection:bg-teal-300 dark:bg-neutral-900 dark:text-white dark:selection:bg-pink-500 dark:selection:text-white">
        <CurrencyProvider>
          <CartProvider cartPromise={cart}>
            <Navbar />
            <main>{children}</main>
          </CartProvider>
        </CurrencyProvider>
        <Analytics />
      </body>
    </html>
  );
}
