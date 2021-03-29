import isString from "lodash/isString";
import isFunction from "lodash/isFunction";
import get from "lodash/get";
import Tweenable from "shifty";
import * as svgUtil from "./svgUtil";

export type View = {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
};

type ViewportOptionsWithDefaults = {
  duration: number;
  easing: string;
  rootGroupClassName: string;
};

type ViewportOptionsWithoutDefaults = {
  injectCss?: string;
  svgClassNameOnMousedown?: string;
};

export type ViewportAnimateOptions = {
  duration?: number;
  easing?: string;
};

export type ViewportOptions = Partial<ViewportOptionsWithDefaults> &
  ViewportOptionsWithoutDefaults;

// Provides easy way to animate movement of SVG viewport, including the
// SVG canvas rotation.
// Injects a root `g` element to `svgDocument` for rotation purposes
export function viewport(
  svgDocument: HTMLDocument,
  svgElement: SVGSVGElement,
  optsIn: ViewportOptions = {}
) {
  const opts: ViewportOptionsWithDefaults & ViewportOptionsWithoutDefaults = {
    duration: 800,
    easing: "easeInOutCubic",
    rootGroupClassName: "presentation-root-group",
    ...optsIn,
  };

  const rootGroup = svgUtil.injectRootGroup(svgElement);
  const { svgClassNameOnMousedown } = opts;

  function onPointerDown() {
    // Non-null assertion because these are only called when
    // the type is string
    svgUtil.addClass(svgElement, svgClassNameOnMousedown!);
  }

  function onPointerUp() {
    svgUtil.removeClass(svgElement, svgClassNameOnMousedown!);
  }

  function addListeners() {
    svgDocument.addEventListener("pointerdown", onPointerDown);
    svgDocument.addEventListener("pointerup", onPointerUp);
  }

  function removeListeners() {
    svgDocument.removeEventListener("pointerdown", onPointerDown);
    svgDocument.removeEventListener("pointerup", onPointerUp);
  }

  if (isString(svgClassNameOnMousedown)) {
    addListeners();
  }

  if (opts.injectCss) {
    const styleElement = svgDocument.createElementNS(
      "http://www.w3.org/2000/svg",
      "style"
    );
    styleElement.textContent = opts.injectCss;
    svgElement.appendChild(styleElement);
  }

  rootGroup.setAttribute("class", opts.rootGroupClassName);

  // Internal state all methods are sharing
  const initialViewBox = svgElement.viewBox.baseVal;
  const state = {
    tweenable: null as any,
    tweenValues: {
      x: initialViewBox.x,
      y: initialViewBox.y,
      width: initialViewBox.width,
      height: initialViewBox.height,
      rotation: 0,
    } as View,
  };

  // Example:
  //
  // animateTo({
  //   x: 10,
  //   y: 20,
  //   width: 200,
  //   height: 200,
  //   rotation: 45  // optional
  // })
  // Rotation is relative to center of the viewport, in degrees
  function animateTo(viewIn: View, callOpts: ViewportAnimateOptions = {}) {
    const view = {
      rotation: 0,
      ...viewIn,
    };

    const animateOptions = {
      ...opts,
      ...callOpts,
    };

    if (isFunction(get(state.tweenable, "stop"))) {
      state.tweenable.stop();
    }

    state.tweenable = new Tweenable();
    state.tweenable.tween({
      from: state.tweenValues,
      to: { ...view },
      duration: animateOptions.duration,
      easing: animateOptions.easing,
      step: (values: View) => {
        const viewBox = [values.x, values.y, values.width, values.height];
        svgElement.setAttribute("viewBox", viewBox.join(" "));

        // The rotation origin is also moving when in each animation frame
        // until it reaches the next slide's center
        const rotateOrigin = {
          x: values.x + values.width / 2,
          y: values.y + values.height / 2,
        };
        const rotate = [values.rotation, rotateOrigin.x, rotateOrigin.y];
        rootGroup.setAttribute(
          "transform",
          "rotate(" + rotate.join(", ") + ")"
        );

        // Save tween state on each frame
        state.tweenValues = values;
      },
    });
  }

  return {
    animateTo,
    destroy: () => {
      if (isString(svgClassNameOnMousedown)) {
        removeListeners();
      }
    },
  };
}