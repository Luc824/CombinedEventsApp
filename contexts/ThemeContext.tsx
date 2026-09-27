import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useSyncExternalStore,
} from "react";
import { Appearance, useColorScheme } from "react-native";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = "@app_theme";

function themeFromSystem(scheme: string | null | undefined): Theme {
  return scheme === "light" ? "light" : "dark";
}

/** Module store so NativeTabs (outside ThemeProvider) can follow the in-app theme. */
let appTheme: Theme = themeFromSystem(Appearance.getColorScheme());
const themeListeners = new Set<() => void>();

function emitAppTheme() {
  themeListeners.forEach((listener) => listener());
}

function setAppTheme(theme: Theme) {
  if (appTheme === theme) {
    return;
  }
  appTheme = theme;
  emitAppTheme();
}

export function subscribeAppTheme(listener: () => void) {
  themeListeners.add(listener);
  return () => {
    themeListeners.delete(listener);
  };
}

export function getAppTheme() {
  return appTheme;
}

/** Safe outside ThemeProvider — used by NativeTabs. */
export function useAppTheme() {
  return useSyncExternalStore(subscribeAppTheme, getAppTheme, getAppTheme);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemColorScheme = useColorScheme();
  const [theme, setTheme] = useState<Theme>(() =>
    themeFromSystem(Appearance.getColorScheme())
  );
  // null = still loading storage; true = user picked; false = follow system
  const [hasUserPreference, setHasUserPreference] = useState<boolean | null>(
    null
  );

  useEffect(() => {
    setAppTheme(theme);
  }, [theme]);

  useEffect(() => {
    AsyncStorage.getItem(THEME_STORAGE_KEY).then((savedTheme) => {
      if (savedTheme === "light" || savedTheme === "dark") {
        setHasUserPreference(true);
        setTheme(savedTheme);
      } else {
        setHasUserPreference(false);
        setTheme(themeFromSystem(systemColorScheme));
      }
    });
    // Only run on mount — system changes are handled below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (hasUserPreference === false) {
      setTheme(themeFromSystem(systemColorScheme));
    }
  }, [systemColorScheme, hasUserPreference]);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setHasUserPreference(true);
    setTheme(newTheme);
    AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDark: theme === "dark" }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
