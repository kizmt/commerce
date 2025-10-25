import Link from "next/link";

export const dynamic = "force-dynamic";

export default function NotFound() {
  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-12">
      <h1 className="mb-4 text-2xl font-semibold">Page not found</h1>
      <p className="mb-6 text-neutral-600 dark:text-neutral-300">
        Sorry, we couldn&apos;t find the page you&apos;re looking for.
      </p>
      <Link
        href="/"
        prefetch
        className="inline-flex items-center rounded-md border border-neutral-300 px-4 py-2 text-sm hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-900"
      >
        Go back home
      </Link>
    </div>
  );
}
