import { cookies } from 'next/headers';
import Link from 'next/link';

type Customer = {
  id: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
};

async function getCustomer(accessToken: string): Promise<Customer | null> {
  try {
    const shopDomain = process.env.SHOPIFY_STORE_DOMAIN?.replace(/^https?:\/\//, '')!;
    const apiDiscoveryUrl = `https://${shopDomain}/.well-known/customer-account-api`;
    const apiRes = await fetch(apiDiscoveryUrl, { cache: 'no-store' });
    const apiConfig = await apiRes.json().catch(() => null as any);
    const endpoint = apiConfig?.graphql_api || `https://${shopDomain}/customer/api/graphql`;
    const query = `#graphql
      query Me {
        customer {
          id
          email
          firstName
          lastName
        }
      }
    `;

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
      },
      cache: 'no-store',
      body: JSON.stringify({ query })
    });

    if (!res.ok) {
      try {
        const text = await res.text();
        console.error('Customer API /customer query failed', res.status, text);
      } catch {}
      return null;
    }
    const json = await res.json();
    if (json?.errors) {
      console.error('Customer API /customer returned errors', json.errors);
      return null;
    }
    return json?.data?.customer ?? null;
  } catch {
    return null;
  }
}

export default async function AccountPage() {
  const token = (await cookies()).get('customer_access_token')?.value;

  if (!token) {
    return (
      <div className="mx-auto w-full max-w-3xl px-6 py-12">
        <h1 className="mb-4 text-2xl font-semibold">Account</h1>
        <p className="mb-6 text-neutral-600 dark:text-neutral-300">
          You&apos;re not signed in.
        </p>
        <Link
          href="/api/auth/customer/login"
          prefetch={false}
          className="inline-flex items-center rounded-md border border-neutral-300 px-4 py-2 text-sm hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-900"
        >
          Sign in / Create account
        </Link>
      </div>
    );
  }

  const customer = await getCustomer(token);

  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-12">
      <h1 className="mb-4 text-2xl font-semibold">Account</h1>
      {!customer ? (
        <div className="space-y-4">
          <p className="text-neutral-600 dark:text-neutral-300">
            We couldn&apos;t load your profile. Please try signing in again.
          </p>
          <div className="flex gap-3">
            <Link
              href="/api/auth/customer/login"
              prefetch={false}
              className="inline-flex items-center rounded-md border border-neutral-300 px-4 py-2 text-sm hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-900"
            >
              Sign in
            </Link>
            <Link
              href="/api/auth/customer/logout"
              prefetch={false}
              className="inline-flex items-center rounded-md border border-neutral-300 px-4 py-2 text-sm hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-900"
            >
              Logout
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">Signed in as</p>
            <p className="text-lg">{customer.email || 'Unknown email'}</p>
            {(customer.firstName || customer.lastName) && (
              <p className="text-neutral-600 dark:text-neutral-300">
                {customer.firstName} {customer.lastName}
              </p>
            )}
          </div>
          <div className="flex gap-3">
            <Link
              href="/api/auth/customer/logout"
              prefetch={false}
              className="inline-flex items-center rounded-md border border-neutral-300 px-4 py-2 text-sm hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-900"
            >
              Logout
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}


