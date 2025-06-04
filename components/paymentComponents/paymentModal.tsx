"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import Image from "next/image";
import Button from "@/components/button";
import { AuthModal } from "@/components/auth-modal";
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogTitle,
} from "@/components/ui/dialog";
import { addOrderToUserProfile } from "@/lib/orders";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/userContext"; // Import your user context
import { toast } from "sonner";

// Add these imports for Stripe
import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

// Initialize Stripe.js with your publishable key
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

// Define a new component for the Stripe checkout form
const StripeCheckoutForm = ({
  clientSecret,
  onSuccessfulPayment,
}: {
  clientSecret: string;
  onSuccessfulPayment: (paymentIntentId: string) => void;
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/orders`,
      },
      redirect: "if_required",
    });

    if (error) {
      if (error.type === "card_error" || error.type === "validation_error") {
        setErrorMessage(error.message || "An unexpected error occurred.");
      } else {
        setErrorMessage("An unexpected error occurred.");
      }
      setIsProcessing(false);
      return;
    }

    if (paymentIntent && paymentIntent.status === "succeeded") {
      toast.success("Payment successful!");
      onSuccessfulPayment(paymentIntent.id);
    } else if (paymentIntent) {
      setErrorMessage(`Payment status: ${paymentIntent.status}`);
    }

    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      <div className="w-full">
        <Button
          type="submit"
          disabled={isProcessing || !stripe || !elements}
          text={isProcessing ? "Processing..." : "Pay with Stripe"}
        />
      </div>
      {errorMessage && (
        <div className="text-red-500 text-sm">{errorMessage}</div>
      )}
    </form>
  );
};

interface ProductItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  size?: string;
  color?: string;
}

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: ProductItem[];
  taxRate?: number;
  onSuccess?: (orderId: string) => void; // Optional callback for success
}

interface CustomerInfo {
  firstName: string;
  apartment: string;
  phone: string;
  town: string;
  address: string;
  email: string;
}

interface PaymentDetails {
  deliveryMethod: string;
  paymentMethod: string;
  cardType?: string;
  cardNumber?: string;
  expDate?: string;
  cvv?: string;
  cardholderName?: string;
}

export default function PaymentModal({
  isOpen,
  onClose,
  products,
  taxRate = 5,
  onSuccess,
}: PaymentModalProps) {
  const router = useRouter();
  const { user } = useUser(); // Get current user from context

  const [deliveryMethod, setDeliveryMethod] = useState("standard");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [modal, setModal] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [showStripeModal, setShowStripeModal] = useState(false);

  const [customerInfo, setCustomerInfo] = useState({
    firstName: "",
    apartment: "",
    phone: "",
    town: "",
    address: "",
    email: user?.email || "",
  });

  // Calculate totals
  const subtotal = products.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const deliveryFee = deliveryMethod === "standard" ? 100 : 0;
  const tax = subtotal * (taxRate / 100);
  const totalPrice = subtotal + tax + deliveryFee;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setCustomerInfo((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const validateForm = () => {
    // Basic validation
    if (!customerInfo.firstName) {
      toast.error("Please enter your name");
      return false;
    }
    if (!customerInfo.email) {
      toast.error("Please enter your email");
      return false;
    }
    if (!customerInfo.address) {
      toast.error("Please enter your address");
      return false;
    }
    if (!customerInfo.phone) {
      toast.error("Please enter your phone number");
      return false;
    }

    return true;
  };

  const createPaymentIntent = async () => {
    if (totalPrice <= 0) {
      toast.error("Cart is empty or total is zero.");
      return;
    }
    try {
      console.log(
        "FRONTEND: Attempting to create payment intent with amount:",
        totalPrice
      );
      const response = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount: totalPrice }),
      });

      console.log(
        "FRONTEND: Response status from /api/create-payment-intent:",
        response.status
      );
      const data = await response.json();
      console.log(
        "FRONTEND: Response data from /api/create-payment-intent:",
        data
      );

      if (data.clientSecret) {
        console.log("FRONTEND: clientSecret received:", data.clientSecret);
        setClientSecret(data.clientSecret);
        setShowStripeModal(true);
        console.log("FRONTEND: setShowStripeModal set to true");
      } else {
        toast.error(data.error || "Failed to initialize payment.");
        console.error(
          "FRONTEND: No clientSecret in response or error:",
          data.error
        );
      }
    } catch (error) {
      console.error(
        "FRONTEND: Failed to create payment intent (catch block):",
        error
      );
      toast.error("Failed to initialize payment. Please try again.");
    }
  };

  const proceedToStripePayment = async () => {
    console.log("FRONTEND: proceedToStripePayment called");
    if (!user) {
      setModal(true);
      toast.error("User Must be logged in to make any kind of Payments.");
      return;
    }
    if (products.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }
    if (
      !customerInfo.firstName ||
      !customerInfo.email ||
      !customerInfo.address ||
      !customerInfo.town ||
      !customerInfo.phone
    ) {
      toast.error("Please fill in all required customer information fields.");
      return;
    }
    console.log("FRONTEND: Proceeding to call createPaymentIntent");
    await createPaymentIntent();
  };

  const handleSuccessfulStripePayment = async (paymentIntentId: string) => {
    if (!user) {
      toast.error("User session lost. Please log in again.");
      return;
    }
    try {
      const order = {
        items: products.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image || "",
          size: item.size,
          color: item.color,
        })),
        total: totalPrice,
        subtotal: subtotal,
        tax: tax,
        deliveryFee: deliveryFee,
        customerInfo: {
          name: customerInfo.firstName || "Guest Customer",
          email: customerInfo.email || user?.email || "guest@example.com",
          address: customerInfo.address || "Address not provided",
          city: customerInfo.town || "City not provided",
          phone: customerInfo.phone || "Phone not provided",
          apartment: customerInfo.apartment || "",
        },
        paymentMethod: "Stripe",
        paymentDetails: {
          transactionId: paymentIntentId,
          date: new Date().toLocaleDateString(),
          time: new Date().toLocaleTimeString(),
          status: "Completed",
        },
        invoice: {
          invoiceId: `INV-${Date.now()}`,
          date: new Date().toISOString(),
          details: `Invoice for order placed on ${new Date().toLocaleDateString()}`,
        },
        createdAt: new Date().toISOString(),
        status: "Completed",
      };

      await addOrderToUserProfile(user.uid, order);
      toast.success("Order placed successfully with Stripe!");

      const orderId = `ORD-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
      if (onSuccess) {
        onSuccess(orderId);
      } else {
        router.push("/orders");
      }
      onClose();
    } catch (error) {
      console.error("Error placing order after Stripe payment:", error);
      toast.error(
        "Failed to finalize order after payment. Please contact support."
      );
    }
  };

  const handleCheckout = async () => {
    // This function now only handles cash payments
    if (paymentMethod !== "cash") {
      return;
    }

    // Validate form
    if (!validateForm()) {
      return;
    }

    // Check if user is logged in
    if (!user) {
      toast.error("You must be logged in to place an order");
      onClose();
      router.push("/login?redirect=checkout");
      return;
    }

    setIsProcessing(true);

    try {
      // Create order object for cash payment
      const order = {
        items: products.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image || "",
          size: item.size,
          color: item.color,
        })),
        total: totalPrice,
        subtotal: subtotal,
        tax: tax,
        deliveryFee: deliveryFee,
        customerInfo: {
          name: customerInfo.firstName ?? "",
          email: customerInfo.email ?? "",
          address: customerInfo.address ?? "",
          city: customerInfo.town ?? "",
          phone: customerInfo.phone ?? "",
          apartment: customerInfo.apartment || "",
        },
        paymentMethod: "Cash on Delivery",
        paymentDetails: {
          transactionId: "COD" + Math.floor(Math.random() * 1000000),
          status: "Pending",
          date: new Date().toLocaleDateString(),
          expectedDelivery: new Date(
            Date.now() + 5 * 24 * 60 * 60 * 1000
          ).toLocaleDateString(),
        },
        invoice: {
          invoiceId: `INV-${Date.now()}`,
          date: new Date().toISOString(),
          details: `Invoice for order placed on ${new Date().toLocaleDateString()}`,
        },
        createdAt: new Date().toISOString(),
        status: "Pending",
      };

      // Save order to user's profile in Firestore
      await addOrderToUserProfile(user.uid, order);
      const orderId = `ORD-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

      toast.success("Order placed successfully! (Cash on Delivery)");

      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess(orderId);
      } else {
        // Default behavior - redirect to orders page
        router.push("/orders");
      }

      onClose();
    } catch (error) {
      console.error("Error placing cash order:", error);
      toast.error("Failed to place cash order. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Custom input style class
  const inputStyle =
    "search bg-white pl-4 focus:border-orange-500 focus:ring-red-500/20 rounded-full border border-gray-400";

  const stripeOptions: StripeElementsOptions = {
    clientSecret: clientSecret || undefined,
    appearance: {
      theme: "stripe",
    },
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogOverlay className="bg-black/50 Z-80" />
      <DialogContent className="sm:max-w-[90%] md:max-w-[80%] lg:max-w-[80%] p-0 overflow-y-auto scroll max-h-[90vh] bg-white scrollbar-hide rounded-sm md:rounded-lg">
        <DialogTitle className="sr-only">Complete Your Purchase</DialogTitle>
        <div className="relative pb-6">
          <div className="sticky top-0 bg-white z-10 flex justify-between items-center p-4 border-none">
            <h2 className="text-xl font-bold">Complete Your Purchase</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 cursor-pointer"
            >
              <X size={24} />
            </button>
          </div>

          <div className="grid md:grid-cols-5 gap-8 p-4 md:p-6 bg-white">
            {/* Customer Information Form - 3/5 width */}
            <div className="md:col-span-3 bg-white p-4 md:p-6 rounded-lg border border-gray-200 shadow-sm">
              <h2 className="text-lg md:text-xl font-semibold mb-4 md:mb-6">
                Customer Information
              </h2>
              <div className="grid gap-4 md:gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name*</Label>
                    <Input
                      id="firstName"
                      placeholder="Write here"
                      className={inputStyle}
                      value={customerInfo.firstName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="apartment">
                      Apartment, floor, etc. (optional)
                    </Label>
                    <Input
                      id="apartment"
                      placeholder="Write here"
                      className={inputStyle}
                      value={customerInfo.apartment}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number*</Label>
                    <Input
                      id="phone"
                      placeholder="Write here"
                      className={inputStyle}
                      value={customerInfo.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="town">Town/City*</Label>
                    <Input
                      id="town"
                      placeholder="Write here"
                      className={inputStyle}
                      value={customerInfo.town}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Street Address*</Label>
                  <Input
                    id="address"
                    placeholder="Write here"
                    className={inputStyle}
                    value={customerInfo.address}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address*</Label>
                  <Input
                    id="email"
                    placeholder="Write here"
                    className={inputStyle}
                    value={customerInfo.email}
                    onChange={handleInputChange}
                    required
                    type="email"
                  />
                </div>
                <div className="text-xs text-muted-foreground">
                  <span className="text-red-500">*</span> Required fields
                </div>
              </div>
            </div>

            {/* Order Summary - 2/5 width */}
            <div className="md:col-span-2 p-4 md:p-6 rounded-lg border border-gray-200 bg-gray-50 shadow-sm">
              <h2 className="text-lg md:text-xl font-semibold mb-4">
                Order Summary
              </h2>
              <div className="space-y-4 w-full">
                {/* Products - Each product with quantity and price */}
                <div className="max-h-[200px] overflow-y-auto space-y-3 pr-2">
                  {products.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center"
                    >
                      <div className="flex items-center gap-2">
                        {item.image && (
                          <div className="w-10 h-10 rounded overflow-hidden flex-shrink-0">
                            <Image
                              src={item.image || "/placeholder.svg"}
                              alt={item.name}
                              width={40}
                              height={40}
                              className="object-cover w-full h-full"
                            />
                          </div>
                        )}
                        <span className="text-sm md:text-base line-clamp-1">
                          {item.name}
                        </span>
                      </div>
                      <div className="text-sm md:text-base whitespace-nowrap">
                        <span className="text-emerald-500">
                          ${item.price.toFixed(2)}
                        </span>{" "}
                        x{" "}
                        <span className="text-emerald-500">
                          {item.quantity}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Subtotal - Sum of all products */}
                <div className="flex justify-between items-center border-t pt-2">
                  <span className="font-medium">Subtotal</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>

                {/* Tax */}
                <div className="flex justify-between items-center">
                  <span className="font-medium">Tax ({taxRate}%)</span>
                  <span className="font-medium">${tax.toFixed(2)}</span>
                </div>

                {/* Delivery Options */}
                <div className="space-y-2 border-t pt-2">
                  <span className="font-medium block mb-2">
                    Delivery Options
                  </span>
                  <RadioGroup
                    value={deliveryMethod}
                    onValueChange={setDeliveryMethod}
                    className="space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="standard" id="standard" />
                        <Label htmlFor="standard">Standard Delivery</Label>
                      </div>
                      <span className="text-emerald-500">$100</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="pickup" id="pickup" />
                        <Label htmlFor="pickup">Personal Pickup</Label>
                      </div>
                      <span className="text-emerald-500">Free</span>
                    </div>
                  </RadioGroup>
                </div>

                {/* Payment Methods */}
                <span className="font-medium">Payment Methods</span>
                <div className="space-y-2">
                  <RadioGroup
                    value={paymentMethod}
                    onValueChange={setPaymentMethod}
                    className="space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="card" id="card" />
                        <Label htmlFor="card">Credit/Debit Card (Stripe)</Label>
                      </div>
                      <div className="flex space-x-1">
                        <div className="flex items-center justify-center">
                          <Image
                            width={40}
                            height={25}
                            src="/visa.svg"
                            alt="visa card"
                            className="object-contain w-8 h-5"
                          />
                        </div>
                        <div className="flex items-center justify-center">
                          <Image
                            width={40}
                            height={25}
                            src="/master.svg"
                            alt="master card"
                            className="object-contain w-8 h-5"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="cash" id="cash" />
                      <Label htmlFor="cash">Cash on Delivery</Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Button to initiate Stripe payment process */}
                {paymentMethod === "card" && !showStripeModal && (
                  <div className="flex flex-row justify-center">
                    <Button
                      text="Proceed to Secure Payment"
                      onClick={proceedToStripePayment}
                    />
                  </div>
                )}

                {paymentMethod === "cash" && (
                  <div className="flex flex-row justify-center">
                    <Button
                      text={
                        isProcessing
                          ? "Processing..."
                          : "Complete Purchase (Cash)"
                      }
                      onClick={handleCheckout}
                      disabled={isProcessing}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stripe Payment Modal */}
        {paymentMethod === "card" && showStripeModal && clientSecret && (
          <div className="fixed inset-0 bg-[#0d0e112d] bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-6 sm:p-8 rounded-lg shadow-xl w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Enter Card Details</h3>
                <button
                  onClick={() => {
                    setShowStripeModal(false);
                    setClientSecret(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>
              <Elements
                stripe={stripePromise}
                options={stripeOptions}
                key={clientSecret}
              >
                <StripeCheckoutForm
                  clientSecret={clientSecret!}
                  onSuccessfulPayment={handleSuccessfulStripePayment}
                />
              </Elements>
            </div>
          </div>
        )}
      </DialogContent>
      <AuthModal isOpen={modal} onClose={() => setModal(false)} />
    </Dialog>
  );
}
