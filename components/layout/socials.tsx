"use client";

import Link from "next/link";

type Social = {
  label: string;
  href: string;
  icon: React.ReactNode;
};

function IconBox({ children }: { children: React.ReactNode }) {
  return (
    <span className="flex h-9 w-9 items-center justify-center rounded-md border border-neutral-200 bg-white shadow-sm dark:border-neutral-700 dark:bg-neutral-900">
      {children}
    </span>
  );
}

function Facebook() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-5 w-5 fill-current"
    >
      <path d="M22 12.07C22 6.48 17.52 2 11.93 2 6.35 2 1.86 6.48 1.86 12.07c0 5.02 3.66 9.18 8.44 9.95v-7.03H7.9v-2.92h2.4V9.41c0-2.38 1.42-3.69 3.6-3.69 1.04 0 2.13.18 2.13.18v2.35h-1.2c-1.18 0-1.55.74-1.55 1.49v1.79h2.64l-.42 2.92h-2.22v7.03c4.78-.77 8.44-4.93 8.44-9.95z" />
    </svg>
  );
}

function Instagram() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-5 w-5 fill-current"
    >
      <path d="M7 2C4.24 2 2 4.24 2 7v10c0 2.76 2.24 5 5 5h10c2.76 0 5-2.24 5-5V7c0-2.76-2.24-5-5-5H7zm10 2a3 3 0 013 3v10a3 3 0 01-3 3H7a3 3 0 01-3-3V7a3 3 0 013-3h10zm-5 3a5 5 0 100 10 5 5 0 000-10zm0 2.2A2.8 2.8 0 1112 16.8 2.8 2.8 0 0112 9.2zM17.5 6a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" />
    </svg>
  );
}

function TwitterX() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-5 w-5 fill-current"
    >
      <path d="M18.244 2H21l-6.65 7.59L22.5 22h-5.5l-4.3-5.61L7 22H3l7.16-8.18L1.5 2h5.5l3.9 5.2L18.244 2z" />
    </svg>
  );
}

const socials: Social[] = [
  { label: "Facebook", href: "https://www.facebook.com/people/Turtle-Island/61583393482378/", icon: <Facebook /> },
  { label: "Instagram", href: "https://www.instagram.com/turtleislandtcg/", icon: <Instagram /> },
  { label: "X", href: "https://x.com/turtleislandtcg", icon: <TwitterX /> },
];

export default function FooterSocials() {
  return (
    <div className="flex items-center gap-3">
      {socials.map((s) => (
        <Link
          key={s.label}
          href={s.href}
          aria-label={s.label}
          prefetch={false}
          target="_blank"
        >
          <IconBox>{s.icon}</IconBox>
        </Link>
      ))}
    </div>
  );
}
