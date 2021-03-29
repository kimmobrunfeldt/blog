import React from "react";
import isUndefined from "lodash/isUndefined";
import SVG from "react-inlinesvg";
import { initPresentation } from "./presentation";

export type PresenticProps = {
  src: string;
  width: React.CSSProperties["width"];
  height: React.CSSProperties["height"];
};

export function Presentic({ src, width = "100%", height }: PresenticProps) {
  const svgRef = React.useCallback((svgEl) => {
    if (svgEl !== null) {
      if (isUndefined(width)) {
        svgEl.removeAttribute("width");
      } else {
        svgEl.setAttribute("width", width);
      }

      if (isUndefined(height)) {
        svgEl.removeAttribute("height");
      } else {
        svgEl.setAttribute("height", height);
      }

      initPresentation(document, svgEl);
    }
  }, []);

  return <SVG className="my-12" innerRef={svgRef} src={src} />;
}
