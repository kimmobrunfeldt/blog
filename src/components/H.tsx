import React, { useContext } from "react";

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

export function levelToClass(level: HeadingLevel): string {
  const size = {
    1: "text-8xl",
    2: "text-5xl",
    3: "text-3xl",
    4: "text-2xl",
    5: "text-xl",
    6: "text-l",
  }[level];

  return `${size} font-black text-gray-900 font-heading`;
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

export function Level(props: LevelProps) {
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
};

export function H({ children, className = "", ...otherProps }: HeadingProps) {
  const contextLevel = useContext(LevelContext);
  const HeadingComponent = `h${contextLevel}` as const;
  const baseCls = levelToClass(contextLevel);
  return (
    <HeadingComponent {...otherProps} className={`${baseCls} ${className}`}>
      {children}
    </HeadingComponent>
  );
}
