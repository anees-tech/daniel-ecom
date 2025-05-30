"use client";
import { useCartStore } from "@/context/addToCartContext";
import { useEffect, useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import HomeLink from "@/components/home-link";
import Link from "next/link";
import { useUser } from "@/context/userContext";
import { useRouter } from "next/navigation";
import Image from "next/image";
import TextField from "@/components/text-field";
import Button from "@/components/button";
import { useTaxStore } from "@/context/taxContext";
import { addOrderToUserProfile, Order } from "@/lib/orders";
import { AuthModal } from "@/components/auth-modal";
import { toast } from "sonner";

// Add these imports for Stripe
import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";

// Initialize Stripe.js with your publishable key
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

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
      {errorMessage && <div className="text-red-500 text-sm">{errorMessage}</div>}
    </form>
  );
};

export default function Payments() {
  const { cart, clearCart } = useCartStore();
  const { user } = useUser();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState("standard");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const { taxRate } = useTaxStore();
  const [modal, setModal] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    firstName: "",
    apartment: "",
    phone: "",
    town: "",
    address: "",
    email: "",
  });

  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isStripeReady, setIsStripeReady] = useState(false);
  const [showStripeModal, setShowStripeModal] = useState(false); // New state for modal visibility

  interface InvoiceModalProps {
    isOpen: boolean;
    onClose: () => void;
    orderData: {
      status: string;
      invoice: { invoiceId: string; details: string; date: string };
      id: string;
      items: any[];
      customerInfo: {
        name: string;
        email: string;
        address: string;
        city: string;
        phone: string;
        apartment: string;
      };
      subtotal: number;
      tax: number;
      shipping: number;
      total: number;
      paymentMethod: string;
      paymentDetails?: {
        cardType?: string;
        lastFour?: string;
        transactionId: string;
        date: string;
        time?: string;
        status: string;
        expectedDelivery?: string;
      };
    };
  }

  const [invoiceData, setInvoiceData] = useState<InvoiceModalProps | undefined>();

  useEffect(() => {
    if (user && customerInfo.email === "") {
      setCustomerInfo((prev) => ({ ...prev, email: user.email || "" }));
    }
    if (!user) {
      setModal(true);
      toast.error("User Must be logged in to make any kind of Payments.");
    }
    setMounted(true);
  }, [user]);

  if (!mounted) {
    return null;
  }

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

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

  const createPaymentIntent = async () => {
    if (totalPrice <= 0) {
      toast.error("Cart is empty or total is zero.");
      return;
    }
    try {
      console.log("FRONTEND: Attempting to create payment intent with amount:", totalPrice);
      const response = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount: totalPrice }),
      });

      console.log("FRONTEND: Response status from /api/create-payment-intent:", response.status);
      const data = await response.json();
      console.log("FRONTEND: Response data from /api/create-payment-intent:", data);

      if (data.clientSecret) {
        console.log("FRONTEND: clientSecret received:", data.clientSecret);
        setClientSecret(data.clientSecret);
        setShowStripeModal(true); // Show the modal
        console.log("FRONTEND: setShowStripeModal set to true");
      } else {
        toast.error(data.error || "Failed to initialize payment.");
        setIsStripeReady(false);
        console.error("FRONTEND: No clientSecret in response or error:", data.error);
      }
    } catch (error) {
      console.error("FRONTEND: Failed to create payment intent (catch block):", error);
      toast.error("Failed to initialize payment. Please try again.");
      setIsStripeReady(false);
    }
  };

  const proceedToStripePayment = async () => {
    console.log("FRONTEND: proceedToStripePayment called");
    if (!user) {
      setModal(true);
      toast.error("User Must be logged in to make any kind of Payments.");
      return;
    }
    if (cart.length === 0) {
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
      const order: Order = {
        items: cart.map((item) => ({
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
      clearCart();
      toast.success("Order placed successfully with Stripe!");
      router.push("/orders");
    } catch (error) {
      console.error("Error placing order after Stripe payment:", error);
      toast.error("Failed to finalize order after payment. Please contact support.");
    }
  };

  const handleCashCheckout = async () => {
    if (!user) {
      setModal(true);
      toast.error("User Must be logged in to make any kind of Payments.");
      return;
    }
    if (cart.length === 0) {
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
      toast.error("Please fill in all required customer information fields before checkout.");
      return;
    }

    try {
      const order: Order = {
        items: cart.map((item) => ({
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
        paymentMethod: "Cash on Delivery",
        paymentDetails: {
          transactionId: "COD" + Math.floor(Math.random() * 1000000),
          status: "Pending",
          date: new Date().toLocaleDateString(),
          expectedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        },
        invoice: {
          invoiceId: `INV-${Date.now()}`,
          date: new Date().toISOString(),
          details: `Invoice for order placed on ${new Date().toLocaleDateString()}`,
        },
        createdAt: new Date().toISOString(),
        status: "Pending",
      };
      await addOrderToUserProfile(user!.uid, order);
      clearCart();
      toast.success("Order placed successfully! (Cash on Delivery)");
      router.push("/orders");
    } catch (error) {
      console.error("Error placing cash order:", error);
      toast.error("Failed to place cash order. Please try again.");
    }
  };

  const inputStyle =
    "search bg-white pl-8 focus:border-orange-500 focus:ring-red-500/20 rounded-full border border-gray-400";

 const stripeOptions: StripeElementsOptions = {
  clientSecret: clientSecret || undefined,
  appearance: {
    theme: "stripe",
  },
};

  return (
    <div className="relative pb-20 h-full">
      <div className="mt-0">
        <nav className="py-8 flex items-center mb-4 text-md md:text-xl font-small capitalize gap-1 md:gap-1 px-4 sm:px-6 md:px-8 lg:px-12">
          <HomeLink />
          <span className="mx-2 text-gray-400">/</span>
          <Link href={"/cart"} className="text-gray-400 hover:text-gray-700">
            Cart
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-red-500">Payment</span>
        </nav>
        <TextField text={"Payment"} />
        <div className="grid md:grid-cols-5 gap-8 px-2 sm:px-4 md:px-8 lg:px-12">
          <div className="md:col-span-3 bg-white p-6 rounded-lg border border-gray-200 shadow-md">
            <h2 className="text-xl font-semibold mb-6">Customer Information</h2>
            <div className="grid gap-6">
              <div className="flex flex-col md:grid grid-cols-2 gap-4">
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
                  <Label htmlFor="apartment">Apartment, floor, etc. (optional)</Label>
                  <Input
                    id="apartment"
                    placeholder="Write here"
                    className={inputStyle}
                    value={customerInfo.apartment}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="flex flex-col md:grid grid-cols-2 gap-4">
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
                  type="email"
                  required
                />
              </div>
              <div className="text-xs text-muted-foreground">
                <span className="text-red-500">*</span> Required fields. Save this information for faster check-out next time
              </div>
            </div>
          </div>
          <div className="md:col-span-2 p-6 rounded-lg border border-gray-200 bg-gray-50 shadow-md">
            <h2 className="text-xl font-semibold mb-4">Cart Total</h2>
            <div className="space-y-4 w-full">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between items-center">
                  <span>{item.name}</span>
                  <div>
                    <span className="text-emerald-500">${item.price}</span> x{" "}
                    <span className="text-emerald-500">{item.quantity}</span>
                  </div>
                </div>
              ))}
              <div className="flex justify-between items-center border-t pt-2">
                <span className="font-medium">Subtotal</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Tax ({taxRate}%)</span>
                <span className="font-medium">${tax.toFixed(2)}</span>
              </div>
              <div className="space-y-2 border-t pt-2">
                <span className="font-medium block mb-2">Delivery Options</span>
                <RadioGroup value={deliveryMethod} onValueChange={setDeliveryMethod} className="space-y-2">
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
              <span className="font-medium">Payment Methods</span>
              <div className="space-y-2">
                <RadioGroup
                  value={paymentMethod}
                  onValueChange={(value) => {
                    setPaymentMethod(value);
                    if (value === "card") {
                      setIsStripeReady(false);
                      setClientSecret(null);
                    } else {
                      setIsStripeReady(false);
                    }
                  }}
                  className="space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="card" id="card_stripe" />
                      <Label htmlFor="card_stripe">Card (Stripe)</Label>
                    </div>
                    <div className="flex space-x-1">
                      <Image width={30} height={30} src="/visa.svg" alt="Visa" className="object-contain w-8 h-8" />
                      <Image width={30} height={30} src="/master.svg" alt="Mastercard" className="object-contain w-8 h-8" />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="cash" id="cash" />
                    <Label htmlFor="cash">Cash on Delivery</Label>
                  </div>
                </RadioGroup>
              </div>
              <div className="flex justify-between items-center border-t pt-2">
                <span className="font-bold">Total</span>
                <span className="font-bold">${cart.length > 0 ? totalPrice.toFixed(2) : "0.00"}</span>
              </div>
              {/* Button to initiate Stripe payment process */}
              {paymentMethod === "card" && !showStripeModal && (
                <div className="flex flex-row justify-center mt-4">
                  <Button text="Proceed to Secure Payment" onClick={proceedToStripePayment} />
                </div>
              )}

              {/* Stripe Payment Modal */}
              {paymentMethod === "card" && showStripeModal && clientSecret && (
                <div className="fixed inset-0 bg-[#0d0e112d] bg-opacity-50 flex items-center justify-center z-50 p-4">
                  <div className="bg-white p-6 sm:p-8 rounded-lg shadow-xl w-full max-w-md">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-semibold">Enter Card Details</h3>
                      <button
                        onClick={() => {
                          setShowStripeModal(false);
                          setClientSecret(null); // Optionally clear client secret when closing
                        }}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <X size={24} />
                      </button>
                    </div>
                    <Elements stripe={stripePromise} options={stripeOptions} key={clientSecret}>
                      <StripeCheckoutForm clientSecret={clientSecret!} onSuccessfulPayment={handleSuccessfulStripePayment} />
                    </Elements>
                  </div>
                </div>
              )}

              {paymentMethod === "cash" && (
                <div className="flex flex-row justify-center mt-4">
                  <Button text="Checkout (Cash)" onClick={handleCashCheckout} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Image
        src="/BG-Customer-reviews.png"
        alt="Customer Reviews Background"
        fill
        className="object-contain absolute -z-50 bottom-50"
      />
      <AuthModal isOpen={modal} onClose={() => setModal(false)} />
    </div>
  );
}
