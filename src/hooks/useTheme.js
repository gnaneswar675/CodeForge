import { useState, useEffect } from "react"

export function useTheme() {
  const [theme, setTheme] = useState(() => {
    // Check if the user has explicitly selected a theme
    if (typeof window !== "undefined" && window.localStorage) {
      const stored = window.localStorage.getItem("user_selected_theme")
      if (stored === "dark" || stored === "light") {
        return stored
      }
      // Clean up legacy auto-detected theme if present
      window.localStorage.removeItem("theme")
    }
    // Default theme is ALWAYS light mode
    return "light"
  })

  useEffect(() => {
    const root = window.document.documentElement
    if (theme === "dark") {
      root.classList.add("dark")
    } else {
      root.classList.remove("dark")
    }
  }, [theme])

  const toggleTheme = () => {
    setTheme((prev) => {
      const nextTheme = prev === "dark" ? "light" : "dark"
      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.setItem("user_selected_theme", nextTheme)
      }
      return nextTheme
    })
  }

  return { theme, toggleTheme }
}
