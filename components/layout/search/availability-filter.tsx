"use client";

import clsx from "clsx";
import { Checkbox } from "components/ui/checkbox";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function AvailabilityFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const stock = searchParams.get("stock"); // 'in' | 'out' | 'both' | null
  const inActive = stock === "in" || stock === "both";
  const outActive = stock === "out" || stock === "both";

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
            In stock
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
            Out of stock
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
