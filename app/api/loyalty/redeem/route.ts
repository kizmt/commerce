/**
 * API Route: Redeem Points
 * 
 * Allows authenticated customers to redeem points for discount codes
 * - Validates customer has sufficient points
 * - Creates discount code via Shopify Admin API
 * - Subtracts points from customer balance
 */

import {
    createVoucherDiscountCode,
    getCustomerPoints,
    subtractCustomerPoints,
    VOUCHER_LEVELS
} from '@/lib/shopify/points';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

interface RedeemRequest {
  voucherPoints: number;
}

export async function POST(request: NextRequest) {
  try {
    // Get customer ID from session
    const cookieStore = await cookies();
    const customerAccessToken = cookieStore.get('customer_access_token')?.value;

    if (!customerAccessToken) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 },
      );
    }

    // Decode customer ID from token (simplified - in production you'd verify the token)
    // For now, we'll expect the customer ID to be passed or extracted from a verified session
    const customerIdCookie = cookieStore.get('customer_id')?.value;
    
    if (!customerIdCookie) {
      return NextResponse.json(
        { error: 'Customer ID not found in session' },
        { status: 401 },
      );
    }

    const customerId = customerIdCookie;

    // Parse request body
    const body: RedeemRequest = await request.json();
    const { voucherPoints } = body;

    // Validate voucher level exists
    const voucherLevel = VOUCHER_LEVELS.find(
      (level) => level.points === voucherPoints,
    );

    if (!voucherLevel) {
      return NextResponse.json(
        { error: 'Invalid voucher level' },
        { status: 400 },
      );
    }

    // Check customer has sufficient points
    const currentPoints = await getCustomerPoints(customerId);

    if (currentPoints < voucherLevel.points) {
      return NextResponse.json(
        {
          error: 'Insufficient points',
          required: voucherLevel.points,
          available: currentPoints,
        },
        { status: 400 },
      );
    }

    // Create discount code
    const discountCode = await createVoucherDiscountCode(customerId, voucherLevel);

    // Subtract points from customer balance
    const newBalance = await subtractCustomerPoints(customerId, voucherLevel.points);

    console.log(
      `Customer ${customerId} redeemed ${voucherLevel.points} points for code ${discountCode}. New balance: ${newBalance}`,
    );

    return NextResponse.json({
      success: true,
      discountCode,
      pointsRedeemed: voucherLevel.points,
      discountValue: voucherLevel.value,
      newBalance,
    });
  } catch (error) {
    console.error('Error redeeming points:', error);
    return NextResponse.json(
      {
        error: 'Failed to redeem points',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}

