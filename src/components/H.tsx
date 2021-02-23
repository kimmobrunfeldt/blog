import React, { useContext } from "react";
import { isUndefined } from "lodash";
import { overrideTw } from "src/util/site";

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

export function levelToClass(level: HeadingLevel): string {
  const size = {
    1: "text-8xl mt-20 mb-7",
    2: "text-5xl mt-12 mb-5",
    3: "text-3xl mt-9 mb-4",
    4: "text-2xl mt-7 mb-3",
    5: "text-xl mt-5 mb-2",
    6: "text-l mt-3 mb-1",
  }[level];

  return `${size} font-black text-gray-9 font-heading`;
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
};

export function H({
  children,
  className = "",
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
      className={overrideTw(baseCls, className)}
    >
      {children}
    </HeadingComponent>
  );
}
