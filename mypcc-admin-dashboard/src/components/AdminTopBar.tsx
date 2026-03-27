"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Bell, Globe, Settings2 } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

export function AdminTopBar() {
    const { data: session } = useSession();
    const userName = session?.user?.name || "...";
    const userRole = ((session?.user as any)?.role || "").replace(/_/g, " ");

    return (
        <header className="sticky top-0 lg:static z-[90] lg:z-auto h-[70px] lg:h-[90px] flex items-center px-4 lg:px-8 pt-2 lg:pt-6 pb-2 bg-background/80 backdrop-blur-md lg:bg-transparent">
            <div className="w-full h-full bg-card rounded-xl border border-border shadow-sm flex items-center justify-between px-4 lg:px-10">
                {/* Left */}
                <div className="flex items-center gap-4 text-muted-foreground opacity-60">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                    <span className="text-[12px] lg:text-sm font-medium hidden sm:inline">Search records (Ctrl+/)</span>
                </div>

                {/* Right */}
                <div className="flex items-center gap-2 lg:gap-6">
                    <Link href="/" className="hidden sm:flex flex-row items-center gap-2 px-3 lg:px-5 py-2 lg:py-2.5 bg-primary/5 text-primary border-2 border-primary/10 rounded-xl text-[10px] lg:text-[11px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-sm shrink-0" target="_blank">
                        <Globe size={16} />
                        <span className="hidden md:inline">Go To Website</span>
                    </Link>

                    <div className="flex items-center gap-2 lg:gap-4 text-muted-foreground">
                        <Link href="/admin/announcements" className="p-1.5 lg:p-2 rounded-lg hover:bg-muted transition-colors relative" title="Notifications">
                            <Bell size={18} className="lg:size-5" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-background"></span>
                        </Link>
                        <Link href="/admin/settings" className="hidden xs:flex p-1.5 lg:p-2 rounded-lg hover:bg-muted transition-colors" title="Settings">
                            <Settings2 size={18} className="lg:size-5" />
                        </Link>
                        <ThemeToggle />
                    </div>

                    <div className="flex items-center gap-2 lg:gap-4 lg:pl-4 lg:border-l border-border">
                        <div className="text-right hidden md:block">
                            <p className="text-[12px] lg:text-sm font-black text-foreground leading-none mb-1 uppercase tracking-tighter">{userName}</p>
                            <p className="text-[9px] lg:text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none">{userRole}</p>
                        </div>
                        <div className="w-9 h-9 lg:w-11 lg:h-11 rounded-full bg-muted border-2 border-border flex items-center justify-center text-primary font-black uppercase text-xs lg:text-sm shadow-inner cursor-pointer hover:border-primary transition-all overflow-hidden p-1 lg:p-1.5">
                            <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
