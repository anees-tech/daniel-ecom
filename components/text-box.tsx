import React from "react";
import Image from "next/image";

interface TextBoxProps {
  text: string;
}

const TextBox: React.FC<TextBoxProps> = ({ text }) => {
  return (
    <div className="flex flex-row items-center -translate-x-7 relative">
      {text === "Today's" ? (
        <Image
          src={"/tag.svg"}
          alt={"Tag"}
          width={100}
          height={100}
          className="w-20 h-20 md:w-25 md:h-25 absolute -top-9 left-38 md:left-41 md:-top-11"
        />
      ) : null}
      <div className="w-auto flex flex-row justify-end pl-20 md:text-xl py-1 bg-[#ff0000] text-white rounded-full">
        <h1 className="text-right pr-5">{text}</h1>
      </div>
    </div>
  );
};

export default TextBox;
