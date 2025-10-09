import { Analytics } from "@vercel/analytics/next";
import { CartProvider } from "components/cart/cart-context";
import { Navbar } from "components/layout/navbar";
import { GeistSans } from "geist/font/sans";
import { getCart } from "lib/shopify";
import { baseUrl } from "lib/utils";
import { ReactNode } from "react";
import "./globals.css";

const { SITE_NAME, TWITTER_CREATOR, TWITTER_SITE } = process.env;
const siteName = SITE_NAME || "Turtle Island Cards";
const siteDescription =
  "New Zealand's premier TCG store for Magic: The Gathering, Pokémon, One Piece, Dragon Ball, and Final Fantasy TCG. Buy trading cards, sealed products, singles, and collectibles with fast NZ shipping.";

export const metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: `${siteName} | TCG & Trading Cards NZ | Pokémon, MTG, One Piece`,
    template: `%s | ${siteName}`,
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
    url: baseUrl,
    siteName,
    title: `${siteName} | New Zealand's Premier TCG Store`,
    description: siteDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteName} | TCG & Trading Cards NZ`,
    description: siteDescription,
    creator: TWITTER_CREATOR,
    site: TWITTER_SITE,
  },
  robots: {
    follow: true,
    index: true,
  },
  alternates: {
    canonical: baseUrl,
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
              },
              geo: {
                "@type": "GeoCoordinates",
                addressCountry: "NZ",
              },
              priceRange: "$$",
              telephone: "+64223537438",
              email: "turtleislandcards@gmail.com",
            }),
          }}
        />
      </head>
      <body className="bg-neutral-50 text-black selection:bg-teal-300 dark:bg-neutral-900 dark:text-white dark:selection:bg-pink-500 dark:selection:text-white">
        <CartProvider cartPromise={cart}>
          <Navbar />
          <main>{children}</main>
        </CartProvider>
        <Analytics />
      </body>
    </html>
  );
}
