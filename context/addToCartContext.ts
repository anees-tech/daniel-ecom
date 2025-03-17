"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { CartState } from "@/interfaces/cartContextInterface";

const CART_EXPIRATION_TIME = 60 * 60 * 1000; // 1 hour

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: [
        {
          id: "1",
          name: "Lady bag",
          price: 375,
          quantity: 1,
          image: "/placeholder.svg?height=60&width=60",
          color: "Brown",
          size: "XS",
        },
        {
          id: "2",
          name: "Lady bag",
          price: 375,
          quantity: 3,
          image: "/placeholder.svg?height=60&width=60",
          color: "Brown",
          size: "S",
        },
        {
          id: "3",
          name: "Lady bag",
          price: 375,
          quantity: 3,
          image: "/placeholder.svg?height=60&width=60",
          color: "Brown",
          size: "XS",
        },
      ],

      addToCart: (item) => {
        set((state) => {
          const existingItem = state.cart.find(
            (cartItem) =>
              cartItem.id === item.id &&
              cartItem.color === item.color &&
              cartItem.size === item.size
          );

          if (existingItem) {
            return {
              cart: state.cart.map((cartItem) =>
                cartItem.id === item.id &&
                cartItem.color === item.color &&
                cartItem.size === item.size
                  ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
                  : cartItem
              ),
            };
          }
          return { cart: [...state.cart, { ...item }] };
        });
      },

      removeFromCart: (id) => {
        set((state) => ({
          cart: state.cart.filter((item) => item.id !== id),
        }));
      },

      updateQuantity: (id, quantity) => {
        set((state) => ({
          cart: state.cart.map((item) =>
            item.id === id ? { ...item, quantity } : item
          ),
        }));
      },

      getCartCount: () => {
        return get().cart.reduce((acc, item) => acc + item.quantity, 0);
      },

      clearCart: () => {
        set({ cart: [] });
        if (typeof window !== "undefined") {
          sessionStorage.removeItem("cart_expiry");
        }
      },
    }),
    {
      name: "cart-storage",
      storage:
        typeof window !== "undefined"
          ? createJSONStorage(() => sessionStorage)
          : undefined,
    }
  )
);

const checkCartExpiration = () => {
  if (typeof window !== "undefined") {
    const expiry = sessionStorage.getItem("cart_expiry");
    if (expiry && Date.now() > Number(expiry)) {
      useCartStore.getState().clearCart();
    }
  }
};

// Set cart expiration when the cart is modified
const setCartExpiry = () => {
  if (typeof window !== "undefined") {
    sessionStorage.setItem(
      "cart_expiry",
      String(Date.now() + CART_EXPIRATION_TIME)
    );
  }
};

// Subscribe to cart changes to update expiration
if (typeof window !== "undefined") {
  checkCartExpiration();
  useCartStore.subscribe((state) => {
    if (state.cart.length > 0) {
      setCartExpiry();
    }
  });
}
