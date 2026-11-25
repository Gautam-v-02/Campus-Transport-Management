"use client";

import { useEffect, useState } from "react";

const THEME_STORAGE_KEY = "campus-transit-theme";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    let darkTheme = false;
    try {
      darkTheme = window.localStorage.getItem(THEME_STORAGE_KEY) === "dark";
    } catch {
      // Keep the default light theme if browser storage is unavailable.
    }
    document.documentElement.dataset.theme = darkTheme ? "dark" : "light";
    const frameId = window.requestAnimationFrame(() => setIsDark(darkTheme));
    return () => window.cancelAnimationFrame(frameId);
  }, []);

  function toggleTheme() {
    const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = nextTheme;
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    } catch {
      // The theme still changes for this page view if storage is unavailable.
    }
    setIsDark(nextTheme === "dark");
  }

  const label = isDark ? "Switch to light theme" : "Switch to dark theme";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={label}
      title={label}
      className="theme-toggle fixed bottom-5 right-5 z-[1200] inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-xs font-semibold shadow-lg"
    >
      {isDark ? (
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="12" cy="12" r="4" />
          <path strokeLinecap="round" d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" />
        </svg>
      ) : (
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.2 15.5A8.3 8.3 0 0 1 8.5 3.8 8.5 8.5 0 1 0 20.2 15.5Z" />
        </svg>
      )}
      {isDark ? "Light theme" : "Dark theme"}
    </button>
  );
}
