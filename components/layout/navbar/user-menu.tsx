'use client';

import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react';
import { UserIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { Fragment } from 'react';

export default function UserMenu() {
  return (
    <Menu as="div" className="relative mr-2 inline-block text-left">
      <MenuButton aria-label="Open user menu" className="focus:outline-none">
        <div className="relative flex h-11 w-11 items-center justify-center rounded-md border border-neutral-200 text-black transition-colors hover:bg-neutral-50 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-900">
          <UserIcon className="h-4 transition-all ease-in-out group-hover:scale-110" />
        </div>
      </MenuButton>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <MenuItems className="absolute right-0 z-50 mt-2 w-44 origin-top-right overflow-hidden rounded-md border border-neutral-200 bg-white p-1 text-sm shadow-lg focus:outline-none dark:border-neutral-700 dark:bg-neutral-900">
          <div className="py-1">
            <MenuItem
              as="button"
              onClick={() => {
                const url = new URL('/api/auth/customer/login', window.location.origin).toString();
                window.location.href = url;
              }}
              className="block w-full rounded px-3 py-2 text-left data-[focus]:bg-neutral-100 dark:data-[focus]:bg-neutral-800"
            >
              Sign in / Create account
            </MenuItem>
            <MenuItem
              as={Link}
              href="/account"
              prefetch
              className="block rounded px-3 py-2 data-[focus]:bg-neutral-100 dark:data-[focus]:bg-neutral-800"
            >
              Account
            </MenuItem>
            <MenuItem
              as={Link}
              href="/api/auth/customer/logout"
              prefetch={false}
              className="block rounded px-3 py-2 data-[focus]:bg-neutral-100 dark:data-[focus]:bg-neutral-800"
            >
              Logout
            </MenuItem>
          </div>
        </MenuItems>
      </Transition>
    </Menu>
  );
}


