"use client";

import FlashSaleItems from "@/components/flashSaleItems";
import HomeServices from "@/components/homeComponents/home-services";
import ProductsPage from "@/components/homeComponents/homePage-products";
import Hero from "@/components/homeComponents/mainHero";
import NavBar from "@/components/navbar";
import TextBox from "@/components/text-box";

export default function Home() {
  // const handleAddToCart = () => {
  //   alert("Product added to cart!");
  // };

  return (
    <main className="min-h-screen w-full">
      <NavBar />
      <Hero />
      <TextBox text={"Today's"} />
      <FlashSaleItems />
      <ProductsPage />
      <HomeServices />
      {/* <ItemCard
        name="Lady Bag"
        image="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-k1hQUeDnIuTL0QElljeErCclfYgZQ8.png"
        currentPrice={375}
        originalPrice={400}
        discount={40}
        stock={10}
        rating={4.9}
        reviews={98}
        onAddToCart={handleAddToCart} // ✅ This will now work
      /> */}
    </main>
  );
}
