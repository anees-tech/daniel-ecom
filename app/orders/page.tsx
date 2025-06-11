"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/context/userContext";
import { useReturnStore } from "@/context/returnContext";
import {
  collection,
  getDocs,
  query,
  orderBy,
  updateDoc,
  doc,
  where,
} from "firebase/firestore";
import { firestore } from "@/lib/firebaseConfig";
import Link from "next/link";
import Image from "next/image";
import HomeLink from "@/components/home-link";
import TextField from "@/components/text-field";
import Loading from "../loading";
import InvoiceModal from "../payments/invoice-modal";
import ProductReviewModal from "@/components/productComponents/product-reiw-modal";
import ReturnItemModal from "@/components/return-item-modal";
import ReturnManagement from "@/components/return-management"; // Import new component
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  image?: string;
}

interface Order {
  id: string;
  createdAt: string;
  status: string;
  total: number;
  items: OrderItem[];
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

interface ReturnRequest {
  requestedAt: string;
  id: string;
  orderId: string;
  itemId: string;
  itemName: string;
  itemPrice: number;
  itemQuantity: number;
  reason: string;
  status: "Pending" | "Approved" | "Rejected" | "Processing" | "Completed";
  qrCode: string;
  adminMessage?: string;
}

export default function OrdersPage() {
  const { user, loading } = useUser();
  const {
    policy: returnPolicy,
    isLoading: isPolicyLoading,
    fetchReturnPolicy,
    clearCache,
  } = useReturnStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [fetching, setFetching] = useState(true);

  // Invoice Modal state
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Return Modal state
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [selectedItemForReturn, setSelectedItemForReturn] =
    useState<OrderItem | null>(null);
  const [selectedOrderForReturn, setSelectedOrderForReturn] =
    useState<Order | null>(null);

  // Return Requests state
  const [returnRequests, setReturnRequests] = useState<ReturnRequest[]>([]);

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

  useEffect(() => {
    // Force clear cache and refetch on mount (for testing only)
    console.log("OrdersPage: Force clearing cache and refetching...");
    clearCache();
  }, [clearCache]); // Only run once on mount

  useEffect(() => {
    const fetchReturnRequests = async () => {
      if (!user) return;

      try {
        const returnsRef = collection(firestore, "returns");
        const q = query(
          returnsRef,
          where("userId", "==", user.uid),
          orderBy("requestedAt", "desc")
        );

        const snapshot = await getDocs(q);
        const fetchedReturns: ReturnRequest[] = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            orderId: data.orderId,
            itemId: data.itemId,
            status: data.status || "Pending",
            requestedAt: data.requestedAt,
            itemName: data.itemName,
            itemPrice:data.itemPrice,
            itemQuantity:data.itemQuantity,
            reason:data.reason,
            qrCode:data.qrCode,
          };
        });

        setReturnRequests(fetchedReturns);
      } catch (err) {
        console.error("Failed to fetch return requests:", err);
      }
    };

