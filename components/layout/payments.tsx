"use client";

import Image from "next/image";

type Payment = {
  alt: string;
  src: string;
};

const payments: Payment[] = [
  { alt: "Visa", src: "/payments/visa.svg" },
  { alt: "MasterCard", src: "/payments/mastercard.svg" },
  { alt: "PayPal", src: "/payments/paypal.svg" },
  { alt: "Apple Pay", src: "/payments/apple-pay.svg" },
  { alt: "Google Pay", src: "/payments/google-pay.svg" },
  { alt: "Shop Pay", src: "/payments/shop-pay.svg" },
  { alt: "Afterpay", src: "/payments/afterpay.svg" },
  { alt: "NZD Bank Transfer", src: "/payments/bank-transfer.jpg" },
];

export default function FooterPayments() {
  return (
    <div className="w-full flex justify-end">
      <div className="grid grid-cols-4 gap-2 sm:gap-3">
        {payments.map((p) => (
          <span
            key={p.alt}
            className="inline-flex items-center justify-center rounded-md border border-neutral-200 bg-white p-1 shadow-sm dark:border-neutral-700 dark:bg-neutral-900"
            title={p.alt}
          >
            <Image
              src={p.src}
              alt={p.alt}
              width={38}
              height={24}
              className="h-6 w-auto"
              style={{ height: "30px", width: "62px" }}
              unoptimized={true}
            />
          </span>
        ))}
      </div>
    </div>
  );
}
