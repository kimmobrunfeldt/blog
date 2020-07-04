import React from "react";

export type ParagraphProps = {
  children?: React.ReactNode;
  className?: string;
};

export function P({ children, className = "", ...otherProps }: ParagraphProps) {
  return (
    <p {...otherProps} className={`font-sans text-gray-700 ${className}`}>
      {children}
    </p>
  );
}
