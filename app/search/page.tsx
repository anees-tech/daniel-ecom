import { SearchResults } from "@/components/searchComponenet/search-result";
import { Suspense } from "react";
import Loading from "../loading";
import { use } from "react";

interface SearchParams {
  query?: string;
  page?: string;
}

export default function SearchPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const resolvedParams = use(searchParams);
  
  const query = resolvedParams.query || "";
  const page = Number.parseInt(resolvedParams.page || "1", 10);

  return (
    <div className="py-8 px-2 sm:px-4 md:px-8 lg:px-12">
      <Suspense fallback={<Loading />}>
        <SearchResults query={query} page={page} />
      </Suspense>
    </div>
  );
}
