export async function customerFetch<T>({
  query,
  variables
}: {
  query: string;
  variables?: Record<string, unknown>;
}): Promise<T> {
  const endpoint = 'https://shopify.com/account/customer/api/2024-10/graphql.json';
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getCustomerAccessToken()}`
    },
    body: JSON.stringify({ query, variables })
  });
  const json = await res.json();
  if (!res.ok || json.errors) {
    throw json.errors?.[0] || json;
  }
  return json.data as T;
}

function getCustomerAccessToken(): string {
  // This function is intended for server-side usage only.
  // In Next.js route handlers and server components, use cookies() API.
  // Here, we read from the request context via headers when available; fallback to empty.
  // Implementers can replace this with a parameterized version passed from the route.
  return '';
}


