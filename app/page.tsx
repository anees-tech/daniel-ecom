"use client";
import FlashSaleItems from "@/components/flashSaleItems";
import CustomerReviews from "@/components/homeComponents/home-customer-review";
import HomeServices from "@/components/homeComponents/home-services";
import ShippingPartners from "@/components/homeComponents/home-shipping-partners";
import ProductsPage from "@/components/homeComponents/homePage-products";
import Hero from "@/components/homeComponents/mainHero";
import { reviews } from "@/data/customerReviews";
import { shippingPartnersImages } from "@/data/shippingPartnersImages";
import { useUser } from "@/context/userContext";

export default function Home() {
  console.log(useUser().user);
  
  return (
    <main className="width-full overflow-hidden">
      <Hero />
      <FlashSaleItems />
      <ProductsPage />
      <HomeServices />
      <ShippingPartners images={shippingPartnersImages} />
      {/* <CustomerReviews reviews={reviews} /> */}
    </main>
  );
}
