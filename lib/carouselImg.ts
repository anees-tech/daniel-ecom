import { collection, getDocs } from "firebase/firestore";
import { firestore } from "./firebaseConfig";
export const getCarouselImages = async () => {
  try {
    const carouselCollection = collection(firestore, "carousel");
    const snapshot = await getDocs(carouselCollection);
    const images = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return images;
  } catch (error) {
    console.error("Error fetching carousel images:", error);
    throw error;
  }
};
