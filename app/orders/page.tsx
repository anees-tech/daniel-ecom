"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/context/userContext";
import {
  collection,
  getDocs,
  query,
  orderBy,
  updateDoc,
  doc,
} from "firebase/firestore";
import { firestore } from "@/lib/firebaseConfig";
import Link from "next/link";
import Image from "next/image";
import HomeLink from "@/components/home-link";
import TextField from "@/components/text-field";
import Loading from "../loading";
import InvoiceModal from "../payments/invoice-modal";
import ProductReviewModal from "@/components/productComponents/product-reiw-modal";
import { toast } from "sonner";

interface Order {
  id: string;
  createdAt: string;
  status: string;
  total: number;
  items: Array<{
    id: string;
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
        const fetchedOrders: Order[] = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            createdAt: data.createdAt,
            total: data.total,
            items: data.items || [],
            invoice: data.invoice || undefined,
            customerInfo: data.customerInfo || undefined,
            subtotal: data.subtotal,
            tax: data.tax,
            deliveryFee: data.deliveryFee,
            paymentMethod: data.paymentDetails?.paymentMethod || "",
            paymentDetails: data.paymentDetails || {},
            status: data.status || "Pending",
          } as Order;
        });
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
    return <Loading />;
  }

  const handleAddReview = (review: {
    name: string;
    rating: number;
    comment: string;
  }) => {
    // In a real application, you would send this to your API
    console.log("New review:", review);

    // This would need to be implemented with proper state management
    console.log("Would update product with new review:", review);
  };

  const handleCancelOrder = async (orderId: string) => {
    if (!user) return;

    try {
      const orderRef = doc(firestore, `users/${user.uid}/orders/${orderId}`);
      await updateDoc(orderRef, {
        status: "Cancelled",
      });

      // Update the local state to reflect the change
      setOrders(
        orders.map((order) =>
          order.id === orderId ? { ...order, status: "Cancelled" } : order
        )
      );
    } catch (err) {
      console.error("Failed to cancel order:", err);
    }
  };

  return (
    <div className="bg-white mt-0 pb-10">
      <div className="py-8 px-4 sm:px-6 md:px-8 lg:px-12 flex flex-row gap-2 text-md md:text-xl font-small mb-2 capitalize">
        <HomeLink />
        <span className="text-gray-400">/</span>
        <span className="text-red-500">Orders</span>
      </div>
      <TextField text={"Orders"} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400 mb-6">
          <h2 className="text-blue-700 font-semibold text-lg mb-1">Reminder</h2>
          <p className="text-blue-800">
            Order Can Only be Cancelled when the Status of Order is
            <strong> Pending</strong>.
          </p>
        </div>
        {!user ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <Image
              src="/empty-box.svg"
              alt="Please login"
              width={120}
              height={120}
              className="mx-auto mb-4"
            />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Please Login
            </h3>
            <p className="text-gray-500 mb-4">
              You need to be logged in to view your orders.
            </p>
            <Link href="/">
              <span className="inline-block bg-gradient-to-r from-[#EB1E24] via-[#F05021] to-[#F8A51B] text-white py-2 px-6 rounded-full text-sm font-semibold hover:opacity-90 transition-opacity">
                Go to Login
              </span>
            </Link>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <Image
              src="/empty-box.svg"
              alt="No orders"
              width={120}
              height={120}
              className="mx-auto mb-4"
            />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No Orders Found
            </h3>
            <p className="text-gray-500 mb-4">
              You haven&apos;t placed any orders yet.
            </p>
            <Link href="/">
              <span className="inline-block bg-gradient-to-r from-[#EB1E24] via-[#F05021] to-[#F8A51B] text-white py-2 px-6 rounded-full text-sm font-semibold hover:opacity-90 active:opacity-90 transition-opacity">
                Shop Now
              </span>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders
              .filter((order) => order.status !== "Cancelled")
              .map((order) => (
                <div
                  key={order.id}
                  className="border rounded-lg p-6 shadow-md bg-white hover:shadow-lg active:shadow-lg transition-shadow"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
                    <div>
                      <span className="text-gray-500 text-sm">Order ID:</span>
                      <span className="font-semibold ml-2 text-gray-800">
                        {order.id}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500 text-sm">Status:</span>
                      <span
                        className={`ml-2 font-medium px-3 py-1 rounded-full text-xs ${
                          order.status === "Completed"
                            ? "bg-green-100 text-green-800"
                            : order.status === "Pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : order.status === "Processing"
                            ? "bg-blue-100 text-blue-800"
                            : order.status === "Delivered"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>

                  <div className="text-sm text-gray-500 mb-4">
                    Placed on:{" "}
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "N/A"}
                  </div>

                  <div className="border-t border-b py-4 my-4">
                    <h4 className="font-medium text-gray-800 mb-2">Items:</h4>
                    <ul className="space-y-4">
                      {order.items.map((item, idx) => (
                        <li key={idx} className="flex flex-col gap-2">
                          <div className="flex justify-between items-center">
                            <div className="flex-1">
                              <span className="font-medium">{item.name}</span>
                              <span className="text-gray-500 ml-2">
                                x{item.quantity}
                              </span>
                            </div>
                            <div className="text-right font-medium">
                              ${(item.price * item.quantity).toFixed(2)}
                            </div>
                          </div>

                          {order.status === "Delivered" && (
                            <div className="w-full mt-2 flex justify-end">
                              <ProductReviewModal
                                onAddReview={handleAddReview}
                                product={{
                                  id: item.id,
                                  name: item.name,
                                  image: item.image!,
                                }}
                              />
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <span className="text-gray-500">Total:</span>
                      <span className="ml-2 text-lg font-bold text-gray-800">
                        ${order.total.toFixed(2)}
                      </span>
                      {order.invoice && (
                        <div className="mt-1 text-xs text-gray-400">
                          Invoice: {order.invoice.invoiceId} |{" "}
                          {order.invoice.date &&
                            new Date(order.invoice.date).toLocaleString()}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                      {order.status === "Pending" && (
                        <button
                          className="w-full sm:w-auto bg-gradient-to-r from-[#EB1E24] via-[#F05021] to-[#F8A51B] bg-[length:200%_200%] bg-left
    text-sm md:text-md text-white font-semibold rounded-full shadow-lg  transition-all duration-500 ease-out transform hover:shadow-xl cursor-pointer text-center
    hover:bg-right hover:from-[#EB1E24] hover:via-[#F05021] hover:to-[#ff3604] py-2 px-6 active:bg-right hover:from-[#EB1E24] hover:via-[#F05021] active:to-[#ff3604]"
                          onClick={() => {
                            handleCancelOrder(order.id);
                            toast.success(
                              "Order has been Cancelled Successfully"
                            );
                          }}
                        >
                          Cancel Order
                        </button>
                      )}
                      <button
                        className="w-full sm:w-auto bg-gradient-to-r from-[#EB1E24] via-[#F05021] to-[#F8A51B]  text-white py-2 px-6 rounded-full text-sm font-semibold transition-all duration-500 ease-out transform hover:shadow-xl cursor-pointer text-center
    hover:bg-right hover:from-[#EB1E24] hover:via-[#F05021] hover:to-[#ff3604] active:bg-right hover:from-[#EB1E24] hover:via-[#F05021] active:to-[#ff3604]"
                        onClick={() => {
                          setSelectedOrder(order);
                          setShowInvoiceModal(true);
                        }}
                      >
                        Download Invoice
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
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
            status: selectedOrder.status,
            // Add a default invoice object if none exists
            invoice: selectedOrder.invoice ?? {
              invoiceId: `INV-${Date.now()}`,
              details: `Invoice generated for order ${selectedOrder.id}`,
              date: new Date().toISOString(),
            },
          }}
        />
      )}
    </div>
  );
}
