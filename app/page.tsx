"use client";
import FlashSaleItems from "@/components/flashSaleItems";
import HomeServices from "@/components/homeComponents/home-services";
import ProductsPage from "@/components/homeComponents/homePage-products";
import Hero from "@/components/homeComponents/mainHero";

import { useUser } from "@/context/userContext";

export default function Home() {
  console.log(useUser().user);
  
  return (
    <main className="width-full overflow-hidden">
      <Hero />
      <FlashSaleItems />
      <ProductsPage />
      <HomeServices />
      {/* <CustomerReviews reviews={reviews} /> */}
    </main>
  );
}
