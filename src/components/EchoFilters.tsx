"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useTransition } from "react";
import { Search, X, Calendar } from "lucide-react";

export default function EchoFilters({ initialYear = "" }: { initialYear?: string }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    const [search, setSearch] = useState(searchParams.get("search") || "");
    const [year, setYear] = useState(searchParams.get("year") || initialYear);
    const [month, setMonth] = useState(searchParams.get("month") || "");

    // Debounce search
    useEffect(() => {
        const timeout = setTimeout(() => {
            updateFilters(search, year, month);
        }, 300);
        return () => clearTimeout(timeout);
    }, [search]);

    const updateFilters = (s: string, y: string, m: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (s) params.set("search", s);
        else params.delete("search");
        
        if (y) params.set("year", y);
        else params.delete("year");

        if (m) params.set("month", m);
        else params.delete("month");

        startTransition(() => {
            router.push(`?${params.toString()}`);
        });
    };

    const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newYear = e.target.value;
        setYear(newYear);
        updateFilters(search, newYear, month);
    };

    const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newMonth = e.target.value;
        setMonth(newMonth);
        updateFilters(search, year, newMonth);
    };

    const clearFilters = () => {
        setSearch("");
        setYear("");
        setMonth("");
        router.push("?");
    };

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 5 }, (_, i) => (currentYear - i).toString());
    const months = [
        { val: "01", label: "January" },
        { val: "02", label: "February" },
        { val: "03", label: "March" },
        { val: "04", label: "April" },
        { val: "05", label: "May" },
        { val: "06", label: "June" },
        { val: "07", label: "July" },
        { val: "08", label: "August" },
        { val: "09", label: "September" },
        { val: "10", label: "October" },
        { val: "11", label: "November" },
        { val: "12", label: "December" },
    ];

    return (
        <div className="flex flex-col sm:flex-row items-center gap-4 bg-card p-4 rounded-2xl border border-border shadow-sm mb-8">
            <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground transition-all" />
                <input
                    type="text"
                    placeholder="Search issues by title..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                />
                {search && (
                    <button
                        onClick={() => setSearch("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                        <X className="w-4 h-4" />
                    </button>
                )}
            </div>

            <div className="flex gap-3 w-full sm:w-auto">
                <div className="relative w-full sm:w-36">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                    <select
                        value={year}
                        onChange={handleYearChange}
                        className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm appearance-none cursor-pointer"
                    >
                        <option value="">Year</option>
                        {years.map((y) => (
                            <option key={y} value={y}>{y}</option>
                        ))}
                        <option value="2023">2023</option>
                    </select>
                </div>

                <div className="relative w-full sm:w-40">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                    <select
                        value={month}
                        onChange={handleMonthChange}
                        className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm appearance-none cursor-pointer"
                    >
                        <option value="">Month</option>
                        {months.map((m) => (
                            <option key={m.val} value={m.val}>{m.label}</option>
                        ))}
                    </select>
                </div>
            </div>

            {(search || year || month) && (
                <button
                    onClick={clearFilters}
                    className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                    Clear Filter
                </button>
            )}
            
            {isPending && (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent sm:ml-2"></div>
            )}
        </div>
    );
}
