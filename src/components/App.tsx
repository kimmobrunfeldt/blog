import React from "react";
import { useLocalStorage } from "src/util/storage";

type Context = {
  theme: "light" | "dark";
  setTheme: (value: "light" | "dark") => void;
};

type Props = {
  children: React.ReactNode;
};

const context = {
  theme: "light" as const,
  setTheme: () => undefined,
};
export const AppContext = React.createContext<Context>(context);

export const App = ({ children }: Props) => {
  const [localStorageTheme, setLocalStorageTheme] = useLocalStorage("theme");

  const osPreference = window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";

  const theme = localStorageTheme === null ? osPreference : localStorageTheme;

  React.useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [localStorageTheme]);

  return (
    <AppContext.Provider value={{ theme, setTheme: setLocalStorageTheme }}>
      {children}
    </AppContext.Provider>
  );
};
