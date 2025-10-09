"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "components/ui/accordion";

type QA = { q: string; a: string };

const faqs: QA[] = [
  {
    q: "Do you accept returns?",
    a: "All sales are final for sealed and collectible products. In rare, extreme cases (wrong item, significant undisclosed defect, severe transit damage) contact us within 3 days of delivery and we will work toward a fair resolution.",
  },
  {
    q: "When will my order ship?",
    a: "Most in‑stock orders ship within 1–3 business days. During launches or peak periods, processing may take longer. You'll receive tracking when your order ships.",
  },
  {
    q: "How do pre‑orders work?",
    a: "Pre‑orders ship on or after the official release date. Orders with both in‑stock and pre‑order items may ship together when all items are available unless otherwise noted.",
  },
  {
    q: "Can I change my address after placing an order?",
    a: "Please contact us as soon as possible. If the order hasn't shipped, we’ll try to help. Once a parcel is with the carrier, address changes are not guaranteed.",
  },
  {
    q: "Which payment methods do you take?",
    a: "We use secure payment providers (e.g., Shopify Payments, PayPal). Supported methods shown at checkout are available for your region.",
  },
  {
    q: "How do I create or access my account?",
    a: "Use the Sign In link in the header. We use Shopify Customer Accounts for secure authentication.",
  },
  {
    q: "My parcel arrived damaged—what do I do?",
    a: "Take photos of the outer box, labels and product immediately and contact us within 3 days of delivery. Keep all packaging while we assist with a carrier claim.",
  },
];

export default function FAQ() {
  return (
    <section className="mx-auto max-w-(--breakpoint-2xl) px-4 py-10">
      <h1 className="mb-6 text-3xl font-bold text-foreground md:text-4xl">
        Frequently Asked Questions
      </h1>

      <div className="mx-auto w-full max-w-3xl">
        <Accordion
          type="single"
          collapsible
          className="w-full"
          defaultValue="item-0"
        >
          {faqs.map((item, idx) => (
            <AccordionItem key={idx} value={`item-${idx}`}>
              <AccordionTrigger>{item.q}</AccordionTrigger>
              <AccordionContent>{item.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
