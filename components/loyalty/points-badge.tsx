/**
 * Points Badge Component
 *
 * Compact points display for navigation/header
 */

"use client";

import Link from "next/link";
import { useLoyalty } from "./loyalty-context";

export function PointsBadge() {
  const { points, isLoading, error } = useLoyalty();

  // Don't show if not loaded or error
  if (error || isLoading || points === 0) {
    return null;
  }

  return (
    <Link
      href="/account/rewards"
      className="flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 transition-colors hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50"
      title="View your loyalty rewards"
    >
      <svg
        className="h-3.5 w-3.5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <span>{points.toLocaleString()}</span>
    </Link>
  );
}
