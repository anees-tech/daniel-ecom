import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { firestore } from "@/lib/firebaseConfig";

export interface Product {
  brand: string;
  material: string;
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

export async function getProducts(): Promise<Product[]> {
  try {
    const productsCollection = collection(firestore, "products");
    const snapshot = await getDocs(productsCollection);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Product[];
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

export async function getProductById(productId: string) {
  try {
    const productDoc = doc(firestore, "products", productId);
    const snapshot = await getDoc(productDoc);

    if (snapshot.exists()) {
      return { id: snapshot.id, ...snapshot.data() };
    } else {
      throw new Error("Product not found");
    }
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    throw error;
  }
}