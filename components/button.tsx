"use client";
import React from "react";
import { IconType } from "react-icons";

interface ButtonProps {
  text: string;
  onClick?: () => void;
  showIcon?: boolean;
  Icon?: IconType;
}

const Button: React.FC<ButtonProps> = ({
  text,
  onClick,
  showIcon = false,
  Icon,
}) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-3 md:px-5 py-1 md:py-2
        bg-gradient-to-r from-[#EB1E24] via-[#F05021] to-[#F8A51B] text-md text-white font-semibold rounded-full shadow-lg transition-transform duration-300 ease-in-out transform hover:scale-100 hover:shadow-lg active:scale-95 cursor-pointer"
    >
      {text}
      {showIcon && Icon && <Icon size={20} />}
    </button>
  );
};

export default Button;
