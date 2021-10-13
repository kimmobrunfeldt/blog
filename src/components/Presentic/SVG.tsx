import React from "react";
import { overrideTw } from "src/util/site";

async function getUrl(url: string): Promise<string> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTPStatusError: ${response.status} - Error fetching SVG`);
  }
  const text = await response.text();
  return text;
}

export type SVGProps = {
  src: string;
  className?: string;
  alt?: JSX.IntrinsicElements["img"]["alt"];
  title: JSX.IntrinsicElements["img"]["title"];
  maxWidth: React.CSSProperties["maxWidth"];
  errorElement?: React.ReactNode;
};

export const SVG = React.forwardRef<HTMLDivElement, SVGProps>((props, ref) => {
  const {
    src,
    alt,
    title,
    maxWidth,
    className = "",
    errorElement = "Error fetching SVG",
  } = props;
  const [svg, setSvg] = React.useState<string>();
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    (async () => {
      try {
        setSvg(await getUrl(src));
      } catch (error: any) {
        console.error(error);
        setError(error);
      }
    })();
  }, [src]);

  const commonProps = {
    style: { maxWidth },
    className: overrideTw("mx-auto", className),
  };

  if (error) {
    return <div {...commonProps}>{errorElement}</div>;
  }

  if (!svg) {
    return (
      <div {...commonProps}>
        <noscript>Animation requires JavaScript</noscript>
        <img alt={alt} title={title} src={src} />
      </div>
    );
  }

  return (
    <div {...commonProps} ref={ref} dangerouslySetInnerHTML={{ __html: svg }} />
  );
});

// A version of the component that never re-renders
// Useful when SVG manipulation is done outside react
export const ImmutableSVG = React.memo(SVG, () => true);
