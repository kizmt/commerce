"use client";

import { cn } from "@/lib/utils";
import * as React from "react";

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-md border border-neutral-200 bg-white/80 shadow-sm backdrop-blur-sm dark:border-neutral-800 dark:bg-black/40",
        className,
      )}
      {...props}
    />
  );
}


