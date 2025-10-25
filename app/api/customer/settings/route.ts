/**
 * API Route: Update Customer Settings
 * 
 * Updates customer preferences via Shopify Customer Account API
 */

import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const SHOPIFY_CUSTOMER_API_VERSION = "2025-01";

interface UpdateSettingsRequest {
  acceptsMarketing?: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("customer_access_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body: UpdateSettingsRequest = await request.json();

    const shopDomain = process.env.SHOPIFY_STORE_DOMAIN?.replace(
      /^https?:\/\//,
      ""
    );
    const endpoint = `https://${shopDomain}/account/customer/api/${SHOPIFY_CUSTOMER_API_VERSION}/graphql`;

    const mutation = `
      mutation customerUpdate($input: CustomerUpdateInput!) {
        customerUpdate(input: $input) {
          customer {
            id
            acceptsMarketing
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
        acceptsMarketing: body.acceptsMarketing,
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
        { error: "Failed to update settings", details: data.errors },
        { status: 400 }
      );
    }

    if (data.data?.customerUpdate?.userErrors?.length > 0) {
      return NextResponse.json(
        {
          error: "Validation error",
          details: data.data.customerUpdate.userErrors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      customer: data.data.customerUpdate.customer,
    });
  } catch (error) {
    console.error("Error updating customer settings:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

