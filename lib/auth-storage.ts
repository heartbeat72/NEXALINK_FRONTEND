// Utility functions for authentication storage

/**
 * Save user credentials to localStorage with "remember me" option
 */
export function saveUserCredentials(email: string, rememberMe: boolean): void {
  if (typeof window !== "undefined" && rememberMe) {
    localStorage.setItem("remembered-email", email)
    localStorage.setItem("remember-me", "true")
  }
}

/**
 * Clear saved user credentials from localStorage
 */
export function clearUserCredentials(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("remembered-email")
    localStorage.removeItem("remember-me")
  }
}

/**
 * Get remembered user credentials from localStorage
 */
export function getRememberedCredentials(): { email: string | null; rememberMe: boolean } {
  if (typeof window !== "undefined") {
    const email = localStorage.getItem("remembered-email")
    const rememberMe = localStorage.getItem("remember-me") === "true"
    return { email, rememberMe }
  }
  return { email: null, rememberMe: false }
}

/**
 * Check if user has saved credentials
 */
export function hasRememberedCredentials(): boolean {
  if (typeof window !== "undefined") {
    return localStorage.getItem("remember-me") === "true" && localStorage.getItem("remembered-email") !== null
  }
  return false
}
