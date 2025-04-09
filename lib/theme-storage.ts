// Utility functions for theme storage and persistence

/**
 * Save the user's theme preference to localStorage
 */
export function saveThemePreference(theme: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("theme-preference", theme)
  }
}

/**
 * Get the user's theme preference from localStorage
 * Returns the saved preference or 'light' as default
 */
export function getThemePreference(): string {
  if (typeof window !== "undefined") {
    const savedTheme = localStorage.getItem("theme-preference")
    return savedTheme || "light"
  }
  return "light" // Default to light theme
}
