import React from "react";

export type LinkProps = JSX.IntrinsicElements["a"] & {
  children?: React.ReactNode;
  className?: string;
  color?: string;
};

export const linkColor = "text-amber-6 hover:text-amber-5 active:text-amber-7";

export function Link({
  children,
  color,
  className = "",
  ...otherProps
}: LinkProps) {
  const cls = color ? linkColor.replace(/amber/g, color) : linkColor;
  return (
    <a {...otherProps} className={`${cls} cursor-pointer ${className}`}>
      {children}
    </a>
  );
}
