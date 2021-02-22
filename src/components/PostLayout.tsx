import React from "react";
import { PostMetadata } from "src/types/siteData";
import { Footer, Header } from "src/components";

type PropsWithChildren = {
  children: React.ReactNode;
  data: PostMetadata;
};

type PropsWithHtml = {
  html: string;
  data: PostMetadata;
};

type Props = PropsWithChildren | PropsWithHtml;

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

function formatPostDate(date: string): string {
  const dateObj = new Date(date);

  const year = dateObj.getFullYear();
  const month = new Intl.DateTimeFormat("en-US", {
    month: "long",
  }).format(new Date(date));
  const day = formatOrdinalNumber(dateObj.getDay());
  return `${month} ${day}, ${year}`;
}

function kFormatter(num: number): string {
  if (Math.abs(num) > 999) {
    return Math.sign(num) * (Math.round(Math.abs(num) / 100) / 10) + "k";
  }

  return String(num);
}

export function PostLayout(props: Props): JSX.Element {
  const mdxContainerCls = "mdx col-span-4 max-w-xl";

  return (
    <div className={`grid grid-rows-layout min-h-full gap-global`}>
      <Header currentPath={props.data.path} />
      <main className={`grid grid-cols-12 gap-global`}>
        <div className="col-span-2"></div>
        <div className="col-span-2 text-sm">
          <div className="text-gray-6 font-bold text">
            {formatPostDate(props.data.createdAt)}
          </div>
          <div className="text-gray-5">
            {kFormatter(props.data.charCount)} chars
          </div>
          <div className="text-gray-5 mt-5 italic text-xs">
            {props.data.tags.join(", ")}
          </div>
        </div>

        {"children" in props ? (
          <article className={mdxContainerCls}>{props.children}</article>
        ) : (
          <article className={mdxContainerCls}>
            {/* Frontend hydrate adds an additional div inside article, we must match it */}
            <div dangerouslySetInnerHTML={{ __html: props.html }} />
          </article>
        )}

        <div className="col-span-4"></div>
      </main>
      <Footer />
    </div>
  );
}
