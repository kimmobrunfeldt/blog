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

  const notExtendableClasses: string[] = [];
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

    notExtendableClasses.push(baseCls);
  });
  extendSplitted.forEach(maybeAddToMap);

  const extendedClasses = Object.keys(newClasses).map((key) => {
    const val = newClasses[key];
    return `${key}-${val}`;
  });

  return notExtendableClasses.concat(extendedClasses).join(" ");
}
