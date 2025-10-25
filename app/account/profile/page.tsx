import { ProfileForm } from "@/components/account/profile-form";
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
    email: string;
    firstName: string | null;
    lastName: string | null;
    defaultAddress: {
      address1: string;
      address2: string | null;
      city: string;
      provinceCode: string | null;
      zip: string;
      countryCode: string;
    } | null;
  };
};

async function getCustomerProfile(token: string) {
  const query = `
    query getCustomer {
      customer {
        id
        email
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
    }
  `;

  try {
    const data = await customerFetch<CustomerData>({ query });
    return data.customer;
  } catch (error) {
    console.error("Error fetching customer profile:", error);
    return null;
  }
}

export default async function ProfilePage() {
  const token = (await cookies()).get("customer_access_token")?.value;

  if (!token) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">Profile</h1>
        <p className="text-neutral-600 dark:text-neutral-300">
          Please{" "}
          <Link
            href="/api/auth/customer/login?force=1"
            className="text-blue-600 hover:underline dark:text-blue-400"
          >
            log in
          </Link>{" "}
          to view your profile.
        </p>
      </div>
    );
  }

  const customer = await getCustomerProfile(token);

  if (!customer) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">Profile</h1>
        <p className="text-neutral-600 dark:text-neutral-300">
          Unable to load profile. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Profile</h1>
      <ProfileForm
        initialData={{
          firstName: customer.firstName || '',
          lastName: customer.lastName || '',
          email: customer.email,
          defaultAddress: customer.defaultAddress,
        }}
      />
    </div>
  );
}
