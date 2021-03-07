import React, { useContext } from "react";
import isUndefined from "lodash/isUndefined";
import { overrideTw } from "src/util/site";

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

export function levelToClass(level: HeadingLevel): string {
  const size = {
    1: "text-5xl mt-12 mb-9",
    2: "text-3xl mt-9 mb-7",
    3: "text-2xl mt-7 mb-6",
    4: "text-xl mt-5 mb-4",
    5: "text-lg mt-3 mb-3",
    6: "text-base mt-2 mb-2",
  }[level];

  return size;
}

export const LevelContext = React.createContext(1 as HeadingLevel);

function ensureLevel(level: number): HeadingLevel {
  if (level < 1) {
    return 1;
  } else if (level > 6) {
    return 6;
  }

  return level as HeadingLevel;
}

export type LevelProps = {
  children?: React.ReactNode;
  className?: string;
};

export function HLevel(props: LevelProps) {
  const contextLevel = useContext(LevelContext);
  return (
    <LevelContext.Provider value={ensureLevel(contextLevel + 1)}>
      {props.children}
    </LevelContext.Provider>
  );
}

export type HeadingProps = {
  children?: React.ReactNode;
  className?: string;
  visualLevel?: HeadingLevel;
  color?: string;
  font?: "font-heading" | "font-sans";
  weight?: "font-black" | "font-bold";
};

export function H({
  children,
  className = "",
  color = "text-gray-9 dark:text-gray-2",
  font = "font-heading",
  weight = "font-black",
  visualLevel,
  ...otherProps
}: HeadingProps) {
  const contextLevel = useContext(LevelContext);
  const HeadingComponent = `h${contextLevel}` as const;
  const baseCls = levelToClass(
    isUndefined(visualLevel) ? contextLevel : visualLevel
  );

  return (
    <HeadingComponent
      {...otherProps}
      className={overrideTw(`${baseCls} ${font} ${weight} ${color}`, className)}
    >
      {children}
    </HeadingComponent>
  );
}
