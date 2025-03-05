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
      className="flex items-center gap-2 px-6 py-3 text-white font-semibold rounded-full shadow-md transition-all
        bg-[linear-gradient(90deg,#eb5757,#f2994a)] hover:opacity-90"
    >
      {text}
      {showIcon && Icon && <Icon size={20} />}
    </button>
  );
};

export default Button;
