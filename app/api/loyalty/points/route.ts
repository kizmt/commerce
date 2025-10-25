/**
 * API Route: Get Customer Points
 *
 * Returns the authenticated customer's current points balance
 */

import {
  getAvailableVouchers,
  getCustomerPoints,
  getNextVoucherLevel,
} from "@/lib/shopify/points";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Get customer ID from session
    const cookieStore = await cookies();
    const customerAccessToken = cookieStore.get("customer_access_token")?.value;

    if (!customerAccessToken) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const customerIdCookie = cookieStore.get("customer_id")?.value;

    if (!customerIdCookie) {
      return NextResponse.json(
        { error: "Customer ID not found in session" },
        { status: 401 },
      );
    }

    const customerId = customerIdCookie;

    // Get customer's points
    const points = await getCustomerPoints(customerId);
    const availableVouchers = getAvailableVouchers(points);
    const nextLevel = getNextVoucherLevel(points);

    return NextResponse.json({
      points,
      availableVouchers,
      nextLevel,
    });
  } catch (error) {
    console.error("Error fetching customer points:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch points",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
