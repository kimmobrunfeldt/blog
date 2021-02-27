import React from "react";

export type ChatMessageProps = JSX.IntrinsicElements["span"] & {
  children?: React.ReactNode;
  from: "them" | "me";
};

export function ChatDiscussion({ children }: JSX.IntrinsicElements["div"]) {
  return (
    <div className="ChatDiscussion py-10 mx-auto md:relative md:-left-6 max-w-xs flex flex-col">
      {children}
    </div>
  );
}

export function ChatMessage({ children, from }: ChatMessageProps) {
  return <p className={`ChatMessage from-${from}`}>{children}</p>;
}
