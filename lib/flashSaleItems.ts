import { collection, getDocs } from "firebase/firestore";
import { firestore } from "@/lib/firebaseConfig";

export interface FlashSaleItem {
  id: string;
  name: string;
  category: string;
  image: string;
  currentPrice: number;
  originalPrice: number;
  discount: number;
  stock: number;
  rating: number;
  reviewsCount: number;
}

export async function getFlashSaleItems(): Promise<FlashSaleItem[]> {
  try {
    const flashSaleCollection = collection(firestore, "flashSaleItems");
    const snapshot = await getDocs(flashSaleCollection);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as FlashSaleItem[];
  } catch (error) {
    console.error("Error fetching flash sale items:", error);
    return [];
  }
}