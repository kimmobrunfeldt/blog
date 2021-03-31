import React from "react";

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
  maxWidth: React.CSSProperties["maxWidth"];
  errorElement?: React.ReactNode;
};

export const SVG = React.forwardRef<HTMLDivElement, SVGProps>((props, ref) => {
  const { src, maxWidth, errorElement = "Error fetching SVG" } = props;
  const [svg, setSvg] = React.useState<string>();
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    (async () => {
      try {
        setSvg(await getUrl(src));
      } catch (error) {
        console.error(error);
        setError(error);
      }
    })();
  }, [src]);

  if (error) {
    return <>{errorElement}</>;
  }

  if (!svg) {
    return <></>;
  }

  return (
    <div
      className="mx-auto"
      style={{ maxWidth }}
      ref={ref}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
});

// A version of the component that never re-renders
// Useful when SVG manipulation is done outside react
export const ImmutableSVG = React.memo(SVG, () => true);
