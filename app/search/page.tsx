import { SearchResults } from "@/components/searchComponenet/search-result";
import { Suspense } from "react";
import Loading from "../loading";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { query?: string; page?: string };
}) {
  const query = searchParams.query || "";
  const page = Number.parseInt(searchParams.page || "1", 10);

  return (
    <div className="py-8 px-2 sm:px-4 md:px-8 lg:px-12">
      <Suspense fallback={<Loading />}>
        <SearchResults query={query} page={page} />
      </Suspense>
    </div>
  );
}
