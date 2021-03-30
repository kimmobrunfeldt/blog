import reverse from "lodash/reverse";
import forEach from "lodash/forEach";
import once from "lodash/once";
import * as mathUtil from "./mathUtil";
import * as svgUtil from "./svgUtil";
import {
  viewport as svgViewport,
  ViewportAnimateOptions,
  ViewportOptions,
} from "./svgViewport";
import { isUndefined } from "lodash";

const DEBUG = false;
const SVG_DOCUMENT_CSS = `.presentation-slides-group > * {
  fill: rgba(0, 0, 0, 0);
  transition: all 0.3s ease;
}

.fade-in-out {
  transition: opacity 0.3s ease;
}

.hidden {
  opacity: 0;
}
`;

type PresentationOptions = {
  initialAnimateToSlide?: number;
  initialAnimateDuration?: number;
};

export function initialize(
  document: HTMLDocument,
  svgElement: SVGSVGElement,
  optsIn: ViewportOptions & PresentationOptions = {}
) {
  const {
    initialAnimateToSlide,
    initialAnimateDuration,
    ...viewportOptsIn
  } = optsIn;
  const viewportOpts: ViewportOptions = {
    injectCss: SVG_DOCUMENT_CSS,
    ...viewportOptsIn,
  };

  const slidesContainer = document.getElementById("slides");
  if (!slidesContainer) {
    throw new Error("Invalid presentation, no element with id 'slides' found!");
  }

  slidesContainer.setAttribute("class", "presentation-slides-group");
  // Convert children to regular array and reverse it
  const slideContainers = reverse(
    Array.from(slidesContainer.children)
  ) as SVGGraphicsElement[];

  const presentation = slideContainers.map((container) => {
    const elem = svgUtil.getSlideElementFromContainer(
      document,
      container as SVGGraphicsElement
    );
    return {
      viewportPosition: svgUtil.getFinalBBox(elem),
      container,
      element: elem,
      fadeInOut: svgUtil.findMatching(container, (node: SVGElement) =>
        node.id.startsWith("fade-in-out")
      ),
    };
  });

  presentation.forEach((slide) => {
    slide.fadeInOut.forEach((element) => {
      svgUtil.addClass(element, "fade-in-out hidden");
    });

    svgUtil.addClass(slide.element, "hidden");
  });

  console.log(presentation);

  const rotations = presentation.map((i) => i.viewportPosition.rotation);
  forEach(
    mathUtil.normalizeRotations(rotations),
    (rotation: number, i: number) => {
      // Normalize rotations to make the presentation flow better,
      // and also we need to reverse the rotation to make the viewport
      // rotate correctly
      presentation[i].viewportPosition.rotation = -rotation;
    }
  );

  function initialAnimation() {
    if (!isUndefined(initialAnimateToSlide)) {
      animateToSlide(initialAnimateToSlide, {
        duration: initialAnimateDuration,
      });
    }
  }

  const initialAnimationOnce = once(initialAnimation);

  let observer: IntersectionObserver | undefined = undefined;
  if (!isUndefined(initialAnimateToSlide)) {
    observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting === true) {
          initialAnimationOnce();
        }
      },
      {
        root: document.body,
        rootMargin: "0px 0px -60% 0px",
        threshold: 0,
      }
    );
  }

  const state = {
    step: 0,
    viewport: svgViewport(document, svgElement, viewportOpts),
  };

  function animateToSlide(
    stepIndex: number,
    animationOptions?: ViewportAnimateOptions
  ) {
    const currentStep = presentation[state.step];
    const nextStepIndex = getStepIndex(stepIndex);
    const nextStep = presentation[nextStepIndex];

    currentStep.fadeInOut.forEach((element) => {
      svgUtil.addClass(element, "hidden");
    });
    nextStep.fadeInOut.forEach((element) => {
      svgUtil.removeClass(element, "hidden");
    });

    state.viewport.animateTo(nextStep.viewportPosition, animationOptions);

    if (DEBUG) {
      currentStep.element.setAttribute("class", "hidden");
      nextStep.element.setAttribute("class", "");
    }

    state.step = nextStepIndex;
  }

  function next() {
    animateToSlide(state.step + 1);
  }

  function previous() {
    animateToSlide(state.step - 1);
  }

  function getStepIndex(index: number) {
    if (index < 0) {
      return presentation.length - 1;
    }

    return index % presentation.length;
  }

  function addListeners() {
    svgElement.addEventListener("click", next);

    if (!isUndefined(observer)) {
      observer.observe(svgElement);
    }
  }

  function destroy() {
    svgElement.removeEventListener("click", next);
    state.viewport.destroy();

    if (!isUndefined(observer)) {
      observer.disconnect();
    }
  }

  addListeners();
  animateToSlide(state.step);

  return {
    next,
    previous,
    animateToSlide,
    destroy,
  };
}
