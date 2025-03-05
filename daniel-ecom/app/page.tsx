"use client";

import ItemCard from "@/components/item-card";
import Hero from "@/components/mainHero";
import NavBar from "@/components/navbar";

export default function Home() {
  const handleAddToCart = () => {
    alert("Product added to cart!");
  };

  return (
    <main className="min-h-screen">
      <NavBar />
      <Hero />
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
