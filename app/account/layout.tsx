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

  return <div className="mx-auto w-full max-w-5xl px-6 py-12">{children}</div>;
}
