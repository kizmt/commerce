import CartModal from "components/cart/modal";
import LogoTextIcon from "components/icons/logo-text";
import { getMenu } from "lib/shopify";
import { Menu } from "lib/shopify/types";
import { Newspaper } from "lucide-react";
import { cookies } from "next/headers";
import Link from "next/link";
import { Suspense } from "react";
import MobileMenu from "./mobile-menu";
import Search, { SearchSkeleton } from "./search";
import SecondaryNav from "./secondary-nav";
import UserMenu from "./user-menu";

export async function Navbar() {
  const menu = await getMenu("next-js-frontend-header-menu");
  const signedIn = Boolean(
    (await cookies()).get("customer_access_token")?.value,
  );

  return (
    <>
      <nav className="relative flex items-center justify-between p-4 lg:px-6">
        <div className="block flex-none md:hidden">
          <Suspense fallback={null}>
            <MobileMenu menu={menu} signedIn={signedIn} />
          </Suspense>
        </div>
        <div className="flex w-full items-center">
          <div className="flex w-full md:w-1/3">
            <Link
              href="/"
              prefetch={true}
              className="mr-2 flex w-full items-center justify-center md:w-auto lg:mr-6"
            >
              <LogoTextIcon className="h-10 w-auto md:h-8 lg:h-10" />
            </Link>
            {menu.length ? (
              <ul className="hidden gap-6 text-sm md:flex md:items-center">
                {menu.map((item: Menu) => (
                  <li key={item.title}>
                    <Link
                      href={item.path}
                      prefetch={true}
                      className="text-neutral-500 underline-offset-4 hover:text-black hover:underline dark:text-neutral-400 dark:hover:text-neutral-300"
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
          <div className="hidden justify-center md:flex md:w-1/3">
            <Suspense fallback={<SearchSkeleton />}>
              <Search />
            </Suspense>
          </div>
          <div className="flex justify-end md:w-1/3 gap-4">
            <Link
              href="/news"
              prefetch={true}
              aria-label="News & Updates"
              className="hidden md:flex h-11 w-11 items-center justify-center rounded-md border border-border text-foreground transition-colors hover:bg-accent"
            >
              <Newspaper className="h-5 w-5" />
            </Link>
            <div className="hidden md:block">
              <UserMenu signedIn={signedIn} />
            </div>
            <CartModal />
          </div>
        </div>
      </nav>
      <SecondaryNav />
    </>
  );
}
