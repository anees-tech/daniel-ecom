import { SearchResults } from "@/components/searchComponenet/search-result";
import { Suspense } from "react";
import Loading from "../loading";
import { use } from "react";

export default function SearchPage({
  searchParams,
}: {
  searchParams: { query?: string; page?: string };
}) {
  // Use React.use to unwrap the Promise
  const resolvedSearchParams = use(Promise.resolve(searchParams));
  
  const query = resolvedSearchParams.query || "";
  const page = Number.parseInt(resolvedSearchParams.page || "1", 10);

  return (
    <div className="py-8 px-2 sm:px-4 md:px-8 lg:px-12">
      <Suspense fallback={<Loading />}>
        <SearchResults query={query} page={page} />
      </Suspense>
    </div>
  );
}
