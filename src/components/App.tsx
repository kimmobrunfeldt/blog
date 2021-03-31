import React from "react";
import { addMediaListener, removeMediaListener } from "src/util/site";
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

function setThemeClass(theme: Context["theme"]): void {
  if (theme === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
}

export const App = ({ children }: Props) => {
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    ? ("dark" as const)
    : ("light" as const);

  const [osPreference, setOsPreference] = React.useState(prefersDark);
  const [localStorageTheme, setLocalStorageTheme] = useLocalStorage("theme");

  const theme = localStorageTheme === null ? osPreference : localStorageTheme;

  React.useEffect(() => {
    setThemeClass(theme);
  }, [theme]);

  // Change theme immediately if user switches their OS preference and
  // the theme hasn't been overridden in local storage
  React.useEffect(() => {
    const darkQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const cb = (event: MediaQueryListEvent) => {
      // Remove key
      setLocalStorageTheme(null);
      setOsPreference(event.matches ? "dark" : "light");
    };

    addMediaListener(darkQuery, cb);
    return () => {
      removeMediaListener(darkQuery, cb);
    };
  }, []);

  return (
    <AppContext.Provider value={{ theme, setTheme: setLocalStorageTheme }}>
      {children}
    </AppContext.Provider>
  );
};
