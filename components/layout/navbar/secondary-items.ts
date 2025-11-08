export type DropdownItem = { label: string; href: string };
export type NavItem =
  | { type: "link"; label: string; href: string }
  | { type: "dropdown"; label: string; href: string; items: DropdownItem[] };

export const navItems: NavItem[] = [
  { type: "link", label: "PRE ORDER", href: "/collection/pre-order" },
  {
    type: "dropdown",
    label: "MTG",
    href: "/collection/magic-the-gathering",
    items: [
      { label: "Singles", href: "/collection/magic-the-gathering-singles" },
      { label: "Sealed", href: "/collection/magic-the-gathering-sealed" },
      { label: "Accessories", href: "/collection/magic-the-gathering-accessories" },
    ],
  },
  {
    type: "dropdown",
    label: "POKEMON",
    href: "/collection/pokemon",
    items: [
      { label: "Singles", href: "/collection/pokemon-singles" },
      { label: "Sealed", href: "/collection/pokemon-sealed" },
      { label: "Accessories", href: "/collection/pokemon-accessories" },
    ],
  },
  {
    type: "dropdown",
    label: "ONE PIECE",
    href: "/collection/one-piece",
    items: [
      { label: "Singles", href: "/collection/one-piece-singles" },
      { label: "Sealed", href: "/collection/one-piece-sealed" },
      { label: "Accessories", href: "/collection/one-piece-accessories" },
    ],
  },
  {
    type: "dropdown",
    label: "DRAGON BALL",
    href: "/collection/dragon-ball",
    items: [
      { label: "Singles", href: "/collection/dragon-ball-singles" },
      { label: "Sealed", href: "/collection/dragon-ball-sealed" },
      { label: "Accessories", href: "/collection/dragon-ball-accessories" },
    ],
  },
  {
    type: "dropdown",
    label: "FINAL FANTASY TCG",
    href: "/collection/final-fantasy",
    items: [
      { label: "Singles", href: "/collection/final-fantasy-singles" },
      { label: "Sealed", href: "/collection/final-fantasy-sealed" },
      { label: "Accessories", href: "/collection/final-fantasy-accessories" },
    ],
  },
  { type: "link", label: "JAPAN IMPORTS", href: "/collection/japan-imports" },
  { type: "link", label: "OTHER TCGs", href: "/collection/other-tcgs" },
  { type: "link", label: "ACCESSORIES", href: "/collection/accessories" },
  { type: "link", label: "COLLECTIBLES", href: "/collection/collectibles" },
];
