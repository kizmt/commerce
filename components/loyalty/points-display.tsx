/**
 * Points Display Component
 *
 * Shows the customer's current points balance
 */

"use client";

import LoadingDots from "../loading-dots";
import { useLoyalty } from "./loyalty-context";

interface PointsDisplayProps {
  showLabel?: boolean;
  className?: string;
}

export function PointsDisplay({
  showLabel = true,
  className = "",
}: PointsDisplayProps) {
  const { points, isLoading, error } = useLoyalty();

  if (error) {
    return null;
  }

  if (isLoading) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <LoadingDots className="bg-black dark:bg-white" />
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {showLabel && (
        <span className="text-sm text-neutral-500 dark:text-neutral-400">
          Points:
        </span>
      )}
      <span className="font-semibold text-base">{points.toLocaleString()}</span>
    </div>
  );
}
