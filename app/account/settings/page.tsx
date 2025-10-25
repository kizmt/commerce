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
  const cookieStore = await cookies();
  const token = cookieStore.get("customer_access_token")?.value;
  const idToken = cookieStore.get("customer_id_token")?.value;

  if (!token || !idToken) {
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

  // We can't get acceptsMarketing from id_token, so default to false
  // The form will still work to update it
  const acceptsMarketing = false;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Settings</h1>
      <SettingsForm initialAcceptsMarketing={acceptsMarketing} />
      <p className="text-sm text-neutral-500">
        Note: Your current marketing preference status may not be displayed
        correctly due to API limitations. Changes you make will still be saved.
      </p>
    </div>
  );
}
