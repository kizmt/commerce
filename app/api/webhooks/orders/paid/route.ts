/**
 * Shopify Webhook Handler: Orders Paid
 * 
 * Awards loyalty points when an order is paid
 * - Only awards points if customer is signed in
 * - Idempotent (won't double-award on webhook retries)
 * - Based on subtotal amount
 */

import { verifyShopifyWebhook } from '@/lib/shopify/admin';
import {
    addCustomerPoints,
    calculatePointsForOrder,
    hasOrderBeenAwarded,
    markOrderAsAwarded,
} from '@/lib/shopify/points';
import { NextRequest, NextResponse } from 'next/server';

interface ShopifyOrderWebhook {
  id: number;
  email: string;
  customer?: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
  };
  total_price: string;
  subtotal_price: string;
  total_tax: string;
  currency: string;
  financial_status: string;
  line_items: Array<{
    id: number;
    title: string;
    quantity: number;
    price: string;
  }>;
}

export async function POST(request: NextRequest) {
  try {
    // Verify webhook authenticity
    const body = await request.text();
    const hmac = request.headers.get('x-shopify-hmac-sha256');

    if (!verifyShopifyWebhook(body, hmac)) {
      console.error('Webhook verification failed');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 },
      );
    }

    const order: ShopifyOrderWebhook = JSON.parse(body);

    // Only award points if customer is logged in
    if (!order.customer?.id) {
      console.log(`Order ${order.id}: No customer attached, skipping points award`);
      return NextResponse.json({
        message: 'No customer attached to order',
        orderId: order.id,
      });
    }

    const customerId = order.customer.id.toString();
    const orderId = order.id.toString();

    // Check if points have already been awarded (idempotency)
    const alreadyAwarded = await hasOrderBeenAwarded(orderId);
    if (alreadyAwarded) {
      console.log(`Order ${orderId}: Points already awarded, skipping`);
      return NextResponse.json({
        message: 'Points already awarded for this order',
        orderId,
        customerId,
      });
    }

    // Calculate points based on subtotal
    const subtotalAmount = parseFloat(order.subtotal_price);
    const points = calculatePointsForOrder(subtotalAmount, order.currency);

    if (points <= 0) {
      console.log(`Order ${orderId}: No points to award (subtotal: ${subtotalAmount})`);
      await markOrderAsAwarded(orderId, 0);
      return NextResponse.json({
        message: 'No points to award',
        orderId,
        customerId,
        points: 0,
      });
    }

    // Award points to customer
    const newBalance = await addCustomerPoints(customerId, points);

    // Mark order as awarded to prevent duplicate awards
    await markOrderAsAwarded(orderId, points);

    console.log(
      `Order ${orderId}: Awarded ${points} points to customer ${customerId}. New balance: ${newBalance}`,
    );

    return NextResponse.json({
      success: true,
      orderId,
      customerId,
      pointsAwarded: points,
      newBalance,
    });
  } catch (error) {
    console.error('Error processing order webhook:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}

