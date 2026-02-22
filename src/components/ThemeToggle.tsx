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
        <div className="flex items-center gap-1 p-1 bg-muted rounded-lg w-fit border border-border">
            <button
                onClick={() => setTheme("light")}
                className={`p-2 rounded-md transition-all ${theme === "light"
                    ? "bg-card text-yellow-500 shadow-sm border border-border"
                    : "text-muted-foreground hover:text-foreground hover:bg-card/50"
                    }`}
                title="Light Mode"
            >
                <Sun size={20} />
            </button>
            <button
                onClick={() => setTheme("dark")}
                className={`p-2 rounded-md transition-all ${theme === "dark"
                    ? "bg-slate-700 text-blue-400 shadow-sm border border-slate-600"
                    : "text-muted-foreground hover:text-foreground hover:bg-card/50"
                    }`}
                title="Dark Mode"
            >
                <Moon size={20} />
            </button>
            <button
                onClick={() => setTheme("system")}
                className={`p-2 rounded-md transition-all ${theme === "system"
                    ? "bg-card text-foreground shadow-sm border border-border"
                    : "text-muted-foreground hover:text-foreground hover:bg-card/50"
                    }`}
                title="System Preference"
            >
                <Monitor size={20} />
            </button>
        </div>
    )
}
