import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { CartItem, CartState } from "@/interfaces/cartContextInterface";

const CART_EXPIRATION_TIME = 60 * 60 * 1000;

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: [],

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

if (typeof window !== "undefined") {
  checkCartExpiration();
}
