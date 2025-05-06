"use client";
import React from "react";
import { IconType } from "react-icons";

interface ButtonProps {
  text: string;
  onClick?: () => void;
  showIcon?: boolean;
  Icon?: IconType;
  type?: "button" | "submit" | "reset";
  disabled?: boolean; // <-- Add disabled prop
}

const Button: React.FC<ButtonProps> = ({
  text,
  onClick,
  showIcon = false,
  Icon,
  type = "button",
  disabled = false, // <-- Default to false
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center gap-2 px-4 md:px-5 py-2 md:py-3 
      bg-gradient-to-r from-[#EB1E24] via-[#F05021] to-[#F8A51B] bg-[length:200%_200%] bg-left
      text-md md:text-md text-white font-semibold rounded-full shadow-lg 
      transition-all duration-500 ease-out transform hover:shadow-xl cursor-pointer text-center
      hover:bg-right hover:from-[#EB1E24] hover:via-[#F05021] hover:to-[#ff3604] active:bg-right
      ${disabled ? "opacity-50 cursor-not-allowed" : ""}
      `}
    >
      {text}
      {showIcon && Icon && <Icon size={20} />}
    </button>
  );
};

export default Button;
