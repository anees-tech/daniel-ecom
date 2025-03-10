"use client";
import FlashSaleItems from "@/components/flashSaleItems";
import Footer from "@/components/footer";
import CustomerReviews from "@/components/homeComponents/home-customer-review";
import HomeServices from "@/components/homeComponents/home-services";
import ShippingPartners from "@/components/homeComponents/home-shipping-partners";
import ProductsPage from "@/components/homeComponents/homePage-products";
import Hero from "@/components/homeComponents/mainHero";
import NavBar from "@/components/navbar";
import { reviews } from "@/data/customerReviews";
import { shippingPartnersImages } from "@/data/shippingPartnersImages";

export default function Home() {
  return (
    <main className="width-full overflow-hidden">
      <NavBar />
      <Hero />
      <FlashSaleItems />
      <ProductsPage />
      <HomeServices />
      <ShippingPartners images={shippingPartnersImages} />
      <CustomerReviews reviews={reviews} />

      {/* Footer remains full-width */}
      <Footer />
    </main>
  );
}
