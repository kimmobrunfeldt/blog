import React from "react";

export type ImageProps = JSX.IntrinsicElements["img"] & {
  caption?: string;
  maxWidth?: React.CSSProperties["maxWidth"];
  children?: React.ReactNode;
  sources: JSX.IntrinsicElements["source"][];
};

export function Image({
  children,
  caption,
  sources,
  maxWidth,
  ...otherImageProps
}: ImageProps) {
  return (
    <div className="my-12">
      <img className="mx-auto" {...otherImageProps} style={{ maxWidth }}>
        {children}
      </img>

      {caption && <p className="italic text-sm mt-4 text-center">{caption}</p>}
    </div>
  );
}
