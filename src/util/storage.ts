import React from "react";

export type Storage = {
  theme: "light" | "dark" | null;
};

function isSupported() {
  return "localStorage" in globalThis;
}

export function getKey<T extends keyof Storage>(key: T): Storage[T] | null {
  if (!isSupported()) {
    return null;
  }

  const localStorage = globalThis.localStorage as any;
  try {
    return localStorage.getItem(key);
  } catch (e) {
    return null;
  }
}

export function removeKey<T extends keyof Storage>(key: T): Storage[T] | null {
  if (!isSupported()) {
    return null;
  }

  const localStorage = globalThis.localStorage as any;
  try {
    return localStorage.removeItem(key);
  } catch (e) {
    return null;
  }
}

export function saveKey<T extends keyof Storage>(
  key: T,
  value: Storage[T]
): Storage | null {
  if (!isSupported()) {
    return null;
  }

  const localStorage = globalThis.localStorage as any;
  try {
    localStorage.setItem(key, value);
  } catch (e) {
    return null;
  }

  return localStorage;
}

export function useLocalStorage<T extends keyof Storage>(
  key: T
): [Storage[T] | null, (value: Storage[T]) => void] {
  const [storedValue, setStoredValue] = React.useState(() => {
    return getKey(key);
  });

  function setValue(value: Storage[T]) {
    if (value === null) {
      setStoredValue(null);
      removeKey(key);
      return;
    }

    setStoredValue(value);
    saveKey(key, value);
  }

  return [storedValue, setValue];
}
