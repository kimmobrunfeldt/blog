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
  height: string;
  alt: JSX.IntrinsicElements["img"]["alt"];
  title?: JSX.IntrinsicElements["img"]["title"];
  initialAnimateToSlide?: number;
  initialAnimateDuration?: number;
  initialAnimationTriggerTop?: string;
  duration?: number;
  maxWidth?: React.CSSProperties["maxWidth"];
};

export function Presentic({
  src,
  alt,
  title,
  initialAnimateToSlide,
  initialAnimateDuration = 1600,
  initialAnimationTriggerTop = "30%",
  duration = 800,
  width = "100%",
  maxWidth,
  height,
}: PresenticProps) {
  const [presentation, setPresentation] = React.useState<
    ReturnType<typeof initialize> | undefined
  >(undefined);
  const svgRef = React.useCallback((divEl: HTMLDivElement) => {
    if (divEl !== null) {
      const svgEl = divEl.children[0] as SVGSVGElement;

      const p = initialize(document, svgEl, {
        initialAnimateToSlide,
        initialAnimateDuration,
        initialAnimationTriggerTop,
        duration,
      });

      const original = {
        width: parseFloat(svgEl.getAttribute("width") || "1"),
        height: parseFloat(svgEl.getAttribute("height") || "1"),
      };
      if (isUndefined(width)) {
        svgEl.removeAttribute("width");
      } else {
        svgEl.setAttribute("width", String(width));
      }

      if (isUndefined(height)) {
        svgEl.removeAttribute("height");
      } else {
        if (height === "autoLock") {
          const newPxWidth = svgEl.clientWidth;
          const lockedPxHeight =
            (newPxWidth / original.width) * original.height;
          svgEl.setAttribute("height", `${lockedPxHeight}`);
        } else {
          svgEl.setAttribute("height", height);
        }
      }

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

      <ImmutableSVG
        alt={alt}
        title={title}
        maxWidth={maxWidth}
        ref={svgRef}
        src={src}
      />
    </div>
  );
}
