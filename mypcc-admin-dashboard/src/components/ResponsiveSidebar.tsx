"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
    Menu, X, LogOut, Search, Bell, User as UserIcon, Settings, ChevronRight,
    LayoutDashboard, Music, Book, Newspaper, Bird, Users, ShieldAlert, 
    CreditCard, DollarSign, Megaphone, MessageCircle, Info
} from "lucide-react"
import { signOut } from "next-auth/react"

const IconMap: Record<string, any> = {
    LayoutDashboard,
    Music,
    Book,
    Newspaper,
    Bird,
    Users,
    ShieldAlert,
    CreditCard,
    DollarSign,
    Megaphone,
    MessageCircle,
    Info,
    Settings
};

interface NavLink {
    href: string
    label: string
    icon: string
    roles: string[]
}

interface ResponsiveSidebarProps {
    navLinks: NavLink[]
    userRole: string
    appName?: string
    logoAdmin?: string
}

export function ResponsiveSidebar({ navLinks, userRole, appName = "Canticle", logoAdmin = "/logo.png" }: ResponsiveSidebarProps) {
    const [isOpen, setIsOpen] = useState(false)
    const pathname = usePathname()

    const toggleSidebar = () => setIsOpen(!isOpen)
    const closeSidebar = () => setIsOpen(false)

    const filteredLinks = navLinks.filter((link) => link.roles.includes(userRole))

    const mainLinks = filteredLinks.filter(l =>
        ["/admin", "/admin/hymns", "/admin/diary", "/admin/the-echo", "/admin/devotionals", "/admin/announcements", "/admin/testimonials"].includes(l.href)
    )
    const adminLinks = filteredLinks.filter(l =>
        ["/admin/users", "/admin/user-logs", "/admin/subscriptions", "/admin/transactions", "/admin/pcc-info", "/admin/settings", "http://localhost:8080/swagger-ui/index.html"].includes(l.href)
    )

    const NavItem = ({ link }: { link: NavLink }) => {
        const isActive = pathname === link.href
        const IconComponent = IconMap[link.icon] || Settings;
        const isExternal = link.href.startsWith("http");
        return (
            <Link 
                href={link.href} 
                onClick={closeSidebar} 
                className="block px-4 mb-2"
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noopener noreferrer" : undefined}
            >
                <div className={`flex items-center gap-3 px-5 py-3 rounded-full text-[13px] font-bold transition-all duration-300 ease-in-out group
                    ${isActive
                        ? "bg-primary/10 text-primary shadow-sm translate-x-1"
                        : "bg-transparent text-sidebar-text hover:bg-muted hover:text-primary hover:translate-x-1"
                    }`}>
                    <span className={`transition-colors duration-300 ${isActive ? "text-primary" : "text-[#a5a3ae] group-hover:text-primary"}`}>
                        <IconComponent size={18} strokeWidth={isActive ? 2.5 : 2} />
                    </span>
                    <span className="flex-1">{link.label}</span>
                    {isActive && <div className="w-1.5 h-1.5 rounded-full bg-primary animate-in fade-in zoom-in duration-500" />}
                </div>
            </Link>
        )
    }

    const brandSection = (
        <div className="px-6 py-6 mb-4 flex items-center justify-between border-b border-border bg-sidebar-bg">
            <Link href="/admin" className="flex items-center gap-3 group">
                <div className="w-9 h-9 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-center shadow-lg shadow-primary/5 group-hover:scale-105 transition-transform overflow-hidden p-1.5 bg-sidebar-bg">
                    <img src={logoAdmin} alt={`${appName} Logo`} className="w-full h-full object-contain" />
                </div>
                <h1 className="text-[18px] font-black tracking-tighter text-sidebar-text uppercase">
                    {appName.substring(0, appName.length - 3)}<span className="text-primary">{appName.substring(appName.length - 3)}</span>
                </h1>
            </Link>
            <button onClick={closeSidebar} className="lg:hidden p-1.5 rounded-lg text-sidebar-text hover:bg-primary/5 transition-colors">
                <X size={18} />
            </button>
        </div>
    )

    return (
        <>
            {/* Mobile Header (Vuexy uses a top bar on mobile) */}
            <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-sidebar-bg border-b border-border px-4 flex items-center justify-between z-[100] shadow-sm">
                <button onClick={toggleSidebar} className="p-2 rounded-lg text-sidebar-text hover:bg-primary/5 transition-colors">
                    <Menu size={22} />
                </button>
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-sidebar-bg border border-border flex items-center justify-center overflow-hidden p-1">
                        <img src={logoAdmin} alt={`${appName} Logo`} className="w-full h-full object-contain" />
                    </div>
                    <span className="font-black text-sidebar-text text-sm uppercase tracking-tighter">{appName}</span>
                </div>
                <div className="w-9 h-9 rounded-xl bg-muted border border-border flex items-center justify-center text-primary font-black text-xs uppercase shadow-sm">
                    {userRole[0]}
                </div>
            </div>

            {/* Sidebar Desktop */}
            <div className={`fixed inset-y-0 left-0 w-[260px] bg-sidebar-bg border-r border-border z-[110] transition-transform duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0 shadow-2xl shadow-primary/10' : '-translate-x-full lg:translate-x-0'}`}>
                <div className="flex flex-col h-full bg-sidebar-bg">
                    {brandSection}

                    {/* Navigation */}
                    <nav className="flex-1 overflow-y-auto py-2 custom-scrollbar scrollbar-hide">
                        <div className="mb-4">
                            <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground px-8 mb-3 mt-4 opacity-70">Main Menu</p>
                            {mainLinks.map(link => <NavItem key={link.href} link={link} />)}
                        </div>
                        {adminLinks.length > 0 && (
                            <div>
                                <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground px-8 mb-3 mt-8 opacity-70">Administrative</p>
                                {adminLinks.map(link => <NavItem key={link.href} link={link} />)}
                            </div>
                        )}
                    </nav>

                    {/* User Section / Sign Out */}
                    <div className="p-4 border-t border-border bg-muted/30">
                        <button 
                            onClick={() => signOut()}
                            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-full text-[13px] font-bold text-destructive hover:bg-destructive/10 transition-colors group"
                        >
                            <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" />
                            <span>Logout Dashboard</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Overlay Mobile */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-[105] lg:hidden"
                    onClick={closeSidebar}
                />
            )}
        </>
    )
}
