import React from "react";
import Highlight, { defaultProps, Language } from "prism-react-renderer";

export type PrismProps = {
  children: string;
  className?: string;
};

function findLanguage(className: string): Language {
  if (!className) {
    return "no-highlight" as Language;
  }

  const lang = className
    .split(/\s+/)
    .find((name) => name.indexOf("language-") !== -1);
  if (lang) {
    return lang.split("language-")[1].trim() as Language;
  }

  // TODO: this is not wise
  return "no-highlight" as Language;
}

export function Prism({ children, className = "" }: PrismProps) {
  const language = findLanguage(className);
  return (
    <Highlight
      {...defaultProps}
      code={children}
      language={language}
      theme={undefined}
    >
      {({ style, tokens, getLineProps, getTokenProps }) => (
        <code className={`language-${language}`} style={style}>
          {tokens.map((line, i) => {
            const isLastLine = i === tokens.length - 1;
            const isEmptyLine = line.length === 1 && line[0].empty;
            if (isLastLine && isEmptyLine) {
              // Remove last empty line
              return null;
            }

            return (
              <div key={i} {...getLineProps({ line, key: i })}>
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token, key })} />
                ))}
              </div>
            );
          })}
        </code>
      )}
    </Highlight>
  );
}
