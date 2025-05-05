"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, ToasterProps as SonnerToasterProps } from "sonner";

// 1. Define your props correctly
interface CustomToasterProps extends SonnerToasterProps {
  bg_color?: string;
  text_color?: string;
}

// 2. Accept everything inside a single props object
const Toaster = ({
  bg_color = "red",
  text_color = "white",
  ...props
}: CustomToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as SonnerToasterProps["theme"]}
      className="toaster group"
      style={
        {
          "--normal-bg": bg_color,
          "--normal-text": text_color,
          "--normal-border": "var(--border)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
