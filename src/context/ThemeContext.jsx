/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useState } from "react";

/**
 * ThemeContext
 *
 * Manages the light / dark theme toggle for the entire application.
 *
 * Behaviour:
 *   - On mount, reads "mlsc-theme" from localStorage.
 *   - Applies the "dark" class to <html> when theme === "dark".
 *   - Persists the choice back to localStorage on every toggle.
 *   - The flash-prevention inline script in index.html already applies
 *     the class before React hydrates, so there is no visible flash.
 *
 * localStorage:
 *   key   : "mlsc-theme"
 *   value : "light" | "dark"
 */

const STORAGE_KEY = "mlsc-theme";

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "dark" || saved === "light") return saved;
    } catch {
      // localStorage unavailable
    }
    // Default to dark — the flash-prevention script in index.html applies
    // the "dark" class immediately on first load before React hydrates.
    return "dark";
  });

  // Keep <html> class in sync with React state
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // Ignore write failures
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within a ThemeProvider");
  return ctx;
};
