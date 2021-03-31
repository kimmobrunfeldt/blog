import React from "react";
import { GlobalErrorBoundary } from "src/components/GlobalErrorBoundary";
import { App } from "src/components/App";

export type RootProps = {
  children: React.ReactNode;
};

export const Root = ({ children }: RootProps) => (
  <GlobalErrorBoundary>
    <App>{children}</App>
  </GlobalErrorBoundary>
);
