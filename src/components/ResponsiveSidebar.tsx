"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, LogOut } from "lucide-react"
import { ThemeToggle } from "@/components/ThemeToggle"

interface NavLink {
    href: string
    label: string
    icon: string
    roles: string[]
}

interface ResponsiveSidebarProps {
    navLinks: NavLink[]
    userRole: string
}

export function ResponsiveSidebar({ navLinks, userRole }: ResponsiveSidebarProps) {
    const [isOpen, setIsOpen] = useState(false)
    const pathname = usePathname()

    const toggleSidebar = () => setIsOpen(!isOpen)
    const closeSidebar = () => setIsOpen(false)

    const filteredLinks = navLinks.filter((link) => link.roles.includes(userRole))

    const sidebarContent = (
        <>
            <div className="px-6 py-5 border-b border-blue-800 dark:border-slate-800 flex justify-between items-center">
                <div>
                    <h1 className="text-xl font-bold tracking-wide text-white">✝ My PCC</h1>
                    <p className="text-xs text-blue-300 dark:text-slate-400 mt-1">
                        {userRole === "MEMBER" ? "Member Portal" : "Admin Dashboard"}
                    </p>
                </div>
                <button onClick={closeSidebar} className="lg:hidden text-white hover:text-blue-300">
                    <X size={24} />
                </button>
            </div>
            <nav className="flex-1 overflow-y-auto py-4 px-3">
                <ul className="space-y-1">
                    {filteredLinks.map((link) => (
                        <li key={link.href}>
                            <Link
                                href={link.href}
                                onClick={closeSidebar}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${pathname === link.href
                                        ? "bg-blue-700 dark:bg-slate-800 text-white shadow-md"
                                        : "text-blue-100 dark:text-slate-300 hover:bg-blue-700/50 dark:hover:bg-slate-800/50 hover:text-white"
                                    }`}
                            >
                                <span className="text-base">{link.icon}</span>
                                {link.label}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
            <div className="p-4 border-t border-blue-800 dark:border-slate-800 space-y-4">
                <div className="flex justify-center">
                    <ThemeToggle />
                </div>
                <form action="/api/auth/signout" method="POST">
                    <button
                        type="submit"
                        className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm text-blue-300 dark:text-slate-400 hover:text-white transition-colors hover:bg-white/5 rounded-lg"
                    >
                        <LogOut size={16} />
                        Sign Out
                    </button>
                </form>
            </div>
        </>
    )

    return (
        <>
            {/* Mobile Header */}
            <header className="lg:hidden flex items-center justify-between p-4 bg-blue-900 dark:bg-slate-900 border-b border-blue-800 dark:border-slate-800 sticky top-0 z-40 text-white shadow-md">
                <div className="flex items-center gap-3">
                    <button
                        onClick={toggleSidebar}
                        className="p-2 -ml-2 rounded-md hover:bg-blue-800 dark:hover:bg-slate-800"
                    >
                        <Menu size={24} />
                    </button>
                    <h1 className="text-lg font-bold tracking-tight">✝ My PCC</h1>
                </div>
                <div className="text-xs text-blue-300 dark:text-slate-400 font-medium bg-blue-800/50 dark:bg-slate-800/50 px-3 py-1 rounded-full border border-blue-700 dark:border-slate-700">
                    {userRole === "MEMBER" ? "Member" : "Admin"}
                </div>
            </header>

            {/* Backdrop for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden transition-opacity duration-300"
                    onClick={closeSidebar}
                />
            )}

            {/* Sidebar Desktop & Mobile Drawer */}
            <aside
                className={`fixed inset-y-0 left-0 w-64 bg-blue-900 dark:bg-slate-900 border-r border-blue-800 dark:border-slate-800 text-white flex flex-col shadow-22xl z-[60] transition-transform duration-300 transform lg:translate-x-0 lg:static lg:inset-0 ${isOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                {sidebarContent}
            </aside>
        </>
    )
}
