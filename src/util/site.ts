import isFunction from "lodash/isFunction";
import { AnyPage, PostMetadata, PostPage, SiteData } from "src/types/siteData";

export function isPostPage(page: AnyPage): page is PostPage {
  return page.type === "post";
}

export function getPostPages(siteData: SiteData): PostPage[] {
  return siteData.pages.filter(isPostPage).filter((p) => !p.data.preview);
}

export function getPosts(siteData: SiteData): PostMetadata[] {
  return getPostPages(siteData).map((page) => page.data);
}

function formatOrdinalNumber(integer: number): string {
  const pr = new Intl.PluralRules("en-US", {
    type: "ordinal",
  });
  const suffixes = {
    one: "st",
    two: "nd",
    few: "rd",
    other: "th",
  };
  return `${integer}${suffixes[pr.select(integer) as keyof typeof suffixes]}`;
}

export function formatPostDate(date: string): string {
  const dateObj = new Date(date);

  const year = dateObj.getFullYear();
  const month = new Intl.DateTimeFormat("en-US", {
    month: "long",
  }).format(dateObj);
  const day = formatOrdinalNumber(dateObj.getDate());
  return `${month} ${day}, ${year}`;
}

export function kFormatter(num: number): string {
  if (Math.abs(num) > 999) {
    return Math.sign(num) * (Math.round(Math.abs(num) / 100) / 10) + "k";
  }

  return String(num);
}

type TailwindClassComponents = {
  utility: string;
  value: string;
};

export function splitTwClass(cls: string): TailwindClassComponents {
  const [head, ...tail] = cls.split("-");
  return {
    utility: head,
    value: tail.join("-"),
  };
}

const EXTEND_PREFIXES = [
  "m",
  "mb",
  "mt",
  "ml",
  "mr",
  "p",
  "pb",
  "pt",
  "pl",
  "pr",
];
export function overrideTw(base: string, extend: string): string {
  const baseSplitted = base.split(/\s+/);
  const extendSplitted = extend.split(/\s+/);

  const classes: string[] = [];
  const newClasses: {
    [key: string]: string;
  } = {};

  const maybeAddToMap = (cls: string) => {
    const tw = splitTwClass(cls);
    if (EXTEND_PREFIXES.includes(tw.utility)) {
      newClasses[tw.utility] = tw.value;
      return true;
    }

    return false;
  };

  baseSplitted.forEach((baseCls) => {
    if (maybeAddToMap(baseCls)) {
      return;
    }

    classes.push(baseCls);
  });

  extendSplitted.forEach((cls) => {
    if (maybeAddToMap(cls)) {
      return;
    }

    classes.push(cls);
  });

  const extendedClasses = Object.keys(newClasses).map((key) => {
    const val = newClasses[key];
    return `${key}-${val}`;
  });

  return classes.concat(extendedClasses).join(" ");
}

export function addMediaListener(
  query: MediaQueryList,
  cb: (event: MediaQueryListEvent) => void
): void {
  if (isFunction(query.addEventListener)) {
    query.addEventListener("change", cb);
    return;
  }

  query.addListener(cb);
}

export function removeMediaListener(
  query: MediaQueryList,
  cb: (event: MediaQueryListEvent) => void
): void {
  if (isFunction(query.removeEventListener)) {
    query.removeEventListener("change", cb);
    return;
  }

  query.removeListener(cb);
}

export function safeMatchesMediaQuery(query: string): boolean {
  if (!globalThis.window) {
    return false;
  }

  return globalThis.window.matchMedia(query).matches;
}
