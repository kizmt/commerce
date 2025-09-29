import Link from "next/link";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const tabs = [
    { href: "/account/profile", label: "Profile" },
    { href: "/account/orders", label: "Orders" },
    { href: "/account/settings", label: "Settings" },
  ];

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-12">
      <h1 className="mb-6 text-2xl font-semibold">Account</h1>
      <div className="mb-8 flex flex-wrap gap-2">
        {tabs.map((t) => (
          <Link
            key={t.href}
            href={t.href}
            prefetch
            className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-900"
          >
            {t.label}
          </Link>
        ))}
      </div>
      {children}
    </div>
  );
}
