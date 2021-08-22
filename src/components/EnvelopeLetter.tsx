import React from "react";
import { Parallax } from "react-scroll-parallax";

export type EnvelopeLetterProps = {
  className?: string;
  children?: React.ReactNode;
};

export const EnvelopeLetter = ({
  children,
  className,
}: EnvelopeLetterProps) => {
  return (
    <div
      className={`envelope-letter ${className ? className : ""}`}
      style={{ paddingTop: "200px" }}
    >
      <div
        style={{ width: "560px", height: "290px" }}
        className="relative mx-auto"
      >
        <img
          className="absolute w-full"
          style={{ top: "-140px", left: 0 }}
          alt=""
          src="/envelope-back.svg"
        />
        <Parallax y={[0, -210]}>
          <div className="letter-container relative w-full h-full">
            <img
              className="relative bg-white rounded-sm"
              style={{ top: 0, left: "10px", width: "calc(100% - 20px)" }}
              alt=""
              src="/letter-background.svg"
            />
            <div
              className="absolute bg-white rounded-sm"
              style={{
                top: "20px",
                left: "30px",
                width: "calc(100% - 60px)",
                // Aspect ratio is not the same for the letter
                height: "calc(100% - 38px)",
              }}
            >
              {children}
            </div>
          </div>
        </Parallax>

        <img
          className="absolute w-full"
          style={{ top: 0, left: 0 }}
          alt=""
          src="/envelope-front.svg"
        />
      </div>
    </div>
  );
};
