"use client";

import type React from "react";
import { useState } from "react";
import { Send } from "lucide-react";
import { toast } from "sonner";
import { useUser } from "@/context/userContext";
import { AuthModal } from "@/components/auth-modal";
import emailjs from "emailjs-com";

export default function ContactForm() {
  const [modal, setModal] = useState(false);
  const { user } = useUser();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      setModal(true);
      toast.error("User must be logged in to contact.");
      return;
    }

    const { firstName, lastName, phoneNumber, email, message } = formData;
    const fullName = `${firstName} ${lastName}`;
    const currentTime = new Date().toLocaleString();

    const templateParams = {
      name: fullName,
      message: `${message}\n\n📞 Phone: ${phoneNumber}\n📧 Email: ${email}`,
      time: currentTime,
      title: `Contact Form Submission from ${fullName}`,
    };

    try {
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        templateParams,
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
      );

      toast.success("Message has been sent successfully");
      setFormData({
        firstName: "",
        lastName: "",
        phoneNumber: "",
        email: "",
        message: "",
      });
    } catch (error) {
      console.error("EmailJS Error:", error);
      toast.error("Failed to send message. Try again later.");
    }
  };

  return (
    <div className="w-full rounded-xl bg-white p-6 shadow-lg">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col md:flex-row md:gap-6">
          <div className="flex-1 space-y-4">
            {/* First Name */}
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-normal text-gray-700"
              >
                First Name*
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                placeholder="Write Here"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="mt-1 w-full rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-sm focus:border-red-500 focus:outline-none"
              />
            </div>

            {/* Last Name */}
            <div>
              <label
                htmlFor="lastName"
                className="block text-sm font-normal text-gray-700"
              >
                Last Name*
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                placeholder="Write Here"
                value={formData.lastName}
                onChange={handleChange}
                required
                className="mt-1 w-full rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-sm focus:border-red-500 focus:outline-none"
              />
            </div>

            {/* Phone Number */}
            <div>
              <label
                htmlFor="phoneNumber"
                className="block text-sm font-normal text-gray-700"
              >
                Phone Number
              </label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                placeholder="Write Here"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="mt-1 w-full rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-sm focus:border-red-500 focus:outline-none"
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-normal text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Write Here"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 w-full rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-sm focus:border-red-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Message Textarea */}
          <div className="mt-4 flex-1 md:mt-0">
            <label
              htmlFor="message"
              className="block text-sm font-normal text-gray-700"
            >
              Message
            </label>
            <textarea
              id="message"
              name="message"
              placeholder="Write Here"
              value={formData.message}
              onChange={handleChange}
              rows={7}
              className="mt-1 h-full w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-sm focus:border-red-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-10 flex justify-center">
          <button
            type="submit"
            className="flex items-center gap-1 rounded-full bg-gradient-to-r from-[#EB1E24] via-[#F05021] to-[#F8A51B] px-5 py-2 text-sm font-medium text-white transition-all duration-500 ease-out transform hover:shadow-xl cursor-pointer hover:bg-right hover:from-[#EB1E24] hover:via-[#F05021] hover:to-[#ff3604]"
          >
            <Send className="h-4 w-4" />
            Send
          </button>
        </div>
      </form>

      {/* Modal */}
      <AuthModal isOpen={modal} onClose={() => setModal(false)} />
    </div>
  );
}
