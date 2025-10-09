import Prose from "components/prose";

export const metadata = {
  title: "Privacy Policy",
  description: "How we collect, use, and protect your information.",
};

function render() {
  const html = `
  <h1>Privacy Policy</h1>
  <p>Last updated: ${new Date().toISOString().slice(0, 10)}</p>

  <p>This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and make purchases.</p>

  <h2>Information We Collect</h2>
  <ul>
    <li><strong>Account and Contact Data</strong>: name, email address, shipping/billing address, and phone number.</li>
    <li><strong>Order and Payment Data</strong>: products purchased, order totals, and payment status. Payments are processed by our payment providers; we do not store full card details.</li>
    <li><strong>Customer Account Authentication</strong>: we use Shopify Customer Accounts. Authentication tokens are stored as cookies as part of your session.</li>
    <li><strong>Usage Data</strong>: device/browser information, IP address, pages viewed, and interactions used to improve our site.</li>
    <li><strong>Cookies</strong>: functional cookies for cart, session, and preferences. See Cookies section below.</li>
  </ul>

  <h2>How We Use Your Information</h2>
  <ul>
    <li>To provide and fulfill orders, payments, shipping, and returns.</li>
    <li>To manage your account and customer authentication.</li>
    <li>To provide customer support and respond to inquiries.</li>
    <li>To personalize content and improve our products and services.</li>
    <li>To detect, prevent, and address fraud or security issues.</li>
    <li>To comply with legal obligations and enforce our terms.</li>
  </ul>

  <h2>Sharing Your Information</h2>
  <p>We share information with trusted service providers solely to operate our store:</p>
  <ul>
    <li><strong>Shopify</strong> for ecommerce platform, storefront APIs, and customer accounts.</li>
    <li><strong>Payment processors</strong> (e.g., Shopify Payments, PayPal) for secure payments.</li>
    <li><strong>Fulfillment and shipping partners</strong> to deliver your order.</li>
    <li><strong>Analytics/hosting</strong> providers to operate and improve the website.</li>
  </ul>
  <p>We do not sell your personal information.</p>

  <h2>International Transfers</h2>
  <p>Your data may be processed in countries other than your own. We rely on appropriate safeguards where required by law.</p>

  <h2>Data Retention</h2>
  <p>We retain your information only as long as necessary for the purposes outlined above, to comply with our legal obligations, resolve disputes, and enforce agreements.</p>

  <h2>Your Rights</h2>
  <p>Depending on your location, you may have rights to:</p>
  <ul>
    <li>Access, correct, or delete your personal information.</li>
    <li>Object to or restrict certain processing.</li>
    <li>Port your data to another service.</li>
    <li>Withdraw consent where processing is based on consent.</li>
  </ul>
  <p>To exercise these rights, contact us at <a href="mailto:turtleislandcards@gmail.com">turtleislandcards@gmail.com</a>.</p>

  <h2>Cookies</h2>
  <p>We use cookies and similar technologies for authentication (e.g., Shopify Customer Accounts), cart functionality, and analytics. You can control cookies through your browser settings; disabling some cookies may affect site functionality.</p>

  <h2>Security</h2>
  <p>We use administrative, technical, and physical safeguards designed to protect your information. No method of transmission or storage is 100% secure.</p>

  <h2>Children’s Privacy</h2>
  <p>Our services are not directed to children under 13. We do not knowingly collect personal information from children.</p>

  <h2>Changes to This Policy</h2>
  <p>We may update this Privacy Policy from time to time. We will post the new effective date at the top of this page.</p>

  <h2>Contact Us</h2>
  <p>If you have questions about this policy or our practices, contact us at <a href="mailto:turtleislandcards@gmail.com">turtleislandcards@gmail.com</a>.</p>
  `;

  return (
    <section className="mx-auto max-w-(--breakpoint-2xl) px-4 py-10">
      <Prose html={html} />
    </section>
  );
}

export default function PrivacyPage() {
  return render();
}


