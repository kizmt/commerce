import Footer from "components/layout/footer";
import { baseUrl } from "lib/utils";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about Turtle Island - New Zealand's premier trading card game store. Discover our story, mission, and passion for TCG in Auckland and across NZ.",
  keywords: [
    "about Turtle Island",
    "TCG store Auckland",
    "trading card store NZ",
    "about us TCG",
    "New Zealand card shop",
  ],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "About Turtle Island | Premier TCG Store NZ",
    description:
      "New Zealand's trusted source for trading cards. Learn about our journey and commitment to the TCG community.",
  },
  alternates: {
    canonical: `${baseUrl}/about`,
  },
};

export default function AboutPage() {
  return (
    <>
      <div className="mx-auto max-w-4xl px-4 py-12 md:py-16">
        <h1 className="mb-8 text-4xl font-bold">About Turtle Island</h1>

        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
            <p className="mb-4 text-neutral-700 dark:text-neutral-300 leading-relaxed">
              Welcome to Turtle Island, New Zealand's premier destination
              for trading card games and collectibles. Based in Auckland, we've
              built our reputation on providing exceptional service, competitive
              pricing, and a carefully curated selection of products for TCG
              enthusiasts across New Zealand.
            </p>
            <p className="mb-4 text-neutral-700 dark:text-neutral-300 leading-relaxed">
              Our journey began with a simple passion: bringing the joy of
              trading card games to collectors, players, and fans throughout
              Aotearoa. What started as a small endeavor has grown into a
              trusted source for Magic: The Gathering, Pokémon, One Piece,
              Dragon Ball Super, Final Fantasy TCG, and more.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">What We Offer</h2>
            <ul className="list-disc pl-6 mb-4 space-y-2 text-neutral-700 dark:text-neutral-300">
              <li>
                <strong>Wide Selection:</strong> From the latest booster boxes
                to hard-to-find singles, we stock a comprehensive range of TCG
                products
              </li>
              <li>
                <strong>Pre-Orders:</strong> Be the first to get new releases
                with our pre-order service
              </li>
              <li>
                <strong>Competitive Pricing:</strong> We strive to offer fair,
                competitive prices on all our products
              </li>
              <li>
                <strong>Fast NZ Shipping:</strong> Quick dispatch and reliable
                delivery across New Zealand
              </li>
              <li>
                <strong>Quality Guarantee:</strong> All singles are carefully
                inspected and accurately graded
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
            <p className="mb-4 text-neutral-700 dark:text-neutral-300 leading-relaxed">
              At Turtle Island, our mission is to support and grow the TCG
              community in New Zealand. Whether you're a competitive player
              building the perfect deck, a collector hunting down rare cards, or
              a newcomer discovering the hobby for the first time, we're here to
              help you on your journey.
            </p>
            <p className="mb-4 text-neutral-700 dark:text-neutral-300 leading-relaxed">
              We believe in fostering a welcoming, inclusive environment where
              everyone can share their passion for trading card games. Our team
              is dedicated to providing expert knowledge, friendly service, and
              a seamless shopping experience.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Get in Touch</h2>
            <p className="mb-4 text-neutral-700 dark:text-neutral-300 leading-relaxed">
              Have questions about a product? Looking for something specific?
              We'd love to hear from you!
            </p>
            <div className="bg-neutral-100 dark:bg-neutral-800 rounded-lg p-6 space-y-2">
              <p className="text-neutral-900 dark:text-neutral-100">
                <strong>Email:</strong>{" "}
                <a
                  href="mailto:turtleislandcards@gmail.com"
                  className="text-primary hover:underline"
                >
                  turtleislandcards@gmail.com
                </a>
              </p>
              <p className="text-neutral-900 dark:text-neutral-100">
                <strong>Phone:</strong>{" "}
                <a
                  href="tel:+64223537438"
                  className="text-primary hover:underline"
                >
                  +64 22 353 7438
                </a>
              </p>
              <p className="text-neutral-900 dark:text-neutral-100">
                <strong>Location:</strong> Auckland, New Zealand
              </p>
            </div>
          </section>

          <section>
            <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed italic">
              Thank you for choosing Turtle Island. We look forward to
              serving the TCG community and helping you find exactly what you're
              looking for!
            </p>
          </section>
        </div>
      </div>
      <Footer />
    </>
  );
}
