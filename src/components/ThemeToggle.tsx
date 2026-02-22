"use client"

import * as React from "react"
import { Moon, Sun, Monitor } from "lucide-react"
import { useTheme } from "next-themes"

export function ThemeToggle() {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = React.useState(false)

    // Avoid hydration mismatch
    React.useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return <div className="p-2 w-10 h-10" />
    }

    return (
        <div className="flex items-center gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg w-fit">
            <button
                onClick={() => setTheme("light")}
                className={`p-2 rounded-md transition-colors ${theme === "light"
                        ? "bg-white text-yellow-500 shadow-sm"
                        : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    }`}
                title="Light Mode"
            >
                <Sun size={20} />
            </button>
            <button
                onClick={() => setTheme("dark")}
                className={`p-2 rounded-md transition-colors ${theme === "dark"
                        ? "bg-gray-700 text-blue-400 shadow-sm"
                        : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    }`}
                title="Dark Mode"
            >
                <Moon size={20} />
            </button>
            <button
                onClick={() => setTheme("system")}
                className={`p-2 rounded-md transition-colors ${theme === "system"
                        ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm"
                        : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    }`}
                title="System Preference"
            >
                <Monitor size={20} />
            </button>
        </div>
    )
}
