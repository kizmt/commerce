'use client';

import { Menu, Transition } from '@headlessui/react';
import { UserIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { Fragment } from 'react';

export default function UserMenu() {
  return (
    <Menu as="div" className="relative mr-2 inline-block text-left">
      <Menu.Button aria-label="Open user menu" className="focus:outline-none">
        <div className="relative flex h-11 w-11 items-center justify-center rounded-md border border-neutral-200 text-black transition-colors hover:bg-neutral-50 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-900">
          <UserIcon className="h-4 transition-all ease-in-out group-hover:scale-110" />
        </div>
      </Menu.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-50 mt-2 w-44 origin-top-right overflow-hidden rounded-md border border-neutral-200 bg-white p-1 text-sm shadow-lg focus:outline-none dark:border-neutral-700 dark:bg-neutral-900">
          <div className="py-1">
            <Menu.Item>
              {({ active }) => (
                <Link
                  className={`${active ? 'bg-neutral-100 dark:bg-neutral-800' : ''} block rounded px-3 py-2`}
                  href="/api/auth/customer/login"
                  prefetch={false}
                >
                  Sign in / Create account
                </Link>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <Link
                  className={`${active ? 'bg-neutral-100 dark:bg-neutral-800' : ''} block rounded px-3 py-2`}
                  href="/account"
                  prefetch={true}
                >
                  Account
                </Link>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <Link
                  className={`${active ? 'bg-neutral-100 dark:bg-neutral-800' : ''} block rounded px-3 py-2`}
                  href="/api/auth/customer/logout"
                  prefetch={false}
                >
                  Logout
                </Link>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}


