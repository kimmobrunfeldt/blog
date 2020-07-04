import React from "react";
import { levelToClass } from "src/components/H";

const components = {
  h1: (props: any) => <h1 className={levelToClass(1)} {...props} />,
  h2: (props: any) => <h2 className={levelToClass(2)} {...props} />,
  h3: (props: any) => <h3 className={levelToClass(3)} {...props} />,
  h4: (props: any) => <h3 className={levelToClass(4)} {...props} />,
  h5: (props: any) => <h3 className={levelToClass(5)} {...props} />,
  h6: (props: any) => <h3 className={levelToClass(6)} {...props} />,
};

export { components };
