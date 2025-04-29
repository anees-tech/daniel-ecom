import { SearchResults } from "@/components/searchComponenet/search-result";
import { Suspense } from "react";
import Loading from "../loading";
import { use } from "react";

// Define the expected shape of the resolved searchParams
interface ResolvedSearchParams {
  query?: string;
  page?: string;
}

export default function SearchPage({
  searchParams,
}: {
  // Update the type here to indicate it's a Promise
  searchParams: Promise<ResolvedSearchParams>;
}) {
  // Use React.use to unwrap the Promise
  // Note: 'use' hook should ideally be used directly within the component body
  // but since Next.js handles the promise nature of searchParams,
  // we can often access it directly after awaiting or using 'use'.
  // However, the type definition MUST reflect the Promise.

  // Your existing logic using React.use is correct for accessing the values
  const resolvedSearchParams = use(searchParams); // Use the promise directly

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
