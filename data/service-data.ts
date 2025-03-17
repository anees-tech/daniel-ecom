import { Service } from "@/interfaces/service";

export const services: Service[] = [
  {
    id: "1",
    title: "Free Delivery",
    slug: "free-delivery",
    shortDescription: "Get your items delivered to your doorstep for free",
    description:
      "Enjoy our complimentary delivery service on all orders above $50. Our dedicated delivery team ensures your packages arrive safely and on time. We deliver to all major cities within 2-3 business days and to remote areas within 4-5 business days.",
    icon: "truck",
    images: [
      "/free.jpg?height=600&width=800",
      "/free2.jpg?height=500&width=700",
      "/free3.jpg?height=400&width=600",
    ],
    features: [
      "Free delivery on orders above $50",
      "Express delivery options available",
      "Real-time tracking system",
      "Secure handling of packages",
      "Weekend delivery available",
    ],
  },
  {
    id: "2",
    title: "Personal Pickup",
    slug: "personal-pickup",
    shortDescription: "Collect your order from our nearest store",
    description:
      "Skip the wait and pick up your order at your convenience from our nearest store. Once your order is ready, you'll receive a notification. Simply show your order confirmation and ID to collect your items. Our stores are open 7 days a week for your convenience.",
    icon: "map-pin",
    images: [
      "/free.jpg?height=600&width=800",
      "/free2.jpg?height=500&width=700",
      "/free3.jpg?height=400&width=600",
    ],
    features: [
      "No additional fees",
      "Skip shipping wait times",
      "Verify products before taking them home",
      "Extended pickup hours",
      "Curbside pickup option available",
    ],
  },
  {
    id: "3",
    title: "Same Day Delivery",
    slug: "same-day-delivery",
    shortDescription: "Get your order delivered on the same day",
    description:
      "Need your items urgently? Our same-day delivery service has you covered. Place your order before 12 PM, and we'll deliver it to you by the end of the day. This service is available in select cities and for eligible products.",
    icon: "clock",
    images: [
      "/free.jpg?height=600&width=800",
      "/free2.jpg?height=500&width=700",
      "/free3.jpg?height=400&width=600",
    ],
    features: [
      "Order by 12 PM for same-day delivery",
      "Available in select cities",
      "SMS notifications on delivery status",
      "Signature on delivery",
      "Special handling for fragile items",
    ],
  },
  {
    id: "4",
    title: "Gift Wrapping",
    slug: "gift-wrapping",
    shortDescription: "Make your gifts special with our wrapping service",
    description:
      "Make your gifts extra special with our premium gift wrapping service. Choose from a variety of wrapping papers, ribbons, and gift cards. Our expert gift wrappers ensure your presents look perfect for any occasion.",
    icon: "package",
    images: [
      "/free.jpg?height=600&width=800",
      "/free2.jpg?height=500&width=700",
      "/free3.jpg?height=400&width=600",
    ],
    features: [
      "Multiple wrapping paper options",
      "Personalized gift messages",
      "Eco-friendly wrapping available",
      "Special occasion themes",
      "Corporate gifting solutions",
    ],
  },
  {
    id: "5",
    title: "Flexible Payment",
    slug: "flexible-payment",
    shortDescription: "Multiple payment options for your convenience",
    description:
      "We offer a variety of payment methods to make your shopping experience as convenient as possible. Choose from credit/debit cards, digital wallets, buy-now-pay-later options, and more. All transactions are secure and protected.",
    icon: "credit-card",
    images: [
      "/free.jpg?height=600&width=800",
      "/free2.jpg?height=500&width=700",
      "/free3.jpg?height=400&width=600",
    ],
    features: [
      "Credit/debit card payments",
      "Digital wallet support",
      "Buy now, pay later options",
      "Secure payment gateway",
      "Installment plans available",
    ],
  },
  {
    id: "6",
    title: "24/7 Customer Support",
    slug: "customer-support",
    shortDescription: "We're always here to help you",
    description:
      "Our dedicated customer support team is available 24/7 to assist you with any queries or concerns. Reach us via phone, email, or live chat. We're committed to providing you with the best shopping experience and resolving any issues promptly.",
    icon: "life-buoy",
    images: [
      "/free.jpg?height=600&width=800",
      "/free2.jpg?height=500&width=700",
      "/free3.jpg?height=400&width=600",
    ],
    features: [
      "24/7 availability",
      "Multiple contact channels",
      "Quick response time",
      "Dedicated account managers",
      "Comprehensive FAQ section",
    ],
  },
];

export const getServiceBySlug = (slug: string): Service | undefined => {
  return services.find((service) => service.slug === slug);
};
