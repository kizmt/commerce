import Prose from "components/prose";

export const metadata = {
  title: "Shipping Policy",
  description: "Information about order processing, shipping, and delivery.",
};

function render() {
  const html = `
  <h1>Shipping Policy</h1>
  <p>Last updated: ${new Date().toISOString().slice(0, 10)}</p>

  <h2>Processing Times</h2>
  <ul>
    <li>Orders are typically processed within <strong>1–3 business days</strong>.</li>
    <li>During product launches, holidays, or high-volume periods, processing may take longer.</li>
  </ul>

  <h2>Shipping Methods & Estimates</h2>
  <ul>
    <li>We ship with reputable carriers and provide tracking where available.</li>
    <li>Delivery timeframes shown at checkout are estimates provided by the carrier and are not guaranteed.</li>
    <li>Free shipping promotions apply as stated (e.g., within New Zealand over a given order value) and may exclude oversized/large shipments.</li>
  </ul>

  <h2>Pre-Orders</h2>
  <p>Pre-order items ship on or after the official release date. If your order contains both in‑stock and pre‑order items, the order may ship together when all items are available, unless we specify otherwise.</p>

  <h2>Address Accuracy</h2>
  <p>Please ensure your shipping address is complete and accurate. We are not responsible for delays or losses due to incorrect or incomplete addresses. Orders returned to us may incur reshipment fees.</p>

  <h2>Risk of Loss</h2>
  <p>Risk of loss passes to you when the package is handed to the carrier. If your parcel is delayed or missing, contact us and we will assist with a carrier investigation.</p>

  <h2>Damaged Parcels</h2>
  <p>If your parcel arrives damaged, keep all packaging and take photos immediately. Contact us within <strong>3 days</strong> of delivery so we can help file a claim and advise next steps.</p>

  <h2>International Shipping</h2>
  <p>International customers are responsible for any customs duties, taxes, or import fees. We cannot control customs delays.</p>

  <h2>Questions</h2>
  <p>For shipping questions, contact <a href="mailto:turtleislandcards@gmail.com">turtleislandcards@gmail.com</a>.</p>
  `;

  return (
    <section className="mx-auto max-w-(--breakpoint-2xl) px-4 py-10">
      <Prose html={html} />
    </section>
  );
}

export default function ShippingPage() {
  return render();
}


