"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useTransition } from "react";
import { Search, Filter, X } from "lucide-react";

export default function HymnFilters({ uniqueTags }: { uniqueTags: string[] }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    const [search, setSearch] = useState(searchParams.get("search") || "");
    const [selectedTag, setSelectedTag] = useState(searchParams.get("tag") || "");

    // Sync state with URL params (handles back button or external clear)
    useEffect(() => {
        setSearch(searchParams.get("search") || "");
        setSelectedTag(searchParams.get("tag") || "");
    }, [searchParams]);

    // Debounce search
    useEffect(() => {
        const timeout = setTimeout(() => {
            const currentS = searchParams.get("search") || "";
            if (search !== currentS) {
                updateFilters(search, selectedTag);
            }
        }, 300);
        return () => clearTimeout(timeout);
    }, [search]);

    const updateFilters = (s: string, t: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (s) params.set("search", s);
        else params.delete("search");
        
        if (t) params.set("tag", t);
        else params.delete("tag");

        params.set("page", "1"); // Reset to page 1 on filter change

        startTransition(() => {
            router.push(`/admin/hymns?${params.toString()}`);
        });
    };

    const handleTagChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newTag = e.target.value;
        setSelectedTag(newTag);
        updateFilters(search, newTag);
    };

    const clearFilters = () => {
        setSearch("");
        setSelectedTag("");
        router.push("/admin/hymns");
    };

    return (
        <div className="bg-white rounded-2xl p-6 border border-[#dbdade]/50 shadow-sm relative overflow-hidden">
            {isPending && (
                <div className="absolute top-0 left-0 w-full h-1 bg-[#6e1799]/10 overflow-hidden">
                    <div className="h-full bg-[#6e1799] animate-progress-buffer w-full origin-left"></div>
                </div>
            )}
            <div className="flex flex-wrap items-center gap-4">
                <div className="flex-1 min-w-[280px] relative">
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a5a3ae]" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Find by number or title..."
                        className="w-full bg-[#f8f7fa] border border-[#dbdade]/60 rounded-xl pl-12 pr-4 py-3 text-sm font-medium placeholder:text-[#a5a3ae] focus:outline-none focus:border-[#6e1799] focus:ring-4 focus:ring-[#6e1799]/5 transition-all"
                    />
                </div>
                
                <div className="relative min-w-[200px]">
                    <Filter size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a5a3ae]" />
                    <select
                        value={selectedTag}
                        onChange={handleTagChange}
                        className="w-full bg-[#f8f7fa] border border-[#dbdade]/60 rounded-xl pl-12 pr-10 py-3 text-sm font-bold uppercase tracking-widest text-[#5d596c] appearance-none focus:outline-none focus:border-[#6e1799] transition-all"
                    >
                        <option value="">All Categories</option>
                        {uniqueTags.map((t) => (
                            <option key={t} value={t}>{t}</option>
                        ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[#5d596c]">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                    </div>
                </div>

                <div className="flex gap-2">
                    <button 
                        onClick={() => updateFilters(search, selectedTag)}
                        className="px-6 py-3 bg-[#6e1799] text-white text-[11px] font-black uppercase tracking-widest rounded-xl shadow-md shadow-[#6e1799]/20 hover:-translate-y-0.5 transition-all"
                    >
                        Filter Results
                    </button>
                    {(search || selectedTag) && (
                        <button 
                            onClick={clearFilters}
                            className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm"
                        >
                            <X size={20} />
                        </button>
                    )}
                </div>
            </div>
            
            <style jsx>{`
                @keyframes progress-buffer {
                    0% { transform: translateX(-100%) scaleX(0.2); }
                    50% { transform: translateX(0%) scaleX(0.5); }
                    100% { transform: translateX(100%) scaleX(0.2); }
                }
                .animate-progress-buffer {
                    animation: progress-buffer 2s infinite ease-in-out;
                }
            `}</style>
        </div>
    );
}
