import { doc, getDoc } from "firebase/firestore";
import { firestore } from "@/lib/firebaseConfig";

export async function fetchGlobalTax(): Promise<number> {
  try {
    const docRef = doc(firestore, "settings", "globalTax");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      // If your value is stored as 100 for 10%, convert to 0.1
      const value = docSnap.data().value;
      console.log("Global tax fetched:", value);
      return typeof value === "number" ? value :value; // 100/1000 = 0.1 (10%)
    }
    return 0.1;
  } catch (error) {
    console.error("Error fetching global tax:", error);
    return 0.1;
  }
}