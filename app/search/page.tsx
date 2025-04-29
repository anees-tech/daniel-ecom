import { SearchResults } from "@/components/searchComponenet/search-result";
import { Suspense } from "react";
import Loading from "../loading";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ query?: string; page?: string }>;
}) {
  // No need to use Promise.resolve and use() here
  // searchParams is already a plain object
  const query = (await searchParams).query || "";
  const page = Number.parseInt((await searchParams).page || "1", 10);

  return (
    <div className="py-8 px-2 sm:px-4 md:px-8 lg:px-12">
      <Suspense fallback={<Loading />}>
        <SearchResults query={query} page={page} />
      </Suspense>
    </div>
  );
}
