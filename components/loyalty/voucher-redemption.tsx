/**
 * Voucher Redemption Component
 *
 * Allows customers to redeem points for discount codes
 */

"use client";

import { useState } from "react";
import LoadingDots from "../loading-dots";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { useLoyalty } from "./loyalty-context";

interface RedemptionResult {
  discountCode: string;
  pointsRedeemed: number;
  discountValue: number;
}

export function VoucherRedemption() {
  const { points, availableVouchers, nextLevel, refreshPoints } = useLoyalty();
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [redemptionResult, setRedemptionResult] =
    useState<RedemptionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleRedeem = async (voucherPoints: number) => {
    if (isRedeeming) return;

    try {
      setIsRedeeming(true);
      setError(null);
      setRedemptionResult(null);

      const response = await fetch("/api/loyalty/redeem", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ voucherPoints }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to redeem points");
      }

      setRedemptionResult({
        discountCode: data.discountCode,
        pointsRedeemed: data.pointsRedeemed,
        discountValue: data.discountValue,
      });

      // Refresh points balance
      await refreshPoints();
    } catch (err) {
      console.error("Error redeeming points:", err);
      setError(err instanceof Error ? err.message : "Failed to redeem points");
    } finally {
      setIsRedeeming(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-6">
      {/* Current Balance */}
      <Card className="p-6">
        <div className="text-center">
          <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
            Your Points Balance
          </h3>
          <p className="mt-2 text-4xl font-bold">{points.toLocaleString()}</p>
        </div>

        {nextLevel && (
          <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-800">
            <p className="text-sm text-neutral-600 dark:text-neutral-400 text-center">
              {nextLevel.points - points} more points until {nextLevel.label}
            </p>
            <div className="mt-2 w-full bg-neutral-200 dark:bg-neutral-800 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{
                  width: `${Math.min((points / nextLevel.points) * 100, 100)}%`,
                }}
              />
            </div>
          </div>
        )}
      </Card>

      {/* Redemption Result */}
      {redemptionResult && (
        <Card className="p-6 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
          <div className="text-center space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-green-900 dark:text-green-100">
                🎉 Redemption Successful!
              </h3>
              <p className="mt-1 text-sm text-green-700 dark:text-green-300">
                You've redeemed{" "}
                {redemptionResult.pointsRedeemed.toLocaleString()} points
              </p>
            </div>

            <div className="p-4 bg-white dark:bg-neutral-900 rounded-lg border border-green-200 dark:border-green-800">
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">
                Your Discount Code
              </p>
              <p className="text-xl font-mono font-bold">
                {redemptionResult.discountCode}
              </p>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                Worth ¥{redemptionResult.discountValue.toLocaleString()}
              </p>
            </div>

            <Button
              onClick={() => copyToClipboard(redemptionResult.discountCode)}
              variant="secondary"
              className="w-full"
            >
              Copy Code
            </Button>

            <p className="text-xs text-green-700 dark:text-green-300">
              Valid for 90 days. Use at checkout!
            </p>
          </div>
        </Card>
      )}

      {/* Error Message */}
      {error && (
        <Card className="p-4 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
          <p className="text-sm text-red-700 dark:text-red-300 text-center">
            {error}
          </p>
        </Card>
      )}

      {/* Available Vouchers */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Redeem Points</h3>

        {availableVouchers.length === 0 ? (
          <Card className="p-6 text-center">
            <p className="text-neutral-600 dark:text-neutral-400">
              Keep shopping to earn more points and unlock vouchers!
            </p>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {availableVouchers.map((voucher) => (
              <Card key={voucher.points} className="p-4">
                <div className="flex flex-col h-full">
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg">{voucher.label}</h4>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                      Redeem {voucher.points.toLocaleString()} points
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-2">
                      Get a ¥{voucher.value.toLocaleString()} discount code
                    </p>
                  </div>

                  <Button
                    onClick={() => handleRedeem(voucher.points)}
                    disabled={isRedeeming || points < voucher.points}
                    className="w-full mt-4"
                  >
                    {isRedeeming ? (
                      <LoadingDots className="bg-white" />
                    ) : (
                      "Redeem"
                    )}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Info */}
      <Card className="p-4 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
        <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
          How it works
        </h4>
        <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
          <li>• Earn 1 point for every $1 spent</li>
          <li>• Points are awarded when your order is paid</li>
          <li>• Redeem points for discount codes</li>
          <li>• Discount codes are valid for 90 days</li>
        </ul>
      </Card>
    </div>
  );
}
