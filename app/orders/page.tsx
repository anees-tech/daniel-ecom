"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/context/userContext";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { firestore } from "@/lib/firebaseConfig";
import Link from "next/link";
import InvoiceModal from "../payments/invoice-modal"; // Import the modal

interface Order {
  id: string;
  createdAt: string;
  status: string;
  total: number;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    image?: string;
  }>;
  invoice?: {
    invoiceId: string;
    date: string;
    details: string;
  };
  customerInfo?: {
    name: string;
    email: string;
    address: string;
    city: string;
    phone: string;
  };
  subtotal?: number;
  tax?: number;
  deliveryFee?: number;
  paymentMethod?: string;
  paymentDetails?: any;
}

export default function OrdersPage() {
  const { user, loading } = useUser();
  const [orders, setOrders] = useState<Order[]>([]);
  const [fetching, setFetching] = useState(true);

  // Modal state
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      setFetching(true);
      try {
        const ordersRef = collection(firestore, `users/${user.uid}/orders`);
        const q = query(ordersRef, orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        const fetchedOrders: Order[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Order[];
        setOrders(fetchedOrders);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      } finally {
        setFetching(false);
      }
    };
    if (user) fetchOrders();
  }, [user]);

  if (loading || fetching) {
    return <div className="p-8 text-center">Loading orders...</div>;
  }

  if (!user) {
    return (
      <div className="p-8 text-center">
        <p>
          Please{" "}
          <Link href="/">
            <span className="text-blue-600 underline">login</span>
          </Link>{" "}
          to view your orders.
        </p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="p-8 text-center">
        <p>You have no orders yet.</p>
        <Link href="/">
          <span className="text-orange-600 underline">Shop now</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Your Orders</h1>
      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order.id} className="border rounded-lg p-4 shadow-sm bg-white">
            <div className="flex justify-between items-center mb-2">
              <div>
                <span className="font-semibold">Order ID:</span> {order.id}
              </div>
              <div>
                <span className="font-semibold">Status:</span>{" "}
                <span
                  className={
                    order.status === "Completed"
                      ? "text-green-600"
                      : order.status === "Pending"
                      ? "text-yellow-600"
                      : "text-gray-600"
                  }
                >
                  {order.status}
                </span>
              </div>
            </div>
            <div className="text-sm text-gray-500 mb-2">
              Placed on:{" "}
              {order.createdAt
                ? new Date(order.createdAt).toLocaleString()
                : "N/A"}
            </div>
            <div>
              <span className="font-semibold">Items:</span>
              <ul className="ml-4 list-disc">
                {order.items.map((item, idx) => (
                  <li key={idx}>
                    {item.name} x{item.quantity} — ${item.price}
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-2">
              <span className="font-semibold">Total:</span> ${order.total}
            </div>
            {order.invoice && (
              <div className="mt-2 text-xs text-gray-400">
                Invoice: {order.invoice.invoiceId} |{" "}
                {order.invoice.date &&
                  new Date(order.invoice.date).toLocaleString()}
              </div>
            )}
            {/* Download Invoice Button */}
            <div className="mt-4 flex justify-end">
              <button
                className="bg-gradient-to-r from-[#EB1E24] via-[#F05021] to-[#F8A51B] hover:bg-red-600 text-white py-2 px-4 rounded-full text-sm font-semibold"
                onClick={() => {
                  setSelectedOrder(order);
                  setShowInvoiceModal(true);
                }}
              >
                Download Invoice
              </button>
            </div>
          </div>
        ))}
      </div>
      {/* Invoice Modal */}
      {selectedOrder && (
        <InvoiceModal
          isOpen={showInvoiceModal}
          onClose={() => setShowInvoiceModal(false)}
          orderData={{
            ...selectedOrder,
            shipping: selectedOrder.deliveryFee ?? 0,
            subtotal: selectedOrder.subtotal ?? 0,
            tax: selectedOrder.tax ?? 0,
            total: selectedOrder.total ?? 0,
            paymentMethod: selectedOrder.paymentMethod ?? "",
            paymentDetails: selectedOrder.paymentDetails ?? {},
            customerInfo: selectedOrder.customerInfo ?? {
              name: "",
              email: "",
              address: "",
              city: "",
              phone: "",
            },
            items: selectedOrder.items,
            status: selectedOrder.status, // Pass status to modal
          }}
        />
      )}
    </div>
  );
}