import { SettingsForm } from "@/components/account/settings-form";
import { customerFetch } from "@/lib/shopify/customer";
import { cookies } from "next/headers";
import Link from "next/link";

export const metadata = {
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

type CustomerData = {
  customer: {
    id: string;
    acceptsMarketing: boolean;
  };
};

async function getCustomerSettings(token: string) {
  const query = `
    query getCustomer {
      customer {
        id
        acceptsMarketing
      }
    }
  `;

  try {
    const data = await customerFetch<CustomerData>({ query });
    return data.customer;
  } catch (error) {
    console.error("Error fetching customer settings:", error);
    return null;
  }
}

export default async function SettingsPage() {
  const token = (await cookies()).get("customer_access_token")?.value;

  if (!token) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="text-neutral-600 dark:text-neutral-300">
          Please{" "}
          <Link
            href="/api/auth/customer/login"
            className="text-blue-600 hover:underline dark:text-blue-400"
          >
            log in
          </Link>{" "}
          to view your settings.
        </p>
      </div>
    );
  }

  const customer = await getCustomerSettings(token);

  if (!customer) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="text-neutral-600 dark:text-neutral-300">
          Unable to load settings. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Settings</h1>
      <SettingsForm initialAcceptsMarketing={customer.acceptsMarketing} />
    </div>
  );
}
