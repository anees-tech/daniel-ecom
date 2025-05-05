"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { firestore } from "@/lib/firebaseConfig";

interface ReturnPolicy {
  returnPeriodDays: number;
}

interface ReturnState {
  policy: ReturnPolicy | null;
  isLoading: boolean;
  error: string | null;
  fetchReturnPolicy: () => Promise<void>;
  clearCache: () => void; // Add this function
}

const RETURN_POLICY_EXPIRATION_TIME = 60 * 60 * 1000; // 1 hour cache

export const useReturnStore = create<ReturnState>()(
  persist(
    (set, get) => ({
      policy: null,
      isLoading: false,
      error: null,
      fetchReturnPolicy: async () => {
        // Avoid refetching if policy exists and isn't expired
        const expiry = sessionStorage.getItem("return_policy_expiry");
        console.log("--- fetchReturnPolicy called ---");
        console.log("Current policy in store:", get().policy);
        console.log("Expiry in sessionStorage:", expiry);
        if (get().policy && expiry && Date.now() < Number(expiry)) {
          console.log("Using cached policy, no fetch needed");
          return;
        }

        set({ isLoading: true, error: null });
        try {
          // Try returnPolicy first
          let docRef = doc(firestore, "settings", "returnPolicy");
          console.log("Trying settings/returnPolicy first");

          try {
            let docSnap = await getDoc(docRef);
            console.log("returnPolicy exists:", docSnap.exists());

            if (!docSnap.exists()) {
              // If that fails, try deliveryWarranty as fallback
              docRef = doc(firestore, "settings", "deliveryWarranty");
              console.log("Trying settings/deliveryWarranty as fallback");
              docSnap = await getDoc(docRef);
              console.log("deliveryWarranty exists:", docSnap.exists());
            }

            if (docSnap.exists()) {
              const rawData = docSnap.data();
              console.log("Raw Firestore data:", rawData);

              // Check if returnPeriodDays exists in the document
              if (rawData.returnPeriodDays !== undefined) {
                const policyData = { returnPeriodDays: rawData.returnPeriodDays };
                console.log("Processed policy data:", policyData);
                set({ policy: policyData, isLoading: false });
                // Set expiration time in session storage
                sessionStorage.setItem(
                  "return_policy_expiry",
                  String(Date.now() + RETURN_POLICY_EXPIRATION_TIME)
                );
                return; // Exit early if successful
              } else {
                console.warn("Document exists but no returnPeriodDays field found");
              }
            }
          } catch (err) {
            console.error("Error fetching documents:", err);
          }

          // If we get here, use the hardcoded value
          console.log("Using hardcoded policy as fallback");
          set({
            policy: { returnPeriodDays: 3 },
            isLoading: false,
            error: null
          });

        } catch (err) {
          console.error("Critical error in fetchReturnPolicy:", err);
          set({
            error: "Failed to load return policy.",
            isLoading: false,
            policy: { returnPeriodDays: 3 }, // Use hardcoded value for now
          });
        }

        // After all the tries, if still no policy data
        if (!get().policy) {
          console.log("Using hardcoded policy data as fallback");
          set({
            policy: { returnPeriodDays: 3 }, // Match your Firestore value
            isLoading: false,
            error: null
          });
        }
      },
      clearCache: () => {
        sessionStorage.removeItem("return-policy-storage");
        sessionStorage.removeItem("return_policy_expiry");
        set({ policy: null, isLoading: false, error: null });
        get().fetchReturnPolicy(); // Refetch after clearing
      },
    }),
    {
      name: "return-policy-storage",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({ policy: state.policy }), // Only persist the policy data
    }
  )
);

// Initial fetch when the store is loaded (client-side only)
if (typeof window !== "undefined") {
  useReturnStore.getState().fetchReturnPolicy();
}