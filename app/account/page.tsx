import { baseUrl } from 'lib/utils';
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
          emailAddress { emailAddress }
          firstName
          lastName
        }
      }
    `;

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        Origin: baseUrl
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
    const raw = json?.data?.customer;
    if (!raw) return null;
    const mapped: Customer = {
      id: raw.id,
      email: raw.email ?? raw.emailAddress?.emailAddress ?? null,
      firstName: raw.firstName ?? null,
      lastName: raw.lastName ?? null
    };
    return mapped;
  } catch {
    return null;
  }
}

export default async function AccountPage({
  searchParams
}: {
  searchParams?: Promise<Record<string, string>>;
}) {
  const token = (await cookies()).get('customer_access_token')?.value;
  const sp = searchParams ? await searchParams : undefined;
  const authFlag = sp?.auth;

  if (!token) {
    return (
      <div className="mx-auto w-full max-w-3xl px-6 py-12">
        <h1 className="mb-4 text-2xl font-semibold">Account</h1>
        <p className="mb-6 text-neutral-600 dark:text-neutral-300">
          You&apos;re not signed in.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/api/auth/customer/login"
            prefetch={false}
            className="inline-flex items-center rounded-md border border-neutral-300 px-4 py-2 text-sm hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-900"
          >
            Sign in / Create account
          </Link>
          <Link
            href="https://shopify.com/78378696954/account"
            target="_blank"
            rel="noopener noreferrer"
            prefetch={false}
            className="inline-flex items-center rounded-md border border-neutral-300 px-4 py-2 text-sm hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-900"
          >
            Open Shopify account portal
          </Link>
        </div>
      </div>
    );
  }

  let customer = await getCustomer(token);
  if (!customer) {
    // Fallback: derive minimal profile from id_token if available
    const idToken = (await cookies()).get('customer_id_token')?.value;
    try {
      if (idToken) {
        const payload = JSON.parse(Buffer.from(idToken.split('.')[1] || '', 'base64').toString());
        if (payload?.email) {
          customer = {
            id: payload.sub || 'me',
            email: payload.email,
            firstName: payload.given_name || null,
            lastName: payload.family_name || null
          };
        }
      }
    } catch {}
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-12">
      <h1 className="mb-4 text-2xl font-semibold">Account</h1>
      {authFlag === 'ok' && (
        <p className="mb-4 rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700 dark:border-green-800 dark:bg-green-900/30 dark:text-green-300">
          Signed in successfully.
        </p>
      )}
      {authFlag === 'token_error' && (
        <p className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/30 dark:text-red-300">
          We couldn&apos;t sign you in. Please try again.
        </p>
      )}
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
              href="https://shopify.com/78378696954/account"
              target="_blank"
              rel="noopener noreferrer"
              prefetch={false}
              className="inline-flex items-center rounded-md border border-neutral-300 px-4 py-2 text-sm hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-900"
            >
              Open Shopify account portal
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
      )}
    </div>
  );
}


