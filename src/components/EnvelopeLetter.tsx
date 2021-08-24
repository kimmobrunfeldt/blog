import cn from "classnames";
import React from "react";
import { useInView } from "react-intersection-observer";
import { AppContext } from "src/components/App";

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

  const context = React.useContext(AppContext);
  const [stateTheme, setStateTheme] = React.useState("light");
  React.useEffect(() => {
    setStateTheme(context.theme);
  }, [context.theme]);

  return (
    <div
      ref={ref}
      className={`pt-52 sm:pt-72 envelope-letter overflow-hidden ${
        inView ? "envelope-letter-in-view" : ""
      } ${className ? className : ""}`}
    >
      <div className="relative w-full max-w-xs text-sm sm:max-w-[490px] lg:text-base lg:max-w-[560px] mx-auto">
        <img
          className={cn("absolute w-full left-0 top-[-48%] keep-opacity")}
          alt=""
          src={`/envelope-back-${stateTheme}.svg`}
        />
        {React.Children.map(children, (child, index) => {
          return (
            <div
              className={`${
                index === activeLetter ? "letter-active" : ""
              } absolute letter-container h-[130%] sm:h-full dark:bg-gray-9 bg-white`}
              style={{
                left: "5px",
                width: "calc(100% - 10px)",
              }}
            >
              <div
                className="absolute bg-white dark:bg-gray-9 rounded-sm"
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
          className={cn("relative w-full pointer-events-none keep-opacity")}
          style={{ top: 0, left: 0 }}
          alt=""
          src={`/envelope-front-${stateTheme}.svg`}
        />
      </div>
    </div>
  );
};
