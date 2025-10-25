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

type OrderLineItem = {
  title: string;
  quantity: number;
  price: {
    amount: string;
    currencyCode: string;
  };
  image?: {
    url: string;
    altText: string | null;
  };
};

type Order = {
  id: string;
  name: string;
  processedAt: string;
  financialStatus: string;
  fulfillmentStatus: string;
  totalPrice: {
    amount: string;
    currencyCode: string;
  };
  lineItems: {
    nodes: OrderLineItem[];
  };
};

type OrdersData = {
  customer: {
    orders: {
      nodes: Order[];
    };
  };
};

async function getOrders(token: string): Promise<Order[]> {
  const query = `
    query getCustomerOrders {
      customer {
        orders(first: 20) {
          nodes {
            id
            name
            processedAt
            financialStatus
            fulfillmentStatus
            totalPrice {
              amount
              currencyCode
            }
            lineItems(first: 10) {
              nodes {
                title
                quantity
                price {
                  amount
                  currencyCode
                }
                image {
                  url
                  altText
                }
              }
            }
          }
        }
      }
    }
  `;

  try {
    const data = await customerFetch<OrdersData>({ query });
    return data.customer.orders.nodes;
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatPrice(amount: string, currencyCode: string): string {
  const price = parseFloat(amount);
  if (currencyCode === "JPY") {
    return `¥${price.toLocaleString()}`;
  }
  return `${currencyCode} ${price.toFixed(2)}`;
}

function getStatusColor(status: string): string {
  const statusColors: Record<string, string> = {
    PENDING:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
    PAID: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    FULFILLED:
      "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    UNFULFILLED:
      "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300",
    PARTIALLY_FULFILLED:
      "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
  };
  return (
    statusColors[status] ||
    "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300"
  );
}

export default async function OrdersPage() {
  const token = (await cookies()).get("customer_access_token")?.value;

  if (!token) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">Orders</h1>
        <p className="text-neutral-600 dark:text-neutral-300">
          Please{" "}
          <Link
            href="/api/auth/customer/login"
            className="text-blue-600 hover:underline dark:text-blue-400"
          >
            log in
          </Link>{" "}
          to view your orders.
        </p>
      </div>
    );
  }

  const orders = await getOrders(token);

  if (orders.length === 0) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">Orders</h1>
        <div className="rounded-lg border border-neutral-200 p-8 text-center dark:border-neutral-800">
          <p className="text-neutral-600 dark:text-neutral-400">
            You haven't placed any orders yet.
          </p>
          <Link
            href="/"
            className="mt-4 inline-block text-blue-600 hover:underline dark:text-blue-400"
          >
            Start shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Orders</h1>

      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="rounded-lg border border-neutral-200 p-6 dark:border-neutral-800"
          >
            {/* Order Header */}
            <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold">{order.name}</h2>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Placed on {formatDate(order.processedAt)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold">
                  {formatPrice(
                    order.totalPrice.amount,
                    order.totalPrice.currencyCode,
                  )}
                </p>
                <div className="mt-1 flex gap-2">
                  <span
                    className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(order.financialStatus)}`}
                  >
                    {order.financialStatus}
                  </span>
                  <span
                    className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(order.fulfillmentStatus)}`}
                  >
                    {order.fulfillmentStatus}
                  </span>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="space-y-3">
              {order.lineItems.nodes.map((item, idx) => (
                <div
                  key={idx}
                  className="flex gap-4 border-t border-neutral-200 pt-3 dark:border-neutral-800"
                >
                  {item.image && (
                    <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-neutral-200 dark:border-neutral-800">
                      <img
                        src={item.image.url}
                        alt={item.image.altText || item.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="font-medium">{item.title}</p>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      Quantity: {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      {formatPrice(item.price.amount, item.price.currencyCode)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
