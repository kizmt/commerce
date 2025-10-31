import Prose from "components/prose";
import { baseUrl } from "lib/utils";

export const metadata = {
  title: "Terms of Use",
  description:
    "Terms and conditions for purchasing TCG products from Turtle Island in New Zealand. Read our terms for orders, payments, shipping, and returns.",
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: `${baseUrl}/terms`,
  },
};

function render() {
  const html = `
  <h1>Terms of Use</h1>
  <p>Last updated: ${new Date().toISOString().slice(0, 10)}</p>

  <h2>Agreement to Terms</h2>
  <p>By accessing or using this website, you agree to be bound by these Terms. If you do not agree, do not use the site.</p>

  <h2>Accounts and Customer Authentication</h2>
  <p>You may create or sign in to a customer account powered by Shopify Customer Accounts. You are responsible for maintaining the confidentiality of your login information and for all activities under your account.</p>

  <h2>Orders, Pricing, and Availability</h2>
  <ul>
    <li>Prices, promotions, and product availability are subject to change without notice.</li>
    <li>We may limit or cancel quantities purchased per person, per household, or per order.</li>
    <li>We reserve the right to refuse or cancel any order if suspected of fraud or unauthorized activity.</li>
  </ul>

  <h2>Payments</h2>
  <p>Payments are processed by our payment providers. By submitting payment information, you represent that you are authorized to use the payment method and authorize us (and our payment processors) to charge the order total.</p>

  <h2>Shipping and Risk of Loss</h2>
  <p>Orders ship to the address you provide. Risk of loss passes to you upon our delivery to the carrier.</p>

  <h2>Returns and Refunds</h2>
  <p>Please see our returns policy (if provided) or contact us for assistance. Certain items may be final sale.</p>

  <h2>Acceptable Use</h2>
  <p>You agree not to misuse the site, interfere with its operation, or attempt unauthorized access. You may not use the site for any unlawful purpose.</p>

  <h2>Intellectual Property</h2>
  <p>All content, trademarks, and logos on the site are our property or that of our licensors and are protected by applicable laws. You may not reproduce, distribute, or create derivative works without permission.</p>

  <h2>Third-Party Services</h2>
  <p>The site may integrate with third-party services (e.g., Shopify, payment processors). Your use of these services is subject to their terms and privacy policies.</p>

  <h2>Disclaimer of Warranties</h2>
  <p>The site and all content are provided "as is" and "as available" without warranties of any kind, express or implied.</p>

  <h2>Limitation of Liability</h2>
  <p>To the fullest extent permitted by law, we shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues.</p>

  <h2>Indemnification</h2>
  <p>You agree to indemnify and hold us harmless from any claims arising out of your use of the site or violation of these Terms.</p>

  <h2>Changes to These Terms</h2>
  <p>We may update these Terms from time to time. Continued use of the site after changes indicates acceptance of the revised Terms.</p>

  <h2>Contact Us</h2>
  <p>If you have questions about these Terms, contact us at <a href="mailto:turtleislandcards@gmail.com">turtleislandcards@gmail.com</a>.</p>
  `;

  return (
    <section className="mx-auto max-w-(--breakpoint-2xl) px-4 py-10">
      <Prose html={html} />
    </section>
  );
}

export default function TermsPage() {
  return render();
}
