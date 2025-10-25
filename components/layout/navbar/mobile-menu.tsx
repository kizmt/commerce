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

import {
  Bars3Icon,
  ChevronDownIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Menu } from "lib/shopify/types";
import Search, { SearchSkeleton } from "./search";
import { navItems } from "./secondary-items";

export default function MobileMenu({ menu }: { menu: Menu[] }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const openMobileMenu = () => setIsOpen(true);
  const closeMobileMenu = () => setIsOpen(false);

  const toggleExpanded = (label: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(label)) {
      newExpanded.delete(label);
    } else {
      newExpanded.add(label);
    }
    setExpandedItems(newExpanded);
  };

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
              {/* Header with logo and close button */}
              <div className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-sm p-4 flex items-center justify-between">
                <h2 className="font-semibold text-foreground">Menu</h2>
                <button
                  className="flex h-10 w-10 items-center justify-center rounded-md border border-border text-foreground transition-colors hover:bg-accent"
                  onClick={closeMobileMenu}
                  aria-label="Close mobile menu"
                >
                  <XMarkIcon className="h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto">
                <div className="p-4 space-y-6">
                  {/* Search */}
                  <div className="w-full">
                    <Suspense fallback={<SearchSkeleton />}>
                      <Search />
                    </Suspense>
                  </div>

                  {/* Primary Menu Items */}
                  {menu.length ? (
                    <div>
                      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Shop
                      </p>
                      <ul className="flex w-full flex-col space-y-1">
                        {menu.map((item: Menu) => (
                          <li key={item.title}>
                            <Link
                              href={item.path}
                              prefetch={true}
                              onClick={closeMobileMenu}
                              className="block px-3 py-2.5 text-base font-medium text-foreground rounded-md transition-colors hover:bg-accent hover:text-foreground"
                            >
                              {item.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}

                  {/* Browse Section */}
                  <div className="border-t border-border pt-4">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Browse
                    </p>
                    <ul className="flex w-full flex-col space-y-1">
                      {navItems.map((item) => (
                        <li key={item.label}>
                          {item.type === "link" ? (
                            <Link
                              href={item.href}
                              prefetch={true}
                              onClick={closeMobileMenu}
                              className="block px-3 py-2.5 text-base font-medium text-foreground rounded-md transition-colors hover:bg-accent"
                            >
                              {item.label}
                            </Link>
                          ) : (
                            <div>
                              <button
                                onClick={() => toggleExpanded(item.label)}
                                className="flex w-full items-center justify-between px-3 py-2.5 text-base font-medium text-foreground rounded-md transition-colors hover:bg-accent"
                              >
                                <span>{item.label}</span>
                                <ChevronDownIcon
                                  className={`h-4 w-4 transition-transform duration-200 ${
                                    expandedItems.has(item.label)
                                      ? "rotate-180"
                                      : ""
                                  }`}
                                />
                              </button>
                              {expandedItems.has(item.label) && (
                                <ul className="mt-1 space-y-1 bg-muted/50 rounded-md p-2 ml-2 border border-border/50">
                                  <li>
                                    <Link
                                      href={item.href}
                                      prefetch={true}
                                      onClick={closeMobileMenu}
                                      className="block px-3 py-2 text-sm text-foreground transition-colors hover:text-foreground hover:bg-accent/50 rounded"
                                    >
                                      ↳ Shop All
                                    </Link>
                                  </li>
                                  {item.items.map((sub) => (
                                    <li key={sub.label}>
                                      <Link
                                        href={sub.href}
                                        prefetch={true}
                                        onClick={closeMobileMenu}
                                        className="block px-3 py-2 text-sm text-foreground transition-colors hover:text-foreground hover:bg-accent/50 rounded"
                                      >
                                        ↳ {sub.label}
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </DialogPanel>
          </TransitionChild>
        </Dialog>
      </Transition>
    </>
  );
}
