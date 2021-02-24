import React from "react";

export type ContentWrapperProps = JSX.IntrinsicElements["div"] & {
  className?: string;
};

export function ContentWrapper({
  className = "",
  ...otherProps
}: ContentWrapperProps) {
  return (
    <div {...otherProps} className={`px-4 md:px-0 ${className}`}>
      {otherProps.children}
    </div>
  );
}
