import Prose from "components/prose";

export const metadata = {
  title: "Returns Policy",
  description:
    "Our policy on returns, exchanges, and resolutions when something goes wrong.",
};

function render() {
  const html = `
  <h1>Returns Policy</h1>
  <p>Last updated: ${new Date().toISOString().slice(0, 10)}</p>

  <p>We work hard to ensure every order arrives as expected and that products are represented accurately. Because our products are collectibles and sealed items, <strong>we very rarely accept returns</strong>. In exceptional cases where something has gone seriously wrong, we will work with you to find a fair resolution.</p>

  <h2>General Policy</h2>
  <ul>
    <li>All sales are considered final.</li>
    <li>Returns are only considered for extreme cases (e.g., wrong item received, severe transit damage, or significant defects not disclosed).</li>
    <li>Any approved remedy will be at our discretion and may include replacement, repair, partial refund, store credit, or another reasonable solution.</li>
  </ul>

  <h2>Eligibility & Timeframes</h2>
  <ul>
    <li>You must contact us within <strong>3 days</strong> of delivery for transit damage or order issues. Claims outside this window may not be eligible.</li>
    <li>Provide your order number, photos of the product and packaging, and a clear description of the issue.</li>
    <li>Items must be in the <strong>original condition</strong> received. Sealed products must remain sealed and unopened.</li>
  </ul>

  <h2>Non-Returnable Items</h2>
  <ul>
    <li>Opened or tampered sealed products, booster packs/boxes, or singles removed from original packaging.</li>
    <li>Items with minor cosmetic imperfections to outer packaging that do not affect the contents.</li>
    <li>Made-to-order, special orders, or clearance/final sale items.</li>
  </ul>

  <h2>Damages & Carrier Issues</h2>
  <p>If your parcel arrives damaged, keep all packaging and take photos immediately. We will assist with a carrier claim and advise next steps. Carrier investigations and timelines are outside our control.</p>

  <h2>Returns Process (if approved)</h2>
  <ol>
    <li>We will provide return instructions and an RMA if a return is authorized.</li>
    <li>Items must be returned in original condition with all accessories, packaging, and inserts.</li>
    <li>Unless required by law or agreed by us, <strong>return shipping costs are your responsibility</strong>. We recommend tracked and insured shipping.</li>
    <li>Returned items are inspected on receipt. If approved, refunds are typically issued as <strong>store credit</strong>. Monetary refunds are rare and provided only when required by law or expressly stated.</li>
  </ol>

  <h2>Pre-Orders & Allocation</h2>
  <p>Release dates and allocations are set by distributors/manufacturers and may change. If an item is short-allocated, we may adjust or cancel affected quantities and offer a refund or store credit.</p>

  <h2>Incorrect Address & Unclaimed Parcels</h2>
  <p>Please ensure your shipping details are accurate. Orders returned to us due to incorrect address or unclaimed delivery may incur reshipment fees. If the order is cancelled, a handling fee and shipping costs may be deducted.</p>

  <h2>Customer Support</h2>
  <p>We aim to uphold the highest standards with every customer. If something goes seriously wrong with your order, please contact us and we will work towards a fair resolution.</p>
  <p>Contact: <a href="mailto:turtleislandcards@gmail.com">turtleislandcards@gmail.com</a></p>
  `;

  return (
    <section className="mx-auto max-w-(--breakpoint-2xl) px-4 py-10">
      <Prose html={html} />
    </section>
  );
}

export default function ReturnsPage() {
  return render();
}


