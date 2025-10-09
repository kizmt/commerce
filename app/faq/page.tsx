import FAQ from "components/faq";

export const metadata = {
  title: "FAQ - Frequently Asked Questions",
  description:
    "Common questions about buying TCG products from Turtle Island Cards NZ. Shipping, returns, pre-orders, payment methods, and customer accounts.",
  robots: {
    index: true,
    follow: true,
  },
};

export default function FaqPage() {
  return <FAQ />;
}
