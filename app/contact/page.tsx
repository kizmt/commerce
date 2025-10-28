import Prose from "components/prose";
import { baseUrl } from "lib/utils";

export const metadata = {
  title: "Contact Us",
  description:
    "Contact Turtle Island Cards for TCG product inquiries, order support, and event information. Based in Auckland, New Zealand. Email: turtleislandcards@gmail.com | Phone: 022 353 7438",
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: `${baseUrl}/contact`,
  },
};

function render() {
  const html = `
  <h1>Contact Us</h1>
  <p>We’re happy to help with product questions, orders, and events.</p>

  <h2>Email</h2>
  <p><a href="mailto:turtleislandcards@gmail.com">turtleislandcards@gmail.com</a></p>

  <h2>Phone</h2>
  <p>Scott — <a href="tel:+64223537438">022 353 7438</a></p>

  <h2>Store Address</h2>
  <p>Coming soon</p>
  `;

  return (
    <section className="mx-auto max-w-(--breakpoint-2xl) px-4 py-10">
      <Prose html={html} />
    </section>
  );
}

export default function ContactPage() {
  return render();
}
