"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useTransition } from "react";
import { Search, Calendar, X, Sparkles } from "lucide-react";

export default function DiaryFilters({ months }: { months: string[] }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    const presetThemes = [
        "Worship & Praise",
        "Comfort",
        "Trust in God",
        "Gratitude",
        "Faith",
        "Prayer",
        "Strength",
    ];

    const [search, setSearch] = useState(searchParams.get("search") || "");
    const [selectedMonth, setSelectedMonth] = useState(searchParams.get("month") || "");
    const [selectedYear, setSelectedYear] = useState(searchParams.get("year") || "");
    const [selectedTheme, setSelectedTheme] = useState(searchParams.get("theme") || "");

    const years = [
        (new Date().getFullYear() - 1).toString(),
        new Date().getFullYear().toString(),
        (new Date().getFullYear() + 1).toString()
    ];

    // Sync state with URL params
    useEffect(() => {
        setSearch(searchParams.get("search") || "");
        setSelectedMonth(searchParams.get("month") || "");
        setSelectedYear(searchParams.get("year") || "");
        setSelectedTheme(searchParams.get("theme") || "");
    }, [searchParams]);

    const updateFilters = (s: string, m: string, y: string, t: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (s) params.set("search", s);
        else params.delete("search");
        
        if (m) params.set("month", m);
        else params.delete("month");

        if (y) params.set("year", y);
        else params.delete("year");

        if (t) params.set("theme", t);
        else params.delete("theme");

        params.set("page", "1");

        startTransition(() => {
            router.push(`/admin/diary?${params.toString()}`);
        });
    };

    const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newMonth = e.target.value;
        setSelectedMonth(newMonth);
        updateFilters(search, newMonth, selectedYear, selectedTheme);
    };

    const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newYear = e.target.value;
        setSelectedYear(newYear);
        updateFilters(search, selectedMonth, newYear, selectedTheme);
    };

    const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newTheme = e.target.value;
        setSelectedTheme(newTheme);
        updateFilters(search, selectedMonth, selectedYear, newTheme);
    };

    const clearFilters = () => {
        setSearch("");
        setSelectedMonth("");
        setSelectedYear("");
        setSelectedTheme("");
        router.push("/admin/diary");
    };

    return (
        <div className="bg-card rounded-2xl p-6 border border-border shadow-sm relative overflow-hidden">
            {isPending && (
                <div className="absolute top-0 left-0 w-full h-1 bg-[#6e1799]/10 overflow-hidden">
                    <div className="h-full bg-[#6e1799] animate-pulse w-full"></div>
                </div>
            )}
            <div className="flex flex-wrap items-center gap-4">
                {/* Search Input */}
                <div className="flex-1 min-w-[280px] relative">
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            // Debounce logic could go here if needed, but for now it's direct to avoid lag
                        }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') updateFilters(search, selectedMonth, selectedYear, selectedTheme);
                        }}
                        placeholder="Search scriptures or keywords..."
                        className="w-full bg-muted/30 border border-border rounded-xl pl-12 pr-4 py-3 text-sm font-medium placeholder:text-muted-foreground focus:outline-none focus:border-[#6e1799] focus:ring-4 focus:ring-[#6e1799]/5 transition-all text-foreground"
                    />
                </div>
                
                {/* Theme Filter */}
                <div className="relative min-w-[150px]">
                    <Sparkles size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6e1799]" />
                    <select
                        value={selectedTheme}
                        onChange={handleThemeChange}
                        className="w-full bg-muted/30 border border-border rounded-xl pl-12 pr-10 py-3 text-[10px] font-black uppercase tracking-widest text-foreground appearance-none focus:outline-none focus:border-[#6e1799] transition-all cursor-pointer"
                    >
                        <option value="">Spiritual Theme</option>
                        {presetThemes.map((t) => (
                            <option key={t} value={t}>{t}</option>
                        ))}
                    </select>
                </div>

                {/* Month Picker */}
                <div className="relative min-w-[140px]">
                    <Calendar size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6e1799]" />
                    <select
                        value={selectedMonth}
                        onChange={handleMonthChange}
                        className="w-full bg-muted/30 border border-border rounded-xl pl-12 pr-10 py-3 text-[10px] font-black uppercase tracking-widest text-foreground appearance-none focus:outline-none focus:border-[#6e1799] transition-all cursor-pointer"
                    >
                        <option value="">Month</option>
                        {months.map((m) => (
                            <option key={m} value={m}>{m}</option>
                        ))}
                    </select>
                </div>

                {/* Year Picker */}
                <div className="relative min-w-[120px]">
                    <Calendar size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6e1799]" />
                    <select
                        value={selectedYear}
                        onChange={handleYearChange}
                        className="w-full bg-muted/30 border border-border rounded-xl pl-12 pr-10 py-3 text-[10px] font-black uppercase tracking-widest text-foreground appearance-none focus:outline-none focus:border-[#6e1799] transition-all cursor-pointer"
                    >
                        <option value="">Year</option>
                        {years.map((y) => (
                            <option key={y} value={y}>{y}</option>
                        ))}
                    </select>
                </div>

                {/* Reset Button */}
                <div className="flex gap-2">
                    {(search || selectedMonth || selectedYear || selectedTheme) && (
                        <button 
                            onClick={clearFilters}
                            className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm"
                            title="Clear Filters"
                        >
                            <X size={20} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
