import { createHmac, timingSafeEqual } from "crypto";
import { TAGS } from "lib/constants";
import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest): Promise<NextResponse> {
  const collectionWebhooks = [
    "collections/create",
    "collections/delete",
    "collections/update",
  ];
  const productWebhooks = [
    "products/create",
    "products/delete",
    "products/update",
  ];

  const topic = req.headers.get("x-shopify-topic") || "unknown";
  const hmacHeader = req.headers.get("x-shopify-hmac-sha256") || "";
  const rawBody = await req.text();

  const webhookSecret =
    process.env.SHOPIFY_WEBHOOK_SECRET ||
    process.env.SHOPIFY_REVALIDATION_SECRET ||
    "";
  const legacySecret = req.nextUrl.searchParams.get("secret");

  let isHmacValid = false;
  if (webhookSecret) {
    try {
      const computed = createHmac("sha256", webhookSecret)
        .update(rawBody, "utf8")
        .digest("base64");
      const a = Buffer.from(computed);
      const b = Buffer.from(hmacHeader);
      isHmacValid = a.length === b.length && timingSafeEqual(a, b);
    } catch (err) {
      console.error("Error computing Shopify HMAC", err);
      isHmacValid = false;
    }
  }

  const isAuthorized =
    isHmacValid ||
    (legacySecret && legacySecret === process.env.SHOPIFY_REVALIDATION_SECRET);
  if (!isAuthorized) {
    console.error("Unauthorized Shopify webhook request.");
    return NextResponse.json({ status: 401 });
  }

  const isCollectionUpdate = collectionWebhooks.includes(topic);
  const isProductUpdate = productWebhooks.includes(topic);

  if (!isCollectionUpdate && !isProductUpdate) {
    return NextResponse.json({ status: 200 });
  }

  if (isCollectionUpdate) {
    revalidateTag(TAGS.collections);
  }

  if (isProductUpdate) {
    revalidateTag(TAGS.products);
  }

  return NextResponse.json({ status: 200, revalidated: true, now: Date.now() });
}
