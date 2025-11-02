import Link from "next/link";

import { CurrencySelector } from "components/currency/currency-selector";
import FooterLogo from "components/icons/footer-logo";
import FooterMenu from "components/layout/footer-menu";
import FooterPayments from "components/layout/payments";
import FooterSocials from "components/layout/socials";
import { getMenu } from "lib/shopify";
import { Suspense } from "react";

const { COMPANY_NAME, SITE_NAME } = process.env;

export default async function Footer() {
  const currentYear = new Date().getFullYear();
  const copyrightDate = 2023 + (currentYear > 2023 ? `-${currentYear}` : "");
  const skeleton =
    "w-full h-6 animate-pulse rounded-sm bg-neutral-200 dark:bg-neutral-700";
  const menu = await getMenu("next-js-frontend-footer-menu");
  const copyrightName = COMPANY_NAME || SITE_NAME || "";

  return (
    <footer className="text-sm text-neutral-500 dark:text-neutral-400">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 border-t border-neutral-200 px-6 py-12 text-sm lg:flex-row lg:gap-12 md:px-4 min-[1320px]:px-0 dark:border-neutral-700">
        {/* Logo and description section */}
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:gap-6">
          <Link
            className="flex items-center gap-2 text-black dark:text-white"
            href="/"
          >
            <FooterLogo className="h-16 w-auto md:h-20 lg:h-24" />
          </Link>
          <div className="max-w-xs">
            <p className="text-sm text-neutral-600 dark:text-neutral-300">
              {`${SITE_NAME || "Turtle Island"} offers curated TCGs, sealed products, and accessories. Proudly based in Auckland, New Zealand, building community through events and giveaways.`}
            </p>
            <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-300">
              <a
                href="mailto:info@turtleisland.co.nz"
                className="underline"
              >
                info@turtleisland.co.nz
              </a>
            </p>
          </div>
        </div>
        
        {/* Footer menu - navigation links */}
        <div className="flex-1 lg:ml-8">
          <Suspense
            fallback={
              <div className="flex h-[188px] w-[200px] flex-col gap-2">
                <div className={skeleton} />
                <div className={skeleton} />
                <div className={skeleton} />
                <div className={skeleton} />
                <div className={skeleton} />
                <div className={skeleton} />
              </div>
            }
          >
            <FooterMenu menu={menu} />
          </Suspense>
        </div>
        
        {/* Currency selector, payments and socials */}
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between lg:ml-auto lg:flex-col lg:items-end lg:gap-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:gap-8 lg:flex-col lg:items-end lg:gap-4">
            <CurrencySelector />
            <FooterPayments />
          </div>
          <FooterSocials />
        </div>
      </div>
      <div className="border-t border-neutral-200 py-6 text-sm dark:border-neutral-700">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-1 px-4 md:px-4 min-[1320px]:px-0">
          <p>
            &copy; {copyrightDate} {copyrightName}
            {copyrightName.length && !copyrightName.endsWith(".")
              ? "."
              : ""}{" "}
            All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
