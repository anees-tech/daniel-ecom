import { firestore } from "@/lib/firebaseConfig";
import { doc, collection, addDoc } from "firebase/firestore";

export interface Order {
    items: Array<{
      id: string;
      name: string;
      price: number;
      quantity: number;
      image: string;
    }>;
    total: number;
    subtotal: number; // Added subtotal property
    tax: number;
    deliveryFee: number;
    customerInfo: {
      name: string;
      email: string;
      address: string;
      city: string;
      phone: string;
      apartment: string;
    };
    paymentMethod: string;
    paymentDetails: {
      cardType?: string;
      lastFour?: string;
      transactionId: string;
      date: string;
      time?: string;
      status: string;
      expectedDelivery?: string;
    };
    invoice: {
      invoiceId: string;
      date: string;
      details: string;
    };
    createdAt: string;
    status: string;
  }

export async function addOrderToUserProfile(userId: string, order: Order) {
  try {
    const userOrdersCollection = collection(firestore, `users/${userId}/orders`);
    await addDoc(userOrdersCollection, order);
    console.log("Order added successfully!");
  } catch (error) {
    console.error("Error adding order to user profile:", error);
    throw error;
  }
}