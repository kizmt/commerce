'use client';

import clsx from 'clsx';
import { Menu } from 'lib/shopify/types';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export function FooterMenuItem({ item }: { item: Menu }) {
  const pathname = usePathname();
  const [active, setActive] = useState(pathname === item.path);

  useEffect(() => {
    setActive(pathname === item.path);
  }, [pathname, item.path]);

  return (
    <li>
      <Link
        href={item.path}
        className={clsx(
          'block py-1.5 text-lg text-neutral-600 underline-offset-4 transition-colors hover:text-black hover:underline md:inline-block md:text-sm dark:text-neutral-300 dark:hover:text-neutral-100',
          {
            'text-black dark:text-neutral-100': active
          }
        )}
        aria-current={active ? 'page' : undefined}
      >
        {item.title}
      </Link>
    </li>
  );
}

export default function FooterMenu({ menu }: { menu: Menu[] }) {
  const staticLinks: Menu[] = [
    { title: 'Home', path: '/' },
    { title: 'About', path: '/about' },
    { title: 'Shipping', path: '/shipping' },
    { title: 'FAQ', path: '/faq' },
    { title: 'Terms', path: '/terms' },
    { title: 'Privacy', path: '/privacy' },
    { title: 'Returns', path: '/returns' },
    { title: 'Contact', path: '/contact' }
  ];

  // Show only the curated footer links in the specified order
  const items = staticLinks;

  if (!items.length) return null;

  const ITEMS_PER_COLUMN = 4;
  const columns: Menu[][] = [];
  for (let i = 0; i < items.length; i += ITEMS_PER_COLUMN) {
    columns.push(items.slice(i, i + ITEMS_PER_COLUMN));
  }

  return (
    <nav aria-label="Footer navigation" className="w-auto">
      <div className="inline-grid grid-cols-2 gap-x-4 gap-y-1 sm:grid-cols-2 sm:gap-x-6 md:gap-x-8">
        {columns.map((col, idx) => (
          <ul key={idx} className="space-y-1">
            {col.map((item: Menu) => (
              <FooterMenuItem key={item.title} item={item} />
            ))}
          </ul>
        ))}
      </div>
    </nav>
  );
}
