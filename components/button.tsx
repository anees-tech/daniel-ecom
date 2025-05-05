"use client";
import React from "react";
import { IconType } from "react-icons";

interface ButtonProps {
  text: string;
  onClick?: () => void;
  showIcon?: boolean;
  Icon?: IconType;
  type?: "button" | "submit" | "reset"; // Add type here
}

const Button: React.FC<ButtonProps> = ({
  text,
  onClick,
  showIcon = false,
  Icon,
  type = "button", // Default value if not provided
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className="flex items-center gap-2 px-4 md:px-5 py-2 md:py-3 
    bg-gradient-to-r from-[#EB1E24] via-[#F05021] to-[#F8A51B] bg-[length:200%_200%] bg-left
    text-md md:text-lg text-white font-semibold rounded-full shadow-lg 
    transition-all duration-500 ease-out transform hover:shadow-xl cursor-pointer text-center
    hover:bg-right hover:from-[#EB1E24] hover:via-[#F05021] hover:to-[#ff3604] active:bg-right hover:from-[#EB1E24] hover:via-[#F05021] hover:to-[#ff3604]"
    >
      {text}
      {showIcon && Icon && <Icon size={20} />}
    </button>
  );
};

export default Button;
