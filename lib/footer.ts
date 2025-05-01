import { doc, getDoc, setDoc } from "firebase/firestore";
import { firestore } from "./firebaseConfig";

const FOOTER_COLLECTION = "footerInfo";
const FOOTER_DOC_ID = "contact";

/**
 * Get the footer information from Firestore
 */
export const getFooterInfo = async () => {
  try {
    const footerRef = doc(firestore, FOOTER_COLLECTION, FOOTER_DOC_ID);
    const footerSnap = await getDoc(footerRef);

    if (footerSnap.exists()) {
      return footerSnap.data();
    }
  } catch (error) {
    console.error("Error getting footer info:", error);
    throw error;
  }
};
