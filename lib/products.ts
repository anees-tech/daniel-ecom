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
    // Check both collections in parallel for better performance
    const productDocRef = doc(firestore, "products", productId);
    const flashSaleDocRef = doc(firestore, "flashSaleItems", productId);
    
    const [productSnapshot, flashSaleSnapshot] = await Promise.all([
      getDoc(productDocRef),
      getDoc(flashSaleDocRef)
    ]);

    // Check if product exists in products collection
    if (productSnapshot.exists()) {
      console.log("Product found in 'products' collection");
      // Make sure we're returning a valid Product by using proper type assertion
      const productData = productSnapshot.data();
      return { 
        id: productSnapshot.id, 
        ...productData
      } as Product;
    }

    // Check if product exists in flashSaleItems collection
    if (flashSaleSnapshot.exists()) {
      console.log("Product found in 'flashSaleItems' collection");
      // Make sure we're returning a valid Product by using proper type assertion
      const flashSaleData = flashSaleSnapshot.data();
      return { 
        id: flashSaleSnapshot.id, 
        ...flashSaleData
      } as Product;
    }

    // If product not found in either collection, throw error
    console.error("Product not found in any collection. ID:", productId);
    throw new Error(`Product with ID ${productId} not found in any collection`);
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    throw error;
  }
}

export async function getFlashSaleItemsProductsById(
  productIds: string[]
): Promise<Product[]> {
  try {
    const productsCollection = collection(firestore, "flashSaleItems");
    const snapshot = await getDocs(productsCollection);

    return snapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() } as Product))
      .filter((product) => productIds.includes(product.id));
  } catch (error) {
    console.error("Error fetching flash sale items:", error);
    return [];
  }
}
