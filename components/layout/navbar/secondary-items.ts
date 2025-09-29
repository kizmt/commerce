export type DropdownItem = { label: string; href: string };
export type NavItem =
  | { type: 'link'; label: string; href: string }
  | { type: 'dropdown'; label: string; href: string; items: DropdownItem[] };

export const navItems: NavItem[] = [
  { type: 'link', label: 'PRE ORDER', href: '/search/pre-order' },
  {
    type: 'dropdown',
    label: 'MTG',
    href: '/search/magic-the-gathering',
    items: [
      { label: 'Singles', href: '/search/magic-the-gathering-singles' },
      { label: 'Sealed', href: '/search/magic-the-gathering-sealed' },
      { label: 'Accessories', href: '/search/magic-the-gathering-accessories' }
    ]
  },
  {
    type: 'dropdown',
    label: 'POKEMON',
    href: '/search/pokemon',
    items: [
      { label: 'Singles', href: '/search/pokemon-singles' },
      { label: 'Sealed', href: '/search/pokemon-sealed' },
      { label: 'Accessories', href: '/search/pokemon-accessories' }
    ]
  },
  {
    type: 'dropdown',
    label: 'ONE PIECE',
    href: '/search/one-piece',
    items: [
      { label: 'Singles', href: '/search/one-piece-singles' },
      { label: 'Sealed', href: '/search/one-piece-sealed' },
      { label: 'Accessories', href: '/search/one-piece-accessories' }
    ]
  },
  {
    type: 'dropdown',
    label: 'DRAGON BALL',
    href: '/search/dragon-ball',
    items: [
      { label: 'Singles', href: '/search/dragon-ball-singles' },
      { label: 'Sealed', href: '/search/dragon-ball-sealed' },
      { label: 'Accessories', href: '/search/dragon-ball-accessories' }
    ]
  },
  {
    type: 'dropdown',
    label: 'FINAL FANTASY',
    href: '/search/final-fantasy',
    items: [
      { label: 'Singles', href: '/search/final-fantasy-singles' },
      { label: 'Sealed', href: '/search/final-fantasy-sealed' },
      { label: 'Accessories', href: '/search/final-fantasy-accessories' }
    ]
  },
  { type: 'link', label: 'OTHER TCGs', href: '/search/other-tcgs' },
  { type: 'link', label: 'ACCESSORIES', href: '/search/accessories' },
  { type: 'link', label: 'COLLECTIBLES', href: '/search/collectibles' }
];


