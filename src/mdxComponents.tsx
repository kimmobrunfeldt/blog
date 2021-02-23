import React from "react";

import { levelToClass } from "src/components/H";
import { P, textColor, Link, Prism } from "./components";

// Note: more complex css is done at mdx-content.css
export const components = {
  h1: (props: any) => <h1 className={levelToClass(2)} {...props} />,
  h2: (props: any) => <h2 className={levelToClass(3)} {...props} />,
  h3: (props: any) => <h3 className={levelToClass(4)} {...props} />,
  h4: (props: any) => <h4 className={levelToClass(5)} {...props} />,
  h5: (props: any) => <h5 className={levelToClass(6)} {...props} />,
  h6: (props: any) => <h6 className={levelToClass(6)} {...props} />,
  p: (props: any) => <P {...props} />,
  strong: (props: any) => <strong className="font-bold" {...props} />,
  em: (props: any) => <em className="italic" {...props} />,
  del: (props: any) => <del className="line-through" {...props} />,
  li: (props: any) => <li className={`leading-normal`} {...props} />,
  ul: (props: any) => (
    <ul className={`${textColor} pl-6 list-disc`} {...props} />
  ),
  ol: (props: any) => (
    <ol className={`${textColor} pl-6 list-decimal`} {...props} />
  ),
  a: (props: any) => <Link {...props} />,
  code: (props: any) => <Prism {...props} />,
  img: (props: any) => <img {...props} />,
  hr: (props: any) => <hr className="border-gray-2 mx-8 my-10" {...props} />,
  pre: (props: any) => <pre className={`py-0`} {...props} />,
  inlineCode: (props: any) => <code {...props} />,
  blockquote: (props: any) => <blockquote {...props} />,
  table: (props: any) => <table {...props} />,
  td: (props: any) => <td {...props} />,
  th: (props: any) => <th {...props} />,
  tr: (props: any) => <tr {...props} />,
  thead: (props: any) => <thead {...props} />,
  tbody: (props: any) => <tbody {...props} />,
};