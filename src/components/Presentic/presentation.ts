import reverse from "lodash/reverse";
import forEach from "lodash/forEach";
import * as mathUtil from "./mathUtil";
import * as svgUtil from "./svgUtil";
import { viewport as svgViewport, ViewportOptions } from "./svgViewport";

const DEBUG = false;
const SVG_DOCUMENT_CSS = `.presentation-slides-group > * {
  fill: rgba(0, 0, 0, 0);
  transition: all 0.3s ease;
}

/* Disabled
.mousedown .presentation-slides-group > * {
  fill: rgba(102, 215, 209, 0.3);
}
*/

.hidden {
  opacity: 0;
}
`;

export function initPresentation(
  document: HTMLDocument,
  svgElement: SVGSVGElement,
  optsIn: ViewportOptions = {}
) {
  const opts: ViewportOptions = {
    injectCss: SVG_DOCUMENT_CSS,
    ...optsIn,
  };

  const slidesContainer = document.getElementById("Slides");
  if (!slidesContainer) {
    throw new Error("Invalid presentation, no element with id #Slides found!");
  }

  slidesContainer.setAttribute("class", "presentation-slides-group");
  // Convert children to regular array and reverse it
  const slideContainers = reverse(
    Array.from(slidesContainer.children)
  ) as SVGGraphicsElement[];

  slideContainers.forEach((container) => svgUtil.hide(container));
  const presentation = slideContainers.map((container) => {
    const elem = getSlideElementFromContainer(
      document,
      container as SVGGraphicsElement
    );
    return {
      viewportPosition: svgUtil.getFinalBBox(elem),
      container: container,
      element: elem,
    };
  });

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

  const state = {
    step: 0,
    viewport: svgViewport(document, svgElement, opts),
  };

  function getSlideElementFromContainer(
    svgDoc: HTMLDocument,
    container: SVGGraphicsElement
  ): SVGGraphicsElement {
    if (container.tagName === "rect") {
      return container;
    }

    const children = Array.from(container.children);
    const found = children.find(
      (child) => getElementTagName(svgDoc, child as SVGElement) === "rect"
    );
    if (found) {
      return found as SVGGraphicsElement;
    }

    console.warn("No slide element found for container: ", container);
    console.warn(
      "Using the container as the slide element. Presentation may behave unexpectedly."
    );
    return container;
  }

  function getElementTagName(svgDoc: HTMLDocument, el: SVGElement): string {
    if (el.tagName === "use") {
      const realElemId = el.getAttributeNS(
        "http://www.w3.org/1999/xlink",
        "href"
      ) as string;
      const realElem = svgDoc.querySelector(realElemId);
      if (!realElem) {
        throw new Error(`Could not resolve use link: ${el}`);
      }
      return getElementTagName(svgDoc, realElem as SVGElement);
    }

    return el.tagName;
  }

  function animateToSlide(stepIndex: number) {
    const nextStepIndex = getStepIndex(stepIndex);
    const nextStep = presentation[nextStepIndex];

    state.viewport.animateTo(nextStep.viewportPosition);

    if (DEBUG) {
      const currentStep = presentation[state.step];
      currentStep.container.setAttribute("class", "hidden");
      nextStep.container.setAttribute("class", "");
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

  function initKeyEvents() {
    // TODO: Teardown event listeners!
    svgElement.addEventListener("click", next);
  }

  forEach(slideContainers, (e) => e.setAttribute("class", "hidden"));
  initKeyEvents();
  animateToSlide(state.step);

  return {
    next,
    previous,
    animateToSlide,
  };
}
