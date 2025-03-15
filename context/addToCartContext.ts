import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  color?: string;
  size?: string;
}

interface CartState {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  getCartCount: () => number;
  clearCart: () => void;
}

const CART_EXPIRATION_TIME = 60 * 60 * 1000; // 1 Hour in milliseconds

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: [],

      addToCart: (item) => {
        set((state) => {
          const existingItem = state.cart.find(
            (cartItem) => cartItem.id === item.id
          );
          if (existingItem) {
            return {
              cart: state.cart.map((cartItem) =>
                cartItem.id === item.id
                  ? { ...cartItem, quantity: cartItem.quantity + 1 }
                  : cartItem
              ),
            };
          }
          return { cart: [...state.cart, { ...item, quantity: 1 }] };
        });

        // Update cart expiration time
        sessionStorage.setItem(
          "cart_expiry",
          (Date.now() + CART_EXPIRATION_TIME).toString()
        );
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
        sessionStorage.removeItem("cart_expiry");
      },
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => sessionStorage), // Uses sessionStorage instead of localStorage
    }
  )
);

// Auto-clear cart if expired
const checkCartExpiration = () => {
  const expiry = sessionStorage.getItem("cart_expiry");
  if (expiry && Date.now() > Number(expiry)) {
    useCartStore.getState().clearCart();
  }
};

// Run expiration check on app load
checkCartExpiration();
