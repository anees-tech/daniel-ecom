import { notFound } from "next/navigation";
import SideBar from "./SideBar";
import CategoryProducts from "./categoryProducts";
import products from "@/data/products";
import Footer from "../footer";
import Navbar from "../navbar";

const allowedCategories = ["shoes", "leather", "workwear"];

export async function CategoryRouteFilter() {
  return allowedCategories.map((slug) => ({ slug }));
}

export default function CategoryPage({ params }: { params: { slug: string } }) {
  if (!allowedCategories.includes(params.slug)) {
    return notFound();
  }

  return (
    <>
      {/* Fixed Navbar at the top */}
      <Navbar />

      {/* Page Layout with padding to avoid overlap */}
      <div className="container mx-auto p-5 flex gap-5 pt-48">
        {/* Sidebar on the left */}
        <aside className="w-1/4">
          <SideBar />
        </aside>

        {/* Main content on the right */}
        <main className="w-3/4">
          <CategoryProducts productsArray={products} />
        </main>
      </div>

      <Footer />
    </>
  );
}
