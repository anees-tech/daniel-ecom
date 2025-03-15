"use client";

import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import { useCartStore } from "@/context/addToCartContext";
import Image from "next/image";
import Link from "next/link";

export default function CartPage() {
  const { cart, removeFromCart } = useCartStore();

  const totalPrice = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-6 py-10 max-w-6xl">
        <h1 className="text-4xl font-bold mb-8 text-gray-900">Your Cart</h1>

        {cart.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">Your cart is empty.</p>
            <Link
              href="/"
              className="mt-6 inline-block bg-[#F05021] text-white px-6 py-2 rounded-lg text-lg font-medium hover:bg-[#EB1E24] transition-all"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="md:col-span-2 space-y-6">
              {cart.map((item) => (
                <div
                  key={`${item.id}-${item.color}-${item.size}`}
                  className="flex items-center gap-6 p-5 border rounded-lg shadow-sm bg-white"
                >
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={90}
                    height={90}
                    className="rounded-lg border"
                  />
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold text-gray-900">
                      {item.name}
                    </h2>
                    <p className="text-gray-500 text-sm">
                      Color: {item.color} | Size: {item.size}
                    </p>
                    <p className="text-gray-700 font-medium">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                    <p className="text-gray-500 text-sm">
                      {item.price} x {item.quantity} = $
                      {(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                  <div className="flex flex-col items-end">
                    <p className="font-medium text-gray-900">
                      Qty: {item.quantity}
                    </p>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-600 hover:text-red-800 text-sm transition-all"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary - FIXED POSITION */}
            <div className="bg-white p-6 rounded-lg shadow-md w-full md:w-[350px] lg:w-[400px] h-fit sticky top-20">
              <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
              <div className="flex justify-between text-gray-700 mb-2">
                <span>Subtotal</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-700 mb-4">
                <span>Shipping</span>
                <span className="text-green-600">Free</span>
              </div>
              <hr />
              <div className="flex justify-between font-semibold text-lg my-4">
                <span>Total</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <Link href="/checkout">
                <button className="w-full bg-[#F05021] text-white py-3 rounded-lg font-medium text-lg hover:bg-[#EB1E24] transition-all shadow-md">
                  Proceed to Checkout
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
