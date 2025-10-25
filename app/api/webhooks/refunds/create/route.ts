/**
 * Shopify Webhook Handler: Refunds Create
 *
 * Reverses loyalty points when a refund is processed
 * - Subtracts points proportionally to refund amount
 * - Only processes if points were originally awarded
 */

import { verifyShopifyWebhook } from "@/lib/shopify/admin";
import {
  calculatePointsForOrder,
  getOrderAwardedPoints,
  subtractCustomerPoints,
} from "@/lib/shopify/points";
import { NextRequest, NextResponse } from "next/server";

interface ShopifyRefundWebhook {
  id: number;
  order_id: number;
  created_at: string;
  note: string;
  refund_line_items: Array<{
    id: number;
    quantity: number;
    line_item_id: number;
    subtotal: number;
  }>;
  transactions: Array<{
    id: number;
    amount: string;
    kind: string;
    status: string;
  }>;
  order_adjustments: Array<{
    id: number;
    amount: string;
    kind: string;
  }>;
}

interface ShopifyRefundWithOrder extends ShopifyRefundWebhook {
  order?: {
    id: number;
    customer?: {
      id: number;
      email: string;
    };
    currency: string;
  };
}

export async function POST(request: NextRequest) {
  try {
    // Verify webhook authenticity
    const body = await request.text();
    const hmac = request.headers.get("x-shopify-hmac-sha256");

    if (!verifyShopifyWebhook(body, hmac)) {
      console.error("Refund webhook verification failed");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const refund: ShopifyRefundWithOrder = JSON.parse(body);
    const orderId = refund.order_id.toString();

    // Get customer info from order
    // Note: In a real webhook, you might need to fetch the order separately
    // as refund webhooks don't always include full order details
    if (!refund.order?.customer?.id) {
      console.log(
        `Refund for order ${orderId}: No customer attached, skipping`,
      );
      return NextResponse.json({
        message: "No customer attached to order",
        refundId: refund.id,
        orderId,
      });
    }

    const customerId = refund.order.customer.id.toString();

    // Get the points that were originally awarded for this order
    const originalPointsAwarded = await getOrderAwardedPoints(orderId);

    if (originalPointsAwarded <= 0) {
      console.log(
        `Refund for order ${orderId}: No points were originally awarded`,
      );
      return NextResponse.json({
        message: "No points were awarded for this order",
        refundId: refund.id,
        orderId,
      });
    }

    // Calculate refund amount
    const refundAmount = refund.refund_line_items.reduce(
      (sum, item) => sum + item.subtotal,
      0,
    );

    // Calculate points to subtract based on refund amount
    const pointsToSubtract = calculatePointsForOrder(
      refundAmount,
      refund.order.currency || "JPY",
    );

    if (pointsToSubtract <= 0) {
      console.log(`Refund for order ${orderId}: No points to subtract`);
      return NextResponse.json({
        message: "No points to subtract",
        refundId: refund.id,
        orderId,
        refundAmount,
      });
    }

    // Subtract points from customer
    const newBalance = await subtractCustomerPoints(
      customerId,
      pointsToSubtract,
    );

    console.log(
      `Refund ${refund.id}: Subtracted ${pointsToSubtract} points from customer ${customerId}. New balance: ${newBalance}`,
    );

    return NextResponse.json({
      success: true,
      refundId: refund.id,
      orderId,
      customerId,
      pointsSubtracted: pointsToSubtract,
      newBalance,
    });
  } catch (error) {
    console.error("Error processing refund webhook:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
