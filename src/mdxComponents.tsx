import React from "react";

import { levelToClass } from "src/components/H";
import { P } from "src/components/P";
import { Link } from "src/components/Link";
import { Prism } from "src/components/Prism";

// Note: more complex css is done at mdx-content.css
export const components = {
  h1: (props: any) => (
    <h1
      className={`${levelToClass(
        1
      )} font-heading font-black text-gray-9 dark:text-gray-3`}
      {...props}
    />
  ),
  h2: (props: any) => (
    <h2
      className={`${levelToClass(
        2
      )} font-heading font-black text-gray-9 dark:text-gray-3`}
      {...props}
    />
  ),
  h3: (props: any) => (
    <h3
      className={`${levelToClass(
        3
      )} font-heading font-black text-gray-9 dark:text-gray-3`}
      {...props}
    />
  ),
  h4: (props: any) => (
    <h4
      className={`${levelToClass(
        4
      )} font-heading font-black text-gray-9 dark:text-gray-3`}
      {...props}
    />
  ),
  h5: (props: any) => (
    <h5
      className={`${levelToClass(
        5
      )} font-heading font-black text-gray-9 dark:text-gray-3`}
      {...props}
    />
  ),
  h6: (props: any) => (
    <h6
      className={`${levelToClass(
        6
      )} font-heading font-black text-gray-9 dark:text-gray-3`}
      {...props}
    />
  ),
  p: (props: any) => <P {...props} />,
  strong: (props: any) => <strong className="font-bold" {...props} />,
  em: (props: any) => <em className="italic" {...props} />,
  del: (props: any) => <del className="line-through" {...props} />,
  li: (props: any) => <li className={`pl-2`} {...props} />,
  ul: (props: any) => <ul className={`pl-8 list-disc space-y-1`} {...props} />,
  ol: (props: any) => (
    <ol className={`pl-8 list-decimal space-y-1`} {...props} />
  ),
  a: (props: any) => <Link {...props} color="none" />,
  code: (props: any) => <Prism {...props} />,
  img: (props: any) => <img {...props} />,
  hr: (props: any) => (
    <hr
      className="border-gray-2 dark:border-gray-6 border-t-2 w-16 mx-auto my-20"
      {...props}
    />
  ),
  pre: (props: any) => <pre className={`py-0`} {...props} />,
  inlineCode: (props: any) => <code {...props} />,
  blockquote: (props: any) => (
    <blockquote
      className="text-gray-6 dark:text-gray-5 italic py-2 px-7 my-10 text-center text-lg md:relative md:-left-6"
      {...props}
    />
  ),
  table: (props: any) => <table {...props} />,
  td: (props: any) => <td {...props} />,
  th: (props: any) => <th {...props} />,
  tr: (props: any) => <tr {...props} />,
  thead: (props: any) => <thead {...props} />,
  tbody: (props: any) => <tbody {...props} />,
};
