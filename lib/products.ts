import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { firestore } from "@/lib/firebaseConfig";

export interface Product {
  id: string;
  name: string;
  category: string;
  images: string[];
  colors: { name: string; hex?: string }[];
  image: string;
  currentPrice: number;
  originalPrice: number;
  discount: number;
  stock: number;
  rating: number;
  reviewsCount: number;
  brand: string;
  sku: string;
  sizes: (string | number)[];
  outOfStockSizes?: (string | number)[];
  description: string;
  material: string;
  features: string[];
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

export async function getProductById(productId: string): Promise<Product> {
  try {
    const productDoc = doc(firestore, "products", productId);
    const snapshot = await getDoc(productDoc);

    if (snapshot.exists()) {
      return { id: snapshot.id, ...snapshot.data() } as Product; // Ensure correct typing
    } else {
      throw new Error("Product not found");
    }
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    throw error;
  }
}
