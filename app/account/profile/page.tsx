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
  const cookieStore = await cookies();
  const token = cookieStore.get("customer_access_token")?.value;
  const idToken = cookieStore.get("customer_id_token")?.value;

  if (!token || !idToken) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">Profile</h1>
        <p className="text-neutral-600 dark:text-neutral-300">
          Please{" "}
          <Link
            href="/api/auth/customer/login"
            className="text-blue-600 hover:underline dark:text-blue-400"
          >
            log in
          </Link>{" "}
          to view your profile.
        </p>
      </div>
    );
  }

  // Get basic customer info from id_token
  let customer: any = null;
  try {
    const payload = JSON.parse(
      Buffer.from(idToken.split(".")[1] || "", "base64").toString(),
    );
    if (payload?.email) {
      customer = {
        id: payload.sub || "me",
        email: payload.email,
        firstName: payload.given_name || null,
        lastName: payload.family_name || null,
        defaultAddress: null, // We don't have address in id_token
      };
    }
  } catch (error) {
    console.error("Failed to parse id_token:", error);
  }

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
          firstName: customer.firstName || "",
          lastName: customer.lastName || "",
          email: customer.email,
          defaultAddress: customer.defaultAddress,
        }}
      />
    </div>
  );
}
