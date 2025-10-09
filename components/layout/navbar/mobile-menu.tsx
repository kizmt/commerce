"use client";

import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Fragment, Suspense, useEffect, useState } from "react";

import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Menu } from "lib/shopify/types";
import Search, { SearchSkeleton } from "./search";
import { navItems } from "./secondary-items";

export default function MobileMenu({ menu }: { menu: Menu[] }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const openMobileMenu = () => setIsOpen(true);
  const closeMobileMenu = () => setIsOpen(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isOpen]);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname, searchParams]);

  return (
    <>
      <button
        onClick={openMobileMenu}
        aria-label="Open mobile menu"
        className="flex h-11 w-11 items-center justify-center rounded-md border border-border text-foreground transition-colors md:hidden"
      >
        <Bars3Icon className="h-4" />
      </button>
      <Transition show={isOpen}>
        <Dialog onClose={closeMobileMenu} className="relative z-50">
          <TransitionChild
            as={Fragment}
            enter="transition-all ease-in-out duration-300"
            enterFrom="opacity-0 backdrop-blur-none"
            enterTo="opacity-100 backdrop-blur-[.5px]"
            leave="transition-all ease-in-out duration-200"
            leaveFrom="opacity-100 backdrop-blur-[.5px]"
            leaveTo="opacity-0 backdrop-blur-none"
          >
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
          </TransitionChild>
          <TransitionChild
            as={Fragment}
            enter="transition-all ease-in-out duration-300"
            enterFrom="translate-x-[-100%]"
            enterTo="translate-x-0"
            leave="transition-all ease-in-out duration-200"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-[-100%]"
          >
            <DialogPanel className="fixed bottom-0 left-0 right-0 top-0 flex h-full w-full flex-col overflow-y-auto bg-background pb-6">
              <div className="p-4">
                <button
                  className="mb-4 flex h-11 w-11 items-center justify-center rounded-md border border-border text-foreground transition-colors"
                  onClick={closeMobileMenu}
                  aria-label="Close mobile menu"
                >
                  <XMarkIcon className="h-6" />
                </button>

                <div className="mb-4 w-full">
                  <Suspense fallback={<SearchSkeleton />}>
                    <Search />
                  </Suspense>
                </div>
                {menu.length ? (
                  <ul className="flex w-full flex-col">
                    {menu.map((item: Menu) => (
                      <li
                        className="py-2 text-xl text-foreground transition-colors hover:text-muted-foreground"
                        key={item.title}
                      >
                        <Link
                          href={item.path}
                          prefetch={true}
                          onClick={closeMobileMenu}
                        >
                          {item.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : null}

                <div className="mt-6 border-t border-border pt-4">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Browse
                  </p>
                  <ul className="flex w-full flex-col">
                    {navItems.map((item) => (
                      <li key={item.label} className="py-2">
                        {item.type === "link" ? (
                          <Link
                            href={item.href}
                            prefetch={true}
                            onClick={closeMobileMenu}
                            className="text-lg text-foreground transition-colors hover:text-muted-foreground"
                          >
                            {item.label}
                          </Link>
                        ) : (
                          <details>
                            <summary className="cursor-pointer text-lg text-foreground transition-colors hover:text-muted-foreground">
                              {item.label}
                            </summary>
                            <ul className="ml-4 mt-2 flex flex-col border-l border-border pl-4">
                              <li className="py-1">
                                <Link
                                  href={item.href}
                                  prefetch={true}
                                  onClick={closeMobileMenu}
                                  className="text-base text-muted-foreground transition-colors hover:text-foreground"
                                >
                                  Shop All
                                </Link>
                              </li>
                              {item.items.map((sub) => (
                                <li key={sub.label} className="py-1">
                                  <Link
                                    href={sub.href}
                                    prefetch={true}
                                    onClick={closeMobileMenu}
                                    className="text-base text-muted-foreground transition-colors hover:text-foreground"
                                  >
                                    {sub.label}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </details>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </DialogPanel>
          </TransitionChild>
        </Dialog>
      </Transition>
    </>
  );
}
