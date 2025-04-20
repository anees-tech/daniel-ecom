"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, firestore } from "@/lib/firebaseConfig";
import Cookies from "js-cookie"; // Import js-cookie

// Define types for our context values
interface FirestoreUserData {
  uid?: string;
  name?: string;
  email?: string;
  streetAddress?: string;
  streetAddress2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  profileImage?: string;
  createdAt?: any;
  updatedAt?: any;
  [key: string]: any; // Allow for additional fields
}

interface UserContextType {
  user: User | null; // Firebase Auth user
  userData: FirestoreUserData | null; // Firestore user data
  loading: boolean;
  userDataLoading: boolean;
  setUser: (user: User | null) => void;
  refreshUserData: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<FirestoreUserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [userDataLoading, setUserDataLoading] = useState(false);

  // Function to fetch user data from Firestore
  const fetchUserData = useCallback(async (uid: string) => {
    setUserDataLoading(true);
    try {
      const userDocRef = doc(firestore, "users", uid);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        const firestoreData = userDoc.data() as FirestoreUserData;
        setUserData(firestoreData);
        
        // Also store userData in cookies for persistence
        Cookies.set("userData", JSON.stringify(firestoreData), { expires: 7 });
      } else {
        console.log("No user document found for this user");
        setUserData(null);
        Cookies.remove("userData");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      setUserData(null);
    } finally {
      setUserDataLoading(false);
    }
  }, []);

  // Function to manually refresh user data
  const refreshUserData = useCallback(async () => {
    if (user?.uid) {
      await fetchUserData(user.uid);
    }
  }, [user, fetchUserData]);

  // Handle auth state changes and load user data
  useEffect(() => {
    // First try to load from cookies for faster initial render
    const storedUser = Cookies.get("user");
    const storedUserData = Cookies.get("userData");
    
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      
      if (storedUserData) {
        setUserData(JSON.parse(storedUserData));
      }
    }

    // Then set up the real-time auth listener
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        Cookies.set("user", JSON.stringify(firebaseUser), { expires: 7 });
        
        // Fetch the latest user data from Firestore
        await fetchUserData(firebaseUser.uid);
      } else {
        // User is signed out
        setUser(null);
        setUserData(null);
        Cookies.remove("user");
        Cookies.remove("userData");
      }
      setLoading(false);
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, [fetchUserData]);

  return (
    <UserContext.Provider value={{ 
      user, 
      userData, 
      loading, 
      userDataLoading, 
      setUser, 
      refreshUserData 
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
