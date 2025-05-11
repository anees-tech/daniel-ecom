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
  const [selectedCard, setSelectedCard] = useState("mastercard");
  const [isProcessing, setIsProcessing] = useState(false);
  const [modal, setModal] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    expDate: "",
    cvv: "",
    cardholderName: "",
  });
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

  const handleBankClick = () => {
    setShowPaymentModal(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setCustomerInfo((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleCardDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setCardDetails((prev) => ({
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

    // Validate card details if paying by card
    if (paymentMethod === "bank") {
      if (!cardDetails.cardNumber) {
        toast.error("Please enter your card number");
        return false;
      }
      if (!cardDetails.expDate) {
        toast.error("Please enter the card expiration date");
        return false;
      }
      if (!cardDetails.cvv) {
        toast.error("Please enter the CVV");
        return false;
      }
      if (!cardDetails.cardholderName) {
        toast.error("Please enter the cardholder name");
        return false;
      }
    }

    return true;
  };

  const handleCheckout = async () => {
    // Close payment modal if open
    if (showPaymentModal) {
      setShowPaymentModal(false);
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
      // Get last 4 digits of card number
      const lastFour = cardDetails.cardNumber
        ? cardDetails.cardNumber.slice(-4)
        : "****";

      // Create order object
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
        paymentMethod:
          paymentMethod === "bank"
            ? `Credit Card (${selectedCard})`
            : "Cash on Delivery",
        paymentDetails:
          paymentMethod === "bank"
            ? {
                cardType: selectedCard,
                lastFour: lastFour,
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
      const orderId = `ORD-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

      toast.success("Order placed successfully!");

      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess(orderId);
      } else {
        // Default behavior - redirect to orders page
        router.push("/orders");
      }

      onClose();
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("Failed to place order. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Custom input style class
  const inputStyle =
    "search bg-white pl-4 focus:border-orange-500 focus:ring-red-500/20 rounded-full border border-gray-400";

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
                        <RadioGroupItem
                          value="bank"
                          id="bank"
                          onClick={handleBankClick}
                        />
                        <Label htmlFor="bank">Credit/Debit Card</Label>
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

                {/* Total */}
                <div className="flex justify-between items-center border-t pt-2">
                  <span className="font-bold">Total</span>
                  <span className="font-bold">${totalPrice.toFixed(2)}</span>
                </div>

                {/* Submit Button */}
                <div className="flex flex-row justify-center">
                  <Button
                    text={isProcessing ? "Processing..." : "Complete Purchase"}
                    onClick={handleCheckout}
                    disabled={isProcessing}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Card Modal */}
        {showPaymentModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-4 md:p-6 w-[90%] max-w-md relative">
              {/* Close button */}
              <button
                onClick={() => setShowPaymentModal(false)}
                className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
              <h3 className="text-lg font-semibold mb-4">Payment Details</h3>
              <div className="space-y-6">
                {/* Card selection */}
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setSelectedCard("mastercard")}
                    className={`border rounded-lg p-3 flex items-center justify-center ${
                      selectedCard === "mastercard"
                        ? "border-red-500"
                        : "border-gray-200"
                    }`}
                  >
                    <div className="flex flex-col justify-center items-center">
                      <Image
                        width={40}
                        height={25}
                        src="/master.svg"
                        alt="master card"
                        className="object-contain w-8 h-5 mb-1"
                      />
                      <div className="font-medium text-xs">Mastercard</div>
                    </div>
                  </button>
                  <button
                    onClick={() => setSelectedCard("visa")}
                    className={`border rounded-lg p-3 flex items-center justify-center ${
                      selectedCard === "visa"
                        ? "border-red-500"
                        : "border-gray-200"
                    }`}
                  >
                    <div className="flex flex-col justify-center items-center">
                      <Image
                        width={40}
                        height={25}
                        src="/visa.svg"
                        alt="visa card"
                        className="object-contain w-8 h-5 mb-1"
                      />
                      <div className="font-medium text-xs">Visa</div>
                    </div>
                  </button>
                </div>

                {/* Form fields */}
                <div className="space-y-4">
                  {/* Card number */}
                  <div>
                    <Label htmlFor="cardNumber" className="text-sm">
                      Card number
                    </Label>
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      className={inputStyle}
                      value={cardDetails.cardNumber}
                      onChange={handleCardDetailsChange}
                    />
                  </div>

                  {/* Expiration date and CVV */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expDate" className="text-sm">
                        Expiration date
                      </Label>
                      <Input
                        id="expDate"
                        placeholder="MM/YY"
                        className={inputStyle}
                        value={cardDetails.expDate}
                        onChange={handleCardDetailsChange}
                      />
                    </div>
                    <div>
                      <Label htmlFor="cvv" className="text-sm">
                        CVV
                      </Label>
                      <Input
                        id="cvv"
                        placeholder="123"
                        className={inputStyle}
                        maxLength={4}
                        value={cardDetails.cvv}
                        onChange={handleCardDetailsChange}
                      />
                    </div>
                  </div>

                  {/* Cardholder name */}
                  <div>
                    <Label htmlFor="cardholderName" className="text-sm">
                      Cardholder name
                    </Label>
                    <Input
                      id="cardholderName"
                      placeholder="Name on card"
                      className={inputStyle}
                      value={cardDetails.cardholderName}
                      onChange={handleCardDetailsChange}
                    />
                  </div>
                </div>

                {/* Save button */}
                <div className="flex justify-center">
                  <Button
                    text="Save Card Details"
                    onClick={() => setShowPaymentModal(false)}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
      <AuthModal isOpen={modal} onClose={() => setModal(false)} />
    </Dialog>
  );
}
