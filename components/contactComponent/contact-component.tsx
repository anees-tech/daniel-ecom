"use client";

import type React from "react";

import { useState } from "react";
import { Send } from "lucide-react";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    firstName: "",
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log("Form submitted:", formData);
    // Reset form after submission
    setFormData({
      firstName: "",
      phoneNumber: "",
      email: "",
      message: "",
    });
  };

  return (
    <div className="w-full rounded-xl bg-white p-6 shadow-lg">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col md:flex-row md:gap-6">
          {/* Left column - Input fields */}
          <div className="flex-1 space-y-4">
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
                className="mt-1 w-full rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-sm focus:border-gray-300 focus:outline-none"
              />
            </div>

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
                className="mt-1 w-full rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-sm focus:border-gray-300 focus:outline-none"
              />
            </div>

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
                className="mt-1 w-full rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-sm focus:border-gray-300 focus:outline-none"
              />
            </div>
          </div>

          {/* Right column - Message textarea */}
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
              className="mt-1 h-full w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-sm focus:border-gray-300 focus:outline-none"
            />
          </div>
        </div>

        <div className="mt-10 flex justify-center">
          <button
            type="submit"
            className="flex items-center gap-1 rounded-full  bg-gradient-to-r from-[#EB1E24] via-[#F05021] to-[#F8A51B] px-5 py-2 text-sm font-medium text-white hover:bg-red-600 focus:outline-none"
          >
            <Send className="h-4 w-4" />
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
