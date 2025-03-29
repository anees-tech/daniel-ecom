"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useCartStore } from "@/context/addToCartContext";
import Image from "next/image";
import HomeLink from "@/components/home-link";
import TextField from "@/components/text-field";
import Button from "@/components/button";
import { useTaxStore } from "@/context/taxContext";

export default function CartClient() {
  const { cart, removeFromCart, updateQuantity } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const { taxRate, setTaxRate } = useTaxStore();

  // Handle hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const totalPrice = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <>
      <div className="w-full pt-35 pb-20">
        <h1 className="mx-3 sm:mx-5 md:mx-9 lg:mx-13 py-5 flex gap-1 md:gap-2 text-sm md:text-xl font-small mb-4 capitalize">
          <HomeLink />
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-red-500">Cart</span>
        </h1>

        <TextField text={"Cart"} />
        <div className="mx-2 sm:mx-4 md:mx-8 lg:mx-12 py-12 px-2 sm:px-4 md:px-8 lg:px-12 rounded-xl bg-white shadow-lg">
          <h1 className="text-xl font-semibold mb-1">Shopping cart</h1>
          <p className="text-gray-600 text-md mb-6">
            You have {cart.length} items in your cart
          </p>

          {cart.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500 mb-4">Your cart is empty.</p>
              <Link
                href="/"
                className="inline-block bg-[#F05021] text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-[#EB1E24] transition-all"
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="flex flex-col md:flex-row gap-6 justify-between w-full">
              <div className="flex-1">
                {/* Desktop View Header - Hidden on Mobile */}
                <div className="mb-4 hidden md:grid grid-cols-4 font-semibold text-xl">
                  <div className="col-span-1">Product</div>
                  <div className="text-center col-span-1">Price</div>
                  <div className="text-center col-span-1">Quantity</div>
                </div>

                {/* Mobile View Header */}
                <div className="mb-4 md:hidden font-semibold text-xl">
                  <div>Items</div>
                </div>

                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.id} className="border-b pb-4">
                      {/* Desktop View - Hidden on Mobile */}
                      <div className="hidden md:grid grid-cols-4 items-center">
                        <div className="col-span-1 flex items-center gap-3">
                          <div className="w-18 h-18 relative">
                            <Image
                              src={
                                item.image ||
                                "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-03-17%20143442-97O1rCbUW4ps5N28iXf3OiBRIGrib7.png" ||
                                "/placeholder.svg"
                              }
                              alt={item.name}
                              fill
                              className="object-contain rounded-md"
                            />
                          </div>
                          <div>
                            <h3 className="font-medium">{item.name}</h3>
                            <p className="text-xs text-gray-500">
                              {item.color && `Color: ${item.color}`}
                              {item.size && ` | Size: ${item.size}`}
                            </p>
                          </div>
                        </div>

                        <div className="text-center text-gray-500">
                          ${item.price.toFixed(2)}
                        </div>

                        <div className="flex items-center justify-center gap-20">
                          <div className="flex items-center">
                            <span className="mx-2 w-6 text-center text-gray-500">
                              {item.quantity}
                            </span>
                            <div className="flex flex-col justify-center items-center gap-0">
                              <button
                                onClick={() =>
                                  updateQuantity(item.id, item.quantity + 1)
                                }
                                className="w-5 h-5 flex items-center justify-center rounded-full"
                              >
                                <span className="sr-only">Increase</span>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  fill="gray"
                                  className="hover:text-gray-700"
                                  viewBox="0 0 16 16"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708z"
                                  />
                                </svg>
                              </button>
                              <button
                                onClick={() =>
                                  updateQuantity(
                                    item.id,
                                    Math.max(1, item.quantity - 1)
                                  )
                                }
                                className="w-5 h-5 flex items-center justify-center rounded-full"
                              >
                                <span className="sr-only">Decrease</span>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  fill="gray"
                                  viewBox="0 0 16 16"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708"
                                  />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-end">
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="w-8 h-8 flex items-center justify-center rounded-full bg-red-100 text-red-500"
                            aria-label="Remove item"
                          >
                            <Image
                              src={"/bin.svg"}
                              width={100}
                              height={100}
                              alt={"Bin"}
                              className="w-5 h-5"
                            />
                          </button>
                        </div>
                      </div>

                      {/* Mobile View - Vertical Layout */}
                      <div className="md:hidden w-full">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-start gap-3">
                            <div className="w-[50px] h-[50px] relative flex-shrink-0">
                              <Image
                                src={
                                  item.image ||
                                  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-03-17%20143442-97O1rCbUW4ps5N28iXf3OiBRIGrib7.png" ||
                                  "/placeholder.svg"
                                }
                                alt={item.name}
                                fill
                                className="object-contain rounded-md"
                              />
                            </div>
                            <div>
                              <h3 className="font-medium">{item.name}</h3>
                              <p className="text-xs text-gray-500">
                                {item.color && `Color: ${item.color}`}
                                {item.size && ` | Size: ${item.size}`}
                              </p>
                              <p className="text-sm text-gray-500 mt-1">
                                ${item.price.toFixed(2)}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="w-8 h-8 flex items-center justify-center rounded-full bg-red-100 text-red-500"
                            aria-label="Remove item"
                          >
                            <Image
                              src={"/bin.svg"}
                              width={100}
                              height={100}
                              alt={"Bin"}
                              className="w-5 h-5"
                            />
                          </button>
                        </div>

                        <div className="flex justify-end items-center">
                          <div className="flex items-center">
                            <span className="mx-2 w-6 text-center text-gray-500">
                              {item.quantity}
                            </span>
                            <div className="flex flex-col justify-center items-center gap-0">
                              <button
                                onClick={() =>
                                  updateQuantity(item.id, item.quantity + 1)
                                }
                                className="w-5 h-5 flex items-center justify-center rounded-full"
                              >
                                <span className="sr-only">Increase</span>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  fill="gray"
                                  viewBox="0 0 16 16"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708z"
                                  />
                                </svg>
                              </button>
                              <button
                                onClick={() =>
                                  updateQuantity(
                                    item.id,
                                    Math.max(1, item.quantity - 1)
                                  )
                                }
                                className="w-5 h-5 flex items-center justify-center rounded-full"
                              >
                                <span className="sr-only">Decrease</span>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  fill="gray"
                                  viewBox="0 0 16 16"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708"
                                  />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="w-full md:w-80">
                <div className="border rounded-xl p-4">
                  <h2 className="text-center font-semibold mb-4">Cart Total</h2>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal</span>
                      <span className="font-medium">
                        ${totalPrice.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Tax</span>
                      <span className="font-medium">
                        ${(taxRate * totalPrice).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Tax Percentage</span>
                      <span className="font-medium">
                        {(taxRate*100)}%
                      </span>
                    </div>

                    <div className="space-y-2 text-sm border-b">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="delivery"
                          className="mr-2"
                          defaultChecked
                        />
                        <span>Standard Delivery</span>
                        <span className="ml-auto text-green-600">$100.00</span>
                      </label>
                      <label className="flex items-center mb-3">
                        <input type="radio" name="delivery" className="mr-2" />
                        <span>Personal Pickup</span>
                        <span className="ml-auto text-green-600">Free</span>
                      </label>
                    </div>

                    <div className="pt-2">
                      <div className="flex justify-between font-medium">
                        <span>Total</span>
                        <span>${(totalPrice*taxRate + totalPrice).toFixed(2)}</span>
                      </div>
                    </div>

                    <Link href="/payments" className="flex justify-center">
                      <Button text="Proceed to checkout" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
