import FAQ from "components/faq";
import { baseUrl } from "lib/utils";

export const metadata = {
  title: "FAQ - Frequently Asked Questions",
  description:
    "Common questions about buying TCG products from Turtle Island NZ. Shipping, returns, pre-orders, payment methods, and customer accounts.",
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: `${baseUrl}/faq`,
  },
};

export default function FaqPage() {
  return <FAQ />;
}
