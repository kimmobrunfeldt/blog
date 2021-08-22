import React from "react";
import { ParallaxProvider, useController } from "react-scroll-parallax";
import { addMediaListener, removeMediaListener } from "src/util/site";
import { useLocalStorage } from "src/util/storage";
import _ from "lodash";

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

  const scrollContainer = globalThis.window
    ? document.querySelector("#react-root")
    : undefined;

  return (
    <ParallaxProvider scrollContainer={scrollContainer}>
      <ParallaxCacheUpdater />
      <AppContext.Provider value={{ theme, setTheme: setLocalStorageTheme }}>
        {children}
      </AppContext.Provider>
    </ParallaxProvider>
  );
};

const ParallaxCacheUpdater = () => {
  if (!globalThis.window) {
    return null;
  }

  const { parallaxController } = useController();

  React.useLayoutEffect(() => {
    const handler = _.debounce(() => {
      window.requestAnimationFrame(() => {
        parallaxController.update();
      });
    }, 30);
    window.addEventListener("load", handler);

    const resizeObserver = new ResizeObserver(handler);
    resizeObserver.observe(document.body);

    return () => {
      window.removeEventListener("load", handler);
      resizeObserver.unobserve(document.body);
    };
  }, [parallaxController]);

  return null;
};
