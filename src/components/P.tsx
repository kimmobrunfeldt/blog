import React from "react";

export type ParagraphProps = {
  children?: React.ReactNode;
  className?: string;
};

export function P({ children, className = "", ...otherProps }: ParagraphProps) {
  return (
    <p
      {...otherProps}
      className={`max-w-xl font-sans mb-paragraph ${className}`}
    >
      {children}
    </p>
  );
}
