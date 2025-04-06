import { notFound } from "next/navigation";
import { Filter } from "lucide-react";
import SideBar from "./SideBar";
import CategoryProducts from "./categoryProducts";
import Image from "next/image";
import categoryProducts from "@/data/categoriesData";
import HomeLink from "../home-link";
import TextField from "../text-field";

const allowedCategories = ["shoes", "leather", "workwear", "men", "women"];

export async function generateStaticParams() {
  return allowedCategories.map((slug) => ({ slug }));
}

export default function CategoryPage({ params }: { params: { slug: string } }) {
  if (!allowedCategories.includes(params.slug)) {
    return notFound();
  }

  return (
    <div className="min-h-screen flex flex-col pt-0 pb-20">
      {/* Page Layout with padding to avoid overlap */}
      <div className="flex-1 py-8 mt-15 lg:mt-20 relative">
        <div className="px-2 sm:px-4 md:px-8 lg:px-12 flex flex-row gap-2 text-sm md:text-xl font-small mb-4 capitalize">
          <HomeLink />
          <span className="text-gray-400">/</span>
          <span className="text-gray-400">Category</span>
          <span className="text-gray-400">/</span>
          <span className="text-red-500 hover:text-red-700">
            {" "}
            {params.slug}
          </span>
        </div>
        <TextField text={params.slug} />
        <Image
          src="/design.svg"
          alt="Design"
          width={200}
          height={200}
          priority
          className="absolute right-0 -z-50"
        />
        {/* Mobile Filter Toggle - Only visible on small screens */}
        <div className="md:hidden mb-4 bg-white shadow-sm md:shadow-lg rounded-xl px-2 sm:px-4 md:px-8 lg:px-12">
          <details className="rounded-lg shadow-sm">
            <summary className="list-none flex items-center justify-between p-4 cursor-pointer">
              <div className="flex items-center">
                <Filter className="h-5 w-5 mr-2" />
                <span className="font-medium">Filters</span>
              </div>
              <span className="text-sm text-red-500">
                {/* Show how many filters are active */}
                {(() => {
                  let count = 0;
                  if (categoryProducts.length > 0) count++; // Just to show a count for demo
                  return count > 0 ? `${count} active` : "";
                })()}
              </span>
            </summary>
            <div className="p-4 border-t">
              <SideBar />
            </div>
          </details>
        </div>

        <div className="flex flex-col md:flex-row gap-8 bg-white shadow-sm md:shadow-md rounded-xl">
          {/* Sidebar on the left - Hidden on mobile */}
          <aside className="hidden md:block md:w-1/4">
            <div className="p-4 rounded-lg sticky top-24">
              <SideBar />
            </div>
          </aside>

          {/* Main content */}
          <main className="w-full md:w-3/4 p-5 rounded-xl">
            <CategoryProducts productsArray={categoryProducts} />
          </main>
        </div>
      </div>
      <div className="relative">
        <Image
          src="/design2.svg"
          alt="Design"
          width={200}
          height={200}
          priority
          className="absolute left-0 bottom-0 -z-50"
        />
      </div>
    </div>
  );
}
