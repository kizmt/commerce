/**
 * API Route: Update Customer Profile
 *
 * Updates customer information via Shopify Customer Account API
 */

import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const SHOPIFY_CUSTOMER_API_VERSION = "2025-01";

interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  defaultAddress?: {
    address1?: string;
    address2?: string;
    city?: string;
    provinceCode?: string;
    zip?: string;
    countryCode?: string;
  };
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("customer_access_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body: UpdateProfileRequest = await request.json();

    const shopDomain = process.env.SHOPIFY_STORE_DOMAIN?.replace(
      /^https?:\/\//,
      "",
    );
    const endpoint = `https://${shopDomain}/account/customer/api/${SHOPIFY_CUSTOMER_API_VERSION}/graphql`;

    // Build mutation based on what's being updated
    const mutation = `
      mutation customerUpdate($input: CustomerUpdateInput!) {
        customerUpdate(input: $input) {
          customer {
            id
            firstName
            lastName
            defaultAddress {
              address1
              address2
              city
              provinceCode
              zip
              countryCode
            }
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    const variables = {
      input: {
        ...(body.firstName !== undefined && { firstName: body.firstName }),
        ...(body.lastName !== undefined && { lastName: body.lastName }),
        ...(body.defaultAddress && { defaultAddress: body.defaultAddress }),
      },
    };

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        query: mutation,
        variables,
      }),
    });

    const data = await response.json();

    if (data.errors) {
      return NextResponse.json(
        { error: "Failed to update profile", details: data.errors },
        { status: 400 },
      );
    }

    if (data.data?.customerUpdate?.userErrors?.length > 0) {
      return NextResponse.json(
        {
          error: "Validation error",
          details: data.data.customerUpdate.userErrors,
        },
        { status: 400 },
      );
    }

    return NextResponse.json({
      success: true,
      customer: data.data.customerUpdate.customer,
    });
  } catch (error) {
    console.error("Error updating customer profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
