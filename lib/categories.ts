import { firestore } from "@/lib/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

export interface Subcategory {
  id: string;
  title: string;
  href: string;
  description?: string;
}

export interface Category {
  id: string;
  title: string;
  href: string;
  description: string;
  subcategories: Subcategory[];
}

const LOCAL_STORAGE_KEY = "categories_data";

// Save categories to localStorage
function saveToLocalStorage(data: Category[]) {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
}

// Read categories from localStorage
function getFromLocalStorage(): Category[] | null {
  const data = localStorage.getItem(LOCAL_STORAGE_KEY);
  return data ? JSON.parse(data) : null;
}

// Always fetch from Firebase and update localStorage
async function fetchAndUpdateCategories(): Promise<Category[]> {
  const colRef = collection(firestore, "categories");
  const snapshot = await getDocs(colRef);

  const categories = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<Category, "id">),
  }));

  saveToLocalStorage(categories);
  console.log("Fetched from Firebase and updated localStorage:", categories);
  return categories;
}

// Public API
export async function fetchCategories(): Promise<Category[]> {
  // Get cached data immediately
  const localData = getFromLocalStorage();

  // Always trigger update in background (don't await)
  fetchAndUpdateCategories().catch((err) =>
    console.error("Firebase update failed:", err)
  );

  // Return local data if exists, otherwise wait for fetch
  if (localData) return localData;
  try {
    return await fetchAndUpdateCategories();
  } catch (error) {
    console.error(
      "Failed to fetch categories and no local data available:",
      error
    );
    return [];
  }
}
