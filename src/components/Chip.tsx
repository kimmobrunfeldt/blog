import React from "react";

export type ChipProps = JSX.IntrinsicElements["span"] & {
  children?: React.ReactNode;
};

export function Chip({ children }: ChipProps) {
  return (
    <span
      style={{ color: "currentColor", borderColor: "currentColor " }}
      className="rounded-full border text-xs pb-0.5 px-2 whitespace-nowrap"
    >
      {children}
    </span>
  );
}
