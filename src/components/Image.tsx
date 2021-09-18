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
      <a href={otherImageProps.src} rel="noreferrer" target="_blank">
        <img
          className="mx-auto w-full"
          {...otherImageProps}
          style={{ maxWidth }}
        >
          {children}
        </img>
      </a>

      {caption && <p className="italic text-sm mt-4 text-center">{caption}</p>}
    </div>
  );
}
