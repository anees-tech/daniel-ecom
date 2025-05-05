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
import { toast } from "react-toastify";
import Image from "next/image";
import TextField from "@/components/text-field";
import Button from "@/components/button";
import { useTaxStore } from "@/context/taxContext";
import InvoiceModal from "./invoice-modal";
import { addOrderToUserProfile, Order } from "@/lib/orders";

export default function Payments() {
  const { cart, clearCart } = useCartStore();
  const { user } = useUser();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState("standard");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedCard, setSelectedCard] = useState("mastercard");
  const { taxRate, setTaxRate } = useTaxStore();
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    firstName: "",
    apartment: "",
    phone: "",
    town: "",
    address: "",
    email: "",
  });

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

  const [invoiceData, setInvoiceData] = useState<
    InvoiceModalProps | undefined
  >();
  // Handle hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const subtotal = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const deliveryFee = deliveryMethod === "standard" ? 100 : 0;
  const tax = subtotal * (taxRate / 100);
  const totalPrice = subtotal + tax + deliveryFee;

  const handleBankClick = () => {
    setShowPaymentModal(true);
  };

  const handleInputChange = (e: any) => {
    const { id, value } = e.target;
    setCustomerInfo((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleCheckout = async () => {
    // Check if user is logged in
    if (!user) {
      toast.error("You must be logged in to place an order");
      router.push("/?toast=not-logged-in");
      return;
    }

    // Close payment modal if open
    if (showPaymentModal) {
      setShowPaymentModal(false);
    }

    try {
      // Create order object for Firestore
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
          email: customerInfo.email || user.email || "guest@example.com",
          address: customerInfo.address || "Address not provided",
          city: customerInfo.town || "City not provided",
          phone: customerInfo.phone || "Phone not provided",
          apartment: customerInfo.apartment || "",
        },
        paymentMethod:
          paymentMethod === "bank"
            ? `Credit Card (${selectedCard})`
            : "Cash on Delivery",
        paymentDetails:
          paymentMethod === "bank"
            ? {
                cardType: selectedCard,
                lastFour: "4242",
                transactionId: "TXN" + Math.floor(Math.random() * 1000000),
                date: new Date().toLocaleDateString(),
                time: new Date().toLocaleTimeString(),
                status: "Completed",
              }
            : {
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

      // Clear cart after successful order
      clearCart();

      toast.success("Order placed successfully!");
      router.push("/orders");
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("Failed to place order. Please try again.");
    }
  };

  // Custom input style class
  const inputStyle =
    "search bg-white pl-8 focus:border-orange-500 focus:ring-red-500/20 rounded-full border border-gray-400";

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
          {/* Customer Information Form - 3/5 width */}
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
              <div className="flex flex-col md:grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    placeholder="Write here"
                    className={inputStyle}
                    value={customerInfo.phone}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="town">Town/City</Label>
                  <Input
                    id="town"
                    placeholder="Write here"
                    className={inputStyle}
                    value={customerInfo.town}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Street Address</Label>
                <Input
                  id="address"
                  placeholder="Write here"
                  className={inputStyle}
                  value={customerInfo.address}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  placeholder="Write here"
                  className={inputStyle}
                  value={customerInfo.email}
                  onChange={handleInputChange}
                />
              </div>
              <div className="text-xs text-muted-foreground">
                <span className="text-red-500">*</span> Save this information
                for faster check-out next time
              </div>
            </div>
          </div>
          {/* Order Summary - 2/5 width */}
          <div className="md:col-span-2 p-6 rounded-lg border border-gray-200 bg-gray-50 shadow-md">
            <h2 className="text-xl font-semibold mb-4">Cart Total</h2>
            <div className="space-y-4 w-full">
              {/* Cart Items - Each product with quantity and price */}
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center"
                >
                  <span>{item.name}</span>
                  <div>
                    <span className="text-emerald-500">${item.price}</span> x{" "}
                    <span className="text-emerald-500">{item.quantity}</span>
                  </div>
                </div>
              ))}

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
                <span className="font-medium block mb-2">Delivery Options</span>
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
                      <RadioGroupItem
                        value="bank"
                        id="bank"
                        onClick={handleBankClick}
                      />
                      <Label htmlFor="bank">Banks</Label>
                    </div>
                    <div className="flex space-x-1">
                      <div className=" flex items-center justify-center">
                        <Image
                          width={50}
                          height={50}
                          src="/visa.svg"
                          alt="master card"
                          className="object-contain w-10 h-10"
                        />
                      </div>
                      <div className="flex items-center justify-center">
                        <Image
                          width={50}
                          height={50}
                          src="/master.svg"
                          alt="master card"
                          className="object-contain w-10 h-10"
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

              {/* Total */}
              <div className="flex justify-between items-center border-t pt-2">
                <span className="font-bold">Total</span>
                <span className="font-bold">
                  ${cart.length > 0 && totalPrice.toFixed(2)}
                </span>
              </div>

              {/* Submit Button */}
              <div className="flex flex-row justify-center">
                <Button text="Checkout" onClick={handleCheckout} />
              </div>
            </div>
          </div>
        </div>
        {/* Payment Modal */}
        {showPaymentModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 w-full">
            <div className="bg-white rounded-lg p-6 w-auto relative">
              {/* Close button */}
              <button
                onClick={() => setShowPaymentModal(false)}
                className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
              <div className="md:grid md:grid-cols-2 md:gap-6">
                {/* Card selection - Left side on md+ screens, top on mobile */}
                <div className="flex flex-col gap-4 mb-6 md:mb-0">
                  <button
                    onClick={() => setSelectedCard("mastercard")}
                    className={`border rounded-lg p-4 flex items-center justify-center ${
                      selectedCard === "mastercard"
                        ? "border-red-500"
                        : "border-gray-200"
                    }`}
                  >
                    <div className="flex flex-col justify-center items-center">
                      <div>
                        <Image
                          width={50}
                          height={50}
                          src="/master.svg"
                          alt="master card"
                          className="object-contain w-10 h-10"
                        />
                      </div>
                      <div className="font-medium text-sm">Master card</div>
                    </div>
                  </button>
                  <button
                    onClick={() => setSelectedCard("visa")}
                    className={`border rounded-lg p-4 flex items-center justify-center ${
                      selectedCard === "visa"
                        ? "border-red-500"
                        : "border-gray-200"
                    }`}
                  >
                    <div className="flex flex-col justify-center items-center">
                      <div>
                        <Image
                          width={50}
                          height={50}
                          src="/visa.svg"
                          alt="visa card"
                          className="object-contain w-10 h-10"
                        />
                      </div>
                      <div className="font-medium text-sm">Visa</div>
                    </div>
                  </button>
                </div>
                {/* Form fields - Right side on md+ screens, bottom on mobile */}
                <div>
                  {/* Account number */}
                  <div className="mb-4">
                    <p className="text-sm mb-2">Account number</p>
                    <Input placeholder="Write here" className={inputStyle} />
                  </div>
                  {/* Expiration date and CVV */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm mb-2">Expiration date</p>
                      <Input
                        placeholder="Write here"
                        className={inputStyle}
                        type="date"
                      />
                    </div>
                    <div>
                      <p className="text-sm mb-2">CVV</p>
                      <Input placeholder="Write here" className={inputStyle} />
                    </div>
                  </div>
                  {/* Street Address */}
                  <div className="mb-6">
                    <p className="text-sm mb-2">Street Address</p>
                    <Input placeholder="Write here" className={inputStyle} />
                  </div>
                </div>
              </div>
              {/* Save button */}
              <div className="flex flex-row justify-center">
                <Button text="Save" onClick={handleCheckout} />
              </div>
            </div>
          </div>
        )}
      </div>
      <Image
        src="/BG-Customer-reviews.png"
        alt="Customer Reviews Background"
        fill
        className="object-contain absolute -z-50 bottom-50"
      />
    </div>
  );
}
