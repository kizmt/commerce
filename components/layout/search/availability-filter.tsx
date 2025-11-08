"use client";

import clsx from "clsx";
import { Checkbox } from "components/ui/checkbox";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

export default function AvailabilityFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const stock = searchParams.get("stock"); // 'in' | 'out' | 'both' | null
  const inActive = stock === "in" || stock === "both";
  const outActive = stock === "out" || stock === "both";

  const [counts, setCounts] = useState<{
    inStock: number;
    outOfStock: number;
  } | null>(null);
  const paramsString = searchParams.toString();
  const context = useMemo(() => {
    // Determine whether we are on /search or /collection/[collection]
    const isCollection = pathname.startsWith("/collection/");
    const q = searchParams.get("q") || undefined;
    const collection = isCollection
      ? decodeURIComponent(pathname.split("/")[2] || "")
      : undefined;
    return { q, collection };
  }, [pathname, paramsString]);

  useEffect(() => {
    const url = new URL("/api/search/availability", window.location.origin);
    if (context.q) url.searchParams.set("q", context.q);
    if (context.collection)
      url.searchParams.set("collection", context.collection);
    fetch(url.toString())
      .then((r) => r.json())
      .then((data) => {
        if (
          typeof data?.inStock === "number" &&
          typeof data?.outOfStock === "number"
        ) {
          setCounts({ inStock: data.inStock, outOfStock: data.outOfStock });
        } else {
          setCounts(null);
        }
      })
      .catch(() => setCounts(null));
  }, [context]);

  function hrefFor(nextStock: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (!nextStock) params.delete("stock");
    else params.set("stock", nextStock);
    params.delete("after");
    params.delete("before");
    return `${pathname}?${params.toString()}`;
  }

  return (
    <nav>
      <h3 className="hidden text-xs text-neutral-500 md:block dark:text-neutral-400">
        Availability
      </h3>
      <ul className="hidden md:block">
        <li className="mt-2 flex items-center justify-between text-black dark:text-white">
          <Link
            href={hrefFor(
              inActive && !outActive ? null : outActive ? "both" : "in",
            )}
            className={clsx(
              "text-sm underline-offset-4 hover:underline dark:hover:text-neutral-100",
              {
                "underline underline-offset-4": inActive && !outActive,
              },
            )}
          >
            In stock{counts ? ` (${counts.inStock})` : ""}
          </Link>
          <Checkbox
            checked={inActive}
            onCheckedChange={(checked) => {
              const isOn = checked === true;
              const next = isOn
                ? outActive
                  ? "both"
                  : "in"
                : outActive
                  ? "out"
                  : null;
              router.push(hrefFor(next));
            }}
          />
        </li>
        <li className="mt-2 flex items-center justify-between text-black dark:text-white">
          <Link
            href={hrefFor(
              outActive && !inActive ? null : inActive ? "both" : "out",
            )}
            className={clsx(
              "text-sm underline-offset-4 hover:underline dark:hover:text-neutral-100",
              {
                "underline underline-offset-4": outActive && !inActive,
              },
            )}
          >
            Out of stock{counts ? ` (${counts.outOfStock})` : ""}
          </Link>
          <Checkbox
            checked={outActive}
            onCheckedChange={(checked) => {
              const isOn = checked === true;
              const next = isOn
                ? inActive
                  ? "both"
                  : "out"
                : inActive
                  ? "in"
                  : null;
              router.push(hrefFor(next));
            }}
          />
        </li>
      </ul>
    </nav>
  );
}
