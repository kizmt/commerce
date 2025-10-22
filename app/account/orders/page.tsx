import { cookies } from "next/headers";

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

export default async function OrdersPage() {
  const token = (await cookies()).get("customer_access_token")?.value;
  return (
    <div className="space-y-4">
      {!token ? (
        <p className="text-neutral-600 dark:text-neutral-300">
          Login to view your orders.
        </p>
      ) : (
        <p className="text-neutral-600 dark:text-neutral-300">
          Your orders will appear here.
        </p>
      )}
    </div>
  );
}
