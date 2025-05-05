"use client";
import React from "react";

interface TextFieldProps {
  text: string;
}

const TextField: React.FC<TextFieldProps> = ({ text }) => {
  return (
    <div className="flex justify-center mb-10 border-b border-gray-400 pb-4 mx-4 sm:mx-6 md:mx-8 lg:mx-12">
      <div className="bg-red-500 text-white px-8 py-2 rounded-full">
        <h1 className="text-sm md:text-xl font-medium">{text}</h1>
      </div>
    </div>
  );
};

export default TextField;
