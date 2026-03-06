"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, LogOut } from "lucide-react"
import { ThemeToggle } from "@/components/ThemeToggle"
import { signOut } from "next-auth/react"

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

    // Split into main and admin sections
    const mainLinks = filteredLinks.filter(l =>
        ["/admin", "/admin/hymns", "/admin/diary", "/admin/the-echo", "/admin/devotionals", "/admin/announcements"].includes(l.href)
    )
    const adminLinks = filteredLinks.filter(l =>
        ["/admin/users", "/admin/user-logs", "/admin/subscriptions", "/admin/transactions", "/admin/pcc-info"].includes(l.href)
    )

    const NavItem = ({ link }: { link: NavLink }) => {
        const isActive = pathname === link.href
        return (
            <Link href={link.href} onClick={closeSidebar}>
                <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all relative group cursor-pointer
                    ${isActive
                        ? "bg-[#6c47ff]/20 text-white"
                        : "text-[rgba(255,255,255,0.45)] hover:bg-white/5 hover:text-white"
                    }`}>
                    {isActive && (
                        <div className="absolute left-0 top-[20%] bottom-[20%] w-[3px] rounded-full bg-gradient-to-b from-[#6c47ff] to-[#a855f7]" />
                    )}
                    <span className="text-base pl-1">{link.icon}</span>
                    <span>{link.label}</span>
                </div>
            </Link>
        )
    }

    const sidebarContent = (
        <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="px-5 py-6 border-b border-white/[0.07] flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-[10px] bg-gradient-to-br from-[#6c47ff] to-[#a855f7] flex items-center justify-center text-white text-xs font-black shadow-[0_0_20px_rgba(108,71,255,0.5)] animate-pulse">
                        PCC
                    </div>
                    <div>
                        <h1 className="text-base font-bold tracking-tight text-white leading-none">
                            Canti<span className="text-[#a855f7]">cle</span>
                        </h1>
                        <p className="text-[10px] text-white/30 mt-0.5 tracking-widest uppercase">
                            {userRole === "NORMAL_USER" ? "Member Portal" : "Admin Dashboard"}
                        </p>
                    </div>
                </div>
                <button onClick={closeSidebar} className="lg:hidden text-white/40 hover:text-white transition-colors">
                    <X size={20} />
                </button>
            </div>

            {/* Main Nav */}
            <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-4">
                <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/20 px-3 mb-2">Main Menu</p>
                    <div className="space-y-0.5">
                        {mainLinks.map(link => <NavItem key={link.href} link={link} />)}
                    </div>
                </div>
                {adminLinks.length > 0 && (
                    <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/20 px-3 mb-2">Admin</p>
                        <div className="space-y-0.5">
                            {adminLinks.map(link => <NavItem key={link.href} link={link} />)}
                        </div>
                    </div>
                )}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-white/[0.07] space-y-3">
                <div className="flex justify-center">
                    <ThemeToggle />
                </div>
                <button
                    onClick={() => signOut({ callbackUrl: "/auth/login" })}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2.5 text-sm text-white/35 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                >
                    <LogOut size={15} />
                    Sign Out
                </button>
            </div>
        </div>
    )

    return (
        <>
            {/* Mobile Header */}
            <header className="lg:hidden flex items-center justify-between p-4 bg-[#0d0d1e] border-b border-white/[0.07] sticky top-0 z-40 text-white">
                <div className="flex items-center gap-3">
                    <button onClick={toggleSidebar} className="p-2 -ml-2 rounded-lg hover:bg-white/5 transition-colors">
                        <Menu size={22} />
                    </button>
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#6c47ff] to-[#a855f7] flex items-center justify-center text-white text-[9px] font-black">
                            PCC
                        </div>
                        <h1 className="text-base font-bold">Canti<span className="text-[#a855f7]">cle</span></h1>
                    </div>
                </div>
                <div className="text-[10px] text-[#a855f7] font-semibold bg-[#6c47ff]/10 border border-[#6c47ff]/20 px-3 py-1 rounded-full tracking-widest uppercase">
                    {userRole === "NORMAL_USER" ? "Member" : "Admin"}
                </div>
            </header>

            {/* Mobile Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 lg:hidden"
                    onClick={closeSidebar}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 w-60 bg-[#0d0d1e] border-r border-white/[0.07] text-white flex flex-col z-[60] transition-transform duration-300 lg:translate-x-0 lg:static lg:inset-0
                    ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
                style={{
                    background: "linear-gradient(180deg,#0f0f22 0%,#0a0a18 100%)"
                }}
            >
                {sidebarContent}
            </aside>
        </>
    )
}
