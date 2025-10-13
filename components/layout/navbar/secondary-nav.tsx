"use client";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import Link from "next/link";

type DropdownItem = { label: string; href: string };
type NavItem =
  | { type: "link"; label: string; href: string }
  | { type: "dropdown"; label: string; href: string; items: DropdownItem[] };

const navItems: NavItem[] = [
  { type: "link", label: "PRE ORDER", href: "/search/pre-order" },
  {
    type: "dropdown",
    label: "MTG",
    href: "/search/magic-the-gathering",
    items: [
      { label: "Singles", href: "/search/magic-the-gathering-singles" },
      { label: "Sealed", href: "/search/magic-the-gathering-sealed" },
      { label: "Accessories", href: "/search/magic-the-gathering-accessories" },
    ],
  },
  {
    type: "dropdown",
    label: "POKEMON",
    href: "/search/pokemon",
    items: [
      { label: "Singles", href: "/search/pokemon-singles" },
      { label: "Sealed", href: "/search/pokemon-sealed" },
      { label: "Accessories", href: "/search/pokemon-accessories" },
    ],
  },
  {
    type: "dropdown",
    label: "ONE PIECE",
    href: "/search/one-piece",
    items: [
      { label: "Singles", href: "/search/one-piece-singles" },
      { label: "Sealed", href: "/search/one-piece-sealed" },
      { label: "Accessories", href: "/search/one-piece-accessories" },
    ],
  },
  {
    type: "dropdown",
    label: "DRAGON BALL",
    href: "/search/dragon-ball",
    items: [
      { label: "Singles", href: "/search/dragon-ball-singles" },
      { label: "Sealed", href: "/search/dragon-ball-sealed" },
      { label: "Accessories", href: "/search/dragon-ball-accessories" },
    ],
  },
  {
    type: "dropdown",
    label: "FINAL FANTASY TCG",
    href: "/search/final-fantasy",
    items: [
      { label: "Singles", href: "/search/final-fantasy-singles" },
      { label: "Sealed", href: "/search/final-fantasy-sealed" },
      { label: "Accessories", href: "/search/final-fantasy-accessories" },
    ],
  },
  { type: "link", label: "JAPAN IMPORTS", href: "/search/japan-imports" },
  { type: "link", label: "OTHER TCGs", href: "/search/other-tcgs" },
  { type: "link", label: "ACCESSORIES", href: "/search/accessories" },
  { type: "link", label: "COLLECTIBLES", href: "/search/collectibles" },
];

export default function SecondaryNav() {
  return (
    <div className="sticky top-0 z-50 hidden border-t border-b border-border bg-background md:block">
      <div className="mx-auto max-w-(--breakpoint-2xl) px-4 py-3">
        <NavigationMenu viewport={false} className="relative">
          <NavigationMenuList className="flex-nowrap gap-2">
            {navItems.map((item) =>
              item.type === "link" ? (
                <NavigationMenuItem key={item.label} className="shrink-0">
                  <NavigationMenuLink
                    asChild
                    className={navigationMenuTriggerStyle()}
                  >
                    <Link href={item.href} prefetch={true}>
                      {item.label}
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ) : (
                <NavigationMenuItem key={item.label} className="shrink-0">
                  <NavigationMenuTrigger className="shrink-0">
                    {item.label}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[280px] gap-1 p-1">
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            href={item.href}
                            prefetch={true}
                            className="block rounded px-3 py-2 text-sm text-foreground hover:bg-muted hover:text-foreground"
                          >
                            Shop All
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      {item.items.map((sub) => (
                        <li key={sub.label}>
                          <NavigationMenuLink asChild>
                            <Link
                              href={sub.href}
                              prefetch={true}
                              className="block rounded px-3 py-2 text-sm text-foreground hover:bg-muted hover:text-foreground"
                            >
                              {sub.label}
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              ),
            )}
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </div>
  );
}
