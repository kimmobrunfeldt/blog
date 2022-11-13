import React from "react";
import { overrideTw } from "src/util/site";

export type ImageProps = JSX.IntrinsicElements["img"] & {
  caption?: string;
  maxWidth?: React.CSSProperties["maxWidth"];
  children?: React.ReactNode;
  wrapperClassName?: string;
  sources: JSX.IntrinsicElements["source"][];
};

export function Image({
  children,
  caption,
  sources,
  maxWidth,
  wrapperClassName = "",
  ...otherImageProps
}: ImageProps) {
  return (
    <div className={overrideTw("my-12", wrapperClassName)}>
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
