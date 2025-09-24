export type DropdownItem = { label: string; href: string };
export type NavItem =
  | { type: 'link'; label: string; href: string }
  | { type: 'dropdown'; label: string; href: string; items: DropdownItem[] };

export const navItems: NavItem[] = [
  { type: 'link', label: 'PRE ORDER', href: '/search?q=pre-order' },
  {
    type: 'dropdown',
    label: 'MTG',
    href: '/search/magic-the-gathering',
    items: [
      { label: 'Singles', href: '/search?q=mtg%20singles' },
      { label: 'Sealed', href: '/search?q=mtg%20sealed' },
      { label: 'Accessories', href: '/search?q=mtg%20accessories' }
    ]
  },
  {
    type: 'dropdown',
    label: 'POKEMON',
    href: '/search/pokemon',
    items: [
      { label: 'Singles', href: '/search?q=pokemon%20singles' },
      { label: 'Sealed', href: '/search?q=pokemon%20sealed' },
      { label: 'Accessories', href: '/search?q=pokemon%20accessories' }
    ]
  },
  {
    type: 'dropdown',
    label: 'ONE PIECE',
    href: '/search/one-piece',
    items: [
      { label: 'Singles', href: '/search?q=one%20piece%20singles' },
      { label: 'Sealed', href: '/search?q=one%20piece%20sealed' },
      { label: 'Accessories', href: '/search?q=one%20piece%20accessories' }
    ]
  },
  {
    type: 'dropdown',
    label: 'DRAGON BALL',
    href: '/search/dragon-ball',
    items: [
      { label: 'Singles', href: '/search?q=dragon%20ball%20singles' },
      { label: 'Sealed', href: '/search?q=dragon%20ball%20sealed' },
      { label: 'Accessories', href: '/search?q=dragon%20ball%20accessories' }
    ]
  },
  {
    type: 'dropdown',
    label: 'FINAL FANTASY',
    href: '/search/final-fantasy',
    items: [
      { label: 'Singles', href: '/search?q=final%20fantasy%20singles' },
      { label: 'Sealed', href: '/search?q=final%20fantasy%20sealed' },
      { label: 'Accessories', href: '/search?q=final%20fantasy%20accessories' }
    ]
  },
  { type: 'link', label: 'OTHER TCGs', href: '/search?q=tcg' },
  { type: 'link', label: 'ACCESSORIES', href: '/search?q=tcg' },
  { type: 'link', label: 'COLLECTIBLES', href: '/search?q=tcg' }
];


