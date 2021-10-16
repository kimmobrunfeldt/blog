import React from "react";
import { addMediaListener, removeMediaListener } from "src/util/site";
import { useLocalStorage } from "src/util/storage";
import { Toaster } from "react-hot-toast";

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

function safeMatchesMediaQuery(query: string): boolean {
  if (!globalThis.window) {
    return false;
  }

  return globalThis.window.matchMedia(query).matches;
}

export const App = ({ children }: Props) => {
  const prefersDark = safeMatchesMediaQuery("(prefers-color-scheme: dark)")
    ? ("dark" as const)
    : ("light" as const);

  const [osPreference, setOsPreference] = React.useState(prefersDark);
  const [localStorageTheme, setLocalStorageTheme] = useLocalStorage("theme");

  const theme = localStorageTheme === null ? osPreference : localStorageTheme;
  const ctx = React.useMemo(() => ({ theme, setTheme: setLocalStorageTheme }), [
    theme,
  ]);

  React.useEffect(() => {
    setThemeClass(theme);
  }, [theme]);

  // Change theme immediately if user switches their OS preference
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
    <AppContext.Provider value={ctx}>
      <Toaster />
      {children}
    </AppContext.Provider>
  );
};
