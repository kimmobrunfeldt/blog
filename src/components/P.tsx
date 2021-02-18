import React from "react";

export type ParagraphProps = {
  children?: React.ReactNode;
  className?: string;
};

export const textColor = "text-gray-700";

export function P({ children, className = "", ...otherProps }: ParagraphProps) {
  return (
    <p {...otherProps} className={`font-sans ${textColor} ${className}`}>
      {children}
    </p>
  );
}
