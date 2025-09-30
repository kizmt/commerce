import Footer from "components/layout/footer";
import AvailabilityFilter from "components/layout/search/availability-filter";
import FilterList from "components/layout/search/filter";
import { sorting } from "lib/constants";
import { Suspense } from "react";
import ChildrenWrapper from "./children-wrapper";

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="mx-auto flex max-w-(--breakpoint-2xl) flex-col gap-8 mt-5 px-4 pb-5 text-black md:flex-row dark:text-white">
        <div className="order-first w-full flex-none md:max-w-[125px] space-y-4">
          <Suspense fallback={null}>
            <AvailabilityFilter />
          </Suspense>
        </div>
        <div className="order-last min-h-screen w-full md:order-none">
          <Suspense fallback={null}>
            <ChildrenWrapper>{children}</ChildrenWrapper>
          </Suspense>
        </div>
        <div className="order-none flex-none md:order-last md:w-[125px]">
          <FilterList list={sorting} title="Sort by" />
        </div>
      </div>
      <Footer />
    </>
  );
}
