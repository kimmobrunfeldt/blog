import React from "react";

export type VideoProps = JSX.IntrinsicElements["video"] & {
  caption: string;
  children?: React.ReactNode;
  sources: JSX.IntrinsicElements["source"][];
};

export function Video({
  children,
  caption,
  sources,
  ...otherVideoProps
}: VideoProps) {
  return (
    <div className="my-12">
      <video {...otherVideoProps}>{children}</video>

      <p className="italic text-sm mt-4 text-center">{caption}</p>
    </div>
  );
}
