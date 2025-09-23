"use client";

import clsx from 'clsx';
import * as React from 'react';

export function navigationMenuTriggerStyle() {
  return 'whitespace-nowrap text-xs font-semibold uppercase tracking-wider text-neutral-700 hover:text-black focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-neutral-400 dark:text-neutral-300 dark:hover:text-white';
}

export function NavigationMenu({ children, className, viewport = false }: { children: React.ReactNode; className?: string; viewport?: boolean }) {
  return (
    <nav className={clsx('relative', className)} aria-label="Secondary">
      {children}
      {viewport ? <div className="sr-only" /> : null}
    </nav>
  );
}

export function NavigationMenuList({ children, className }: { children: React.ReactNode; className?: string }) {
  return <ul className={clsx('flex items-center gap-4', className)}>{children}</ul>;
}

type ItemCtx = { open: boolean; setOpen: (o: boolean) => void };
const ItemContext = React.createContext<ItemCtx | null>(null);

export function NavigationMenuItem({ children, className }: { children: React.ReactNode; className?: string }) {
  const [open, setOpen] = React.useState(false);
  return (
    <ItemContext.Provider value={{ open, setOpen }}>
      <li className={clsx('relative', className)} onMouseLeave={() => setOpen(false)}>
        {children}
      </li>
    </ItemContext.Provider>
  );
}

export function NavigationMenuTrigger({ children, className }: { children: React.ReactNode; className?: string }) {
  const ctx = React.useContext(ItemContext)!;
  return (
    <button
      className={clsx(navigationMenuTriggerStyle(), className)}
      aria-expanded={ctx.open}
      onClick={() => ctx.setOpen(!ctx.open)}
      onMouseEnter={() => ctx.setOpen(true)}
    >
      {children}
    </button>
  );
}

export function NavigationMenuContent({ children, className }: { children: React.ReactNode; className?: string }) {
  const ctx = React.useContext(ItemContext)!;
  return ctx.open ? (
    <div className={clsx('absolute left-0 z-20 mt-2 min-w-40 origin-top-left rounded-md border border-neutral-200 bg-white p-2 shadow-lg ring-1 ring-black/5 dark:border-neutral-700 dark:bg-black', className)}>
      {children}
    </div>
  ) : null;
}

export function NavigationMenuLink({ children, className, asChild = false }: { children: React.ReactNode; className?: string; asChild?: boolean }) {
  if (asChild) return <>{children}</> as any;
  return <a className={className}>{children}</a>;
}


