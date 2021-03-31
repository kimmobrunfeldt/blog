import React from "react";
import isUndefined from "lodash/isUndefined";
import { ImmutableSVG } from "./SVG";
import { initialize } from "./presentation";
import { linkStyles } from "../Link";
import { Icon } from "@iconify/react";
import leftIcon from "@iconify/icons-teenyicons/left-circle-outline";
import rightIcon from "@iconify/icons-teenyicons/right-circle-outline";

export type PresenticProps = {
  src: string;
  width: React.CSSProperties["width"];
  height: React.CSSProperties["height"];
  initialAnimateToSlide?: number;
  initialAnimateDuration?: number;
  duration?: number;
  maxWidth?: React.CSSProperties["maxWidth"];
};

export function Presentic({
  src,
  initialAnimateToSlide,
  initialAnimateDuration = 1600,
  duration = 800,
  width = "100%",
  maxWidth,
  height,
}: PresenticProps) {
  const [presentation, setPresentation] = React.useState<
    ReturnType<typeof initialize> | undefined
  >(undefined);
  const svgRef = React.useCallback((divEl) => {
    if (divEl !== null) {
      const svgEl = divEl.querySelector("svg");
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

      const p = initialize(document, svgEl, {
        initialAnimateToSlide,
        initialAnimateDuration,
        duration,
      });
      setPresentation(p);
    }
  }, []);

  React.useEffect(() => {
    return () => {
      if (!isUndefined(presentation)) {
        presentation.destroy();
      }
    };
  }, []);

  function next() {
    if (!isUndefined(presentation)) {
      presentation.next();
    }
  }

  function previous() {
    if (!isUndefined(presentation)) {
      presentation.previous();
    }
  }

  return (
    <div className="mt-12 mb-16 select-none">
      <ul className="flex flex-row justify-end mb-2">
        <li>
          <button
            type="button"
            style={{ top: "1px" }}
            className={`${linkStyles.rust} block`}
            title={"Previous"}
            aria-label={"Previous animation state"}
            onClick={previous}
          >
            <span style={{ fontSize: "1.3em" }}>
              <Icon className="box-content p-2" icon={leftIcon} />
            </span>
          </button>
        </li>
        <li>
          <button
            type="button"
            style={{ top: "1px" }}
            className={`${linkStyles.rust} block`}
            title={"Next"}
            aria-label={"Next animation state"}
            onClick={next}
          >
            <span style={{ fontSize: "1.3em" }}>
              <Icon className="box-content p-2" icon={rightIcon} />
            </span>
          </button>
        </li>
      </ul>

      <ImmutableSVG maxWidth={maxWidth} ref={svgRef} src={src} />
    </div>
  );
}
