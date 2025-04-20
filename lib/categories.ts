import { firestore } from "@/lib/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

export interface Category {
  id: string;
  title: string;
  href: string;
  description: string;
}

export async function fetchCategories(): Promise<Category[]> {
  const colRef = collection(firestore, "categories");
  const snapshot = await getDocs(colRef);
  console.log(
    "Categories fetched:",
    snapshot.docs.map((doc) => doc.data())
  );
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<Category, "id">),
  }));
}
