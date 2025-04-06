"use client";
import Image from "next/image";
import ContactForm from "@/components/contactComponent/contact-component";
import HomeLink from "@/components/home-link";
import TextField from "@/components/text-field";

export default function Contact() {
  return (
    <div className="mx-2 sm:mx-4 md:mx-8 lg:mx-12 pt-10">
      <nav className="flex items-center mb-8 text-sm md:text-xl font-small capitalize">
        <HomeLink />
        <span className="mx-2 text-gray-400">/</span>
        <span className="text-red-500">Contact Us</span>
      </nav>
      <TextField text={"Contact Us"} />
      <div className="container w-full mx-auto flex flex-col-reverse md:flex-row items-center pb-20 gap-10 md:gap-0">
        <div className="w-full md:w-3/5">
          <ContactForm />
        </div>
        <div className="w-full md:w-2/5 flex justify-center">
          <div
            className="p-8 rounded-full w-[200px] h-[200px] md:w-[300px] md:h-[300px] flex items-center justify-center"
            style={{
              background:
                "radial-gradient(100% 100% at 50% 0%, #F8A51B 0%, rgba(248, 165, 27, 0.12) 100%)",
            }}
          >
            <Image
              src="/air.svg"
              alt="No product image available"
              width={150}
              height={150}
              className="object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
