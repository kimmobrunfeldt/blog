import React from "react";
import { useInView } from "react-intersection-observer";

export type EnvelopeLetterProps = {
  activeLetter: number;
  className?: string;
  children?: React.ReactNode;
};

export const EnvelopeLetter = ({
  activeLetter,
  children,
  className,
}: EnvelopeLetterProps) => {
  const { ref, inView } = useInView({
    root: globalThis.window ? document.body : undefined,
    threshold: 0.5,
    triggerOnce: true,
  });

  return (
    <div
      ref={ref}
      className={`pt-52 sm:pt-72 envelope-letter overflow-hidden ${
        inView ? "envelope-letter-in-view" : ""
      } ${className ? className : ""}`}
    >
      <div className="relative w-full max-w-xs text-sm sm:max-w-[490px] lg:text-base lg:max-w-[560px] mx-auto">
        <img
          className="absolute w-full left-0 top-[-48%]"
          alt=""
          src="/envelope-back.svg"
        />
        {React.Children.map(children, (child, index) => {
          return (
            <div
              className={`${
                index === activeLetter ? "letter-active" : ""
              } absolute letter-container h-[130%] sm:h-full bg-white`}
              style={{
                left: "5px",
                width: "calc(100% - 10px)",
              }}
            >
              <div
                className="absolute bg-white rounded-sm"
                style={{
                  top: "16px",
                  right: "20px",
                  bottom: "16px",
                  left: "20px",
                }}
              >
                {child}
              </div>
            </div>
          );
        })}

        <img
          className="relative w-full pointer-events-none"
          style={{ top: 0, left: 0 }}
          alt=""
          src="/envelope-front.svg"
        />
      </div>
    </div>
  );
};
