import React from "react";
import { PostMetadata, SiteData } from "src/types/siteData";
import { Footer, Header } from "src/components";
import { kFormatter, formatPostDate } from "src/util/site";

type PropsWithChildren = {
  children: React.ReactNode;
  data: PostMetadata;
  siteData: SiteData;
};

type PropsWithHtml = {
  html: string;
  data: PostMetadata;
  siteData: SiteData;
};

type Props = PropsWithChildren | PropsWithHtml;

export function PostLayout(props: Props): JSX.Element {
  const mdxContainerCls = "mdx col-span-4 max-w-xl";

  return (
    <div className={`grid grid-rows-layout min-h-full gap-global`}>
      <Header siteData={props.siteData} pageData={props.data} />
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
