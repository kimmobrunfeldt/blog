import React from "react";
import { InlineIcon } from "@iconify/react";
import bugIcon from "@iconify/icons-teenyicons/bug-outline";
import isUndefined from "lodash/isUndefined";
import { CustomWindow } from "src/types/window";

type Props = {
  children: React.ReactNode;
};
type State = {
  error?: Error;
};

export class GlobalErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { error: undefined };
  }

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.log("React app crashed! Showing static content");
    console.log("Error info:", errorInfo);
    console.error(error);

    document.body.innerHTML += `

    `;
  }

  render() {
    if (!isUndefined(this.state.error)) {
      return (
        <>
          <div
            dangerouslySetInnerHTML={{
              __html:
                (window as CustomWindow).kimmoBlogInitialContentInnerHTML || "",
            }}
          />
          <div className="fixed bg-white px-2 py-1 top-0 right-0 flex flex-row items-center">
            <span className="children:inline-block text-sm text-danger-4">
              <InlineIcon icon={bugIcon} />
            </span>
            <span className="pl-2 text-xs text-danger-4">
              React app crashed! Showing static content.
            </span>
          </div>
        </>
      );
    }

    return this.props.children;
  }
}