    if (user) fetchReturnRequests();
  }, [user]);

  useEffect(() => {
    // Check if policy is not loaded and not currently loading
    if (!returnPolicy && !isPolicyLoading) {
      console.log("OrdersPage: Triggering fetchReturnPolicy..."); // Add log
      fetchReturnPolicy();
    }
  }, [returnPolicy, isPolicyLoading, fetchReturnPolicy]); // Add dependencies

  const refreshReturnRequests = async () => {
    if (!user) return;

    try {
      const returnsRef = collection(firestore, "returns");
      const q = query(
        returnsRef,
        where("userId", "==", user.uid),
        orderBy("requestedAt", "desc")
      );

      const snapshot = await getDocs(q);
      const fetchedReturns: ReturnRequest[] = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          orderId: data.orderId,
          itemId: data.itemId,
          status: data.status || "Pending",
          requestedAt: data.requestedAt,
          itemName: data.itemName,
          itemPrice:data.itemPrice,
          itemQuantity:data.itemQuantity,
          reason:data.reason,
          qrCode:data.qrCode,
        };
      });

      setReturnRequests(fetchedReturns);
    } catch (err) {
      console.error("Failed to fetch return requests:", err);
    }
  };

  if (loading || fetching || isPolicyLoading) {
    return <Loading />;
  }

  const handleAddReview = (review: {
    name: string;
    rating: number;
    comment: string;
  }) => {
    console.log("New review:", review);
    console.log("Would update product with new review:", review);
  };

  const handleCancelOrder = async (orderId: string) => {
    if (!user) return;

    try {
      const orderRef = doc(firestore, `users/${user.uid}/orders/${orderId}`);
      await updateDoc(orderRef, {
        status: "Cancelled",
      });

      setOrders(
        orders.map((order) =>
          order.id === orderId ? { ...order, status: "Cancelled" } : order
        )
      );
      toast.success("Order has been Cancelled Successfully");
    } catch (err) {
      console.error("Failed to cancel order:", err);
      toast.error("Failed to cancel order.");
    }
  };
  console.log(
    "Return Policy (in render):",
    returnPolicy,
    "Loading:",
    isPolicyLoading
  ); // Updated log

  const isWithinReturnPeriod = (orderCreationDate: string): boolean => {
    if (
      !returnPolicy ||
      returnPolicy.returnPeriodDays <= 0 ||
      !orderCreationDate
    ) {
      return false;
    }
    try {
      const createdAt = new Date(orderCreationDate);
      console.log("Order date:", createdAt);
      console.log("Current date:", new Date());
      console.log("Return period days:", returnPolicy.returnPeriodDays);

      const deadline = new Date(createdAt);
      deadline.setDate(createdAt.getDate() + returnPolicy.returnPeriodDays);
      deadline.setHours(23, 59, 59, 999);
      console.log("Return deadline:", deadline);

      const isWithin = new Date() <= deadline;
      console.log("Is within period:", isWithin);
      return isWithin;
    } catch (e) {
      console.error("Error calculating return deadline:", e);
      return false;
    }
  };

  const getReturnStatus = (orderId: string, itemId: string): string | null => {
    const returnRequest = returnRequests.find(
      (req) => req.orderId === orderId && req.itemId === itemId
    );
    return returnRequest ? returnRequest.status : null;
  };

  const handleOpenReturnModal = (item: OrderItem, order: Order) => {
    setSelectedItemForReturn(item);
    setSelectedOrderForReturn(order);
    setShowReturnModal(true);
  };

  return (
    <div className="bg-white mt-0 pb-10">
      <div className="py-8 px-4 sm:px-6 md:px-8 lg:px-12 flex flex-row gap-2 text-md md:text-xl font-small mb-2 capitalize">
        <HomeLink />
        <span className="text-gray-400">/</span>
        <span className="text-red-500">Orders</span>
      </div>
      <TextField text={"Orders & Returns"} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400 mb-6">
          <h2 className="text-blue-700 font-semibold text-lg mb-1">Reminder</h2>
          <p className="text-blue-800">
            Order Can Only be Cancelled when the Status of Order is
            <strong> Pending</strong>. Returns are possible within{" "}
            <strong>{returnPolicy?.returnPeriodDays ?? 1} days</strong> of
            delivery.
          </p>
        </div>

        {/* Add Tabs for Orders and Returns */}
        <Tabs defaultValue="orders" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="orders">My Orders ({orders.length})</TabsTrigger>
            <TabsTrigger value="returns">Return Management ({returnRequests.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="mt-6">
            {orders.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <div className="text-gray-400 text-6xl mb-4">📦</div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  No Orders Found
                </h3>
                <p className="text-gray-500 mb-6">
                  You haven&apos;t placed any orders yet.
                </p>
                <Link
                  href="/allproducts"
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#EB1E24] via-[#F05021] to-[#F8A51B] text-white font-semibold rounded-full hover:shadow-lg transition-shadow"
                >
                  Start Shopping
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
                          {order.items.map((item, idx) => {
                            const canReturn =
                              order.status === "Delivered" &&
                              isWithinReturnPeriod(order.createdAt) &&
                              !getReturnStatus(order.id, item.id); // Only allow return if no existing request

                            const returnStatus = getReturnStatus(order.id, item.id);

                            // Add this debug log
                            console.log(`Order ${order.id}, Item ${idx}:`, {
                              status: order.status,
                              createdAt: order.createdAt,
                              withinPeriod: isWithinReturnPeriod(order.createdAt),
                              canReturn,
                            });

                            return (
                              <li key={idx} className="flex flex-col gap-2">
                                <div className="flex justify-between items-start">
                                  <div className="flex-1 flex items-center gap-3">
                                    <div className="h-12 w-12 overflow-hidden rounded-md border border-gray-200 flex-shrink-0">
                                      <Image
                                        src={
                                          item.image ||
                                          "/placeholder.svg?height=48&width=48"
                                        }
                                        alt={item.name}
                                        width={48}
                                        height={48}
                                        className="h-full w-full object-cover"
                                      />
                                    </div>
                                    <div>
                                      <span className="font-medium text-sm">
                                        {item.name}
                                      </span>
                                      <span className="text-gray-500 text-xs block">
                                        x{item.quantity}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="text-right font-medium text-sm">
                                     €{(item.price * item.quantity).toFixed(2)}
                                  </div>
                                </div>

                                {returnStatus && (
                                  <span
                                    className={`absolute top-0 right-0 px-2 py-1 text-xs rounded-full 
                  ${
                    returnStatus === "Pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : returnStatus === "Approved"
                      ? "bg-green-100 text-green-800"
                      : returnStatus === "Rejected"
                      ? "bg-red-100 text-red-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                                  >
                                    Return {returnStatus}
                                  </span>
                                )}

                                <div className="w-full mt-1 flex justify-end gap-2">
                                  {order.status === "Delivered" &&
                                    !returnStatus && (
                                      <ProductReviewModal
                                        onAddReview={handleAddReview}
                                        product={{
                                          id: item.id,
                                          name: item.name,
                                          image: item.image!,
                                        }}
                                      />
                                    )}
                                  {canReturn && (
                                    <button
                                      className="flex items-center gap-2 px-4 md:px-5 py-2 md:py-3 
    bg-gradient-to-r from-[#EB1E24] via-[#F05021] to-[#F8A51B] bg-[length:200%_200%] bg-left
    text-md md:text-md text-white font-semibold rounded-full shadow-lg 
    transition-all duration-500 ease-out transform hover:shadow-xl cursor-pointer text-center
    hover:bg-right hover:from-[#EB1E24] hover:via-[#F05021] hover:to-[#ff3604] active:bg-right hover:from-[#EB1E24] hover:via-[#F05021] hover:to-[#ff3604]"
                                      onClick={() =>
                                        handleOpenReturnModal(item, order)
                                      }
                                    >
                                      Return Item
                                    </button>
                                  )}
                                  {returnStatus && (
                                    <div className="text-sm">
                                      <span
                                        className={`${
                                          returnStatus === "Pending"
                                            ? "text-yellow-600"
                                            : returnStatus === "Approved"
                                            ? "text-green-600"
                                            : returnStatus === "Rejected"
                                            ? "text-red-600"
                                            : "text-gray-600"
                                        }`}
                                      >
                                        Return request: {returnStatus}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </li>
                            );
                          })}
                        </ul>
                      </div>

                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                          <span className="text-gray-500">Total:</span>
                          <span className="ml-2 text-lg font-bold text-gray-800">
                             €{order.total.toFixed(2)}
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
                              className="flex items-center gap-2 px-4 md:px-5 py-2 md:py-3 w-full sm:w-auto bg-gradient-to-r from-[#EB1E24] via-[#F05021] to-[#F8A51B] bg-[length:200%_200%] bg-left
                            text-sm md:text-md text-white font-semibold rounded-full shadow-lg  transition-all duration-500 ease-out transform hover:shadow-xl cursor-pointer text-center
                            hover:bg-right hover:to-[#ff3604] py-2 px-6 active:bg-right hover:from-[#EB1E24] hover:via-[#F05021] active:to-[#ff3604]"
                            onClick={() => handleCancelOrder(order.id)}
                          >
                            Cancel Order
                          </button>
                        )}
                        <button
                          className="flex items-center gap-2 px-4 md:px-5 py-2 md:py-3 w-full sm:w-auto bg-gradient-to-r from-[#EB1E24] via-[#F05021] to-[#F8A51B]  text-white py-2 px-6 rounded-full text-sm font-semibold transition-all duration-500 ease-out transform hover:shadow-xl cursor-pointer text-center
                            hover:bg-right  hover:to-[#ff3604] active:bg-right hover:from-[#EB1E24] hover:via-[#F05021] active:to-[#ff3604]"
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
          </TabsContent>

          <TabsContent value="returns" className="mt-6">
            <ReturnManagement returnRequests={returnRequests} />
          </TabsContent>
        </Tabs>
      </div>

      {selectedOrder && showInvoiceModal && (
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
            invoice: selectedOrder.invoice ?? {
              invoiceId: `INV-${Date.now()}`,
              details: `Invoice generated for order ${selectedOrder.id}`,
              date: new Date().toISOString(),
            },
          }}
        />
      )}

      {selectedItemForReturn &&
        selectedOrderForReturn &&
        showReturnModal &&
        user && (
          <ReturnItemModal
            isOpen={showReturnModal}
            onClose={() => {
              setShowReturnModal(false);
              setSelectedItemForReturn(null);
              setSelectedOrderForReturn(null);
            }}
            item={selectedItemForReturn}
            orderId={selectedOrderForReturn.id}
            userId={user.uid}
            orderCreatedAt={selectedOrderForReturn.createdAt}
            onSuccess={refreshReturnRequests}
          />
        )}
    </div>
  );
}
