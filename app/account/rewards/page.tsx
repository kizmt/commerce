/**
 * Loyalty/Rewards Page
 *
 * Dedicated page for customers to view and redeem loyalty points
 */

import LoadingDots from "@/components/loading-dots";
import { VoucherRedemption } from "@/components/loyalty/voucher-redemption";
import { LoyaltyProvider } from "@/components/loyalty/loyalty-context";
import { Suspense } from "react";

// Make this page dynamic since it requires user authentication
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Loyalty Rewards",
  description: "Redeem your loyalty points for exclusive discounts",
};

function RedemptionContent() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Loyalty Rewards</h1>
        <p className="mt-2 text-neutral-600 dark:text-neutral-400">
          Earn points with every purchase and redeem them for exclusive discount
          codes
        </p>
      </div>

      <VoucherRedemption />
    </div>
  );
}

export default function LoyaltyPage() {
  return (
    <LoyaltyProvider>
      <Suspense
        fallback={
          <div className="flex min-h-screen items-center justify-center">
            <LoadingDots className="bg-black dark:bg-white" />
          </div>
        }
      >
        <RedemptionContent />
      </Suspense>
    </LoyaltyProvider>
  );
}
