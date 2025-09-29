import clsx from "clsx";
import { Suspense } from "react";

import { getCollections } from "lib/shopify";
import FilterList from "./filter";

async function CollectionList() {
  const collections = await getCollections();
  const filtered = collections.filter(
    (c: any) => c.handle && c.handle.length > 0,
  );
  // Curated order by handle
  const order: string[] = [
    "pre-order",
    "magic-the-gathering",
    "magic-the-gathering-sealed",
    "magic-the-gathering-singles",
    "pokemon",
    "pokemon-sealed",
    "pokemon-singles",
    "one-piece",
    "one-piece-sealed",
    "one-piece-singles",
    "dragon-ball",
    "dragon-ball-sealed",
    "dragon-ball-singles",
    "final-fantasy",
    "final-fantasy-sealed",
    "final-fantasy-singles",
    "japan-imports",
    "other-tcgs",
    "collectibles",
  ];
  const curated = [...filtered].sort((a: any, b: any) => {
    const ia = order.indexOf(a.handle);
    const ib = order.indexOf(b.handle);
    if (ia !== -1 && ib !== -1) return ia - ib;
    if (ia !== -1) return -1;
    if (ib !== -1) return 1;
    return a.title.localeCompare(b.title);
  });
  return <FilterList list={curated} title="Collections" />;
}

const skeleton = "mb-3 h-4 w-5/6 animate-pulse rounded-sm";
const activeAndTitles = "bg-neutral-800 dark:bg-neutral-300";
const items = "bg-neutral-400 dark:bg-neutral-700";

export default function Collections() {
  return (
    <Suspense
      fallback={
        <div className="col-span-2 hidden h-[400px] w-full flex-none py-4 lg:block">
          <div className={clsx(skeleton, activeAndTitles)} />
          <div className={clsx(skeleton, activeAndTitles)} />
          <div className={clsx(skeleton, items)} />
          <div className={clsx(skeleton, items)} />
          <div className={clsx(skeleton, items)} />
          <div className={clsx(skeleton, items)} />
          <div className={clsx(skeleton, items)} />
          <div className={clsx(skeleton, items)} />
          <div className={clsx(skeleton, items)} />
          <div className={clsx(skeleton, items)} />
        </div>
      }
    >
      <CollectionList />
    </Suspense>
  );
}
