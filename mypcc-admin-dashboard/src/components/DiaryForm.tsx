"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetchFromBackend } from "@/lib/api";

interface DiaryFormData {
    date: string;
    title: string;
    theme: string;
    readingOne: string;
    readingTwo: string;
    readingThree: string;
    isFree: boolean;
    minPlan: string;
}

interface Props {
    initialData?: DiaryFormData & { id?: string };
    mode: "create" | "edit";
}

const PRESET_THEMES = [
    "Worship & Praise",
    "Comfort",
    "Trust in God",
    "Gratitude",
    "Faith",
    "Prayer",
    "Strength",
];

export default function DiaryForm({ initialData, mode }: Props) {
    const router = useRouter();
    const [form, setForm] = useState<DiaryFormData>({
        date: initialData?.date?.slice(0, 10) ?? "",
        title: initialData?.title ?? "",
        theme: initialData?.theme ?? "",
        readingOne: initialData?.readingOne ?? "",
        readingTwo: initialData?.readingTwo ?? "",
        readingThree: initialData?.readingThree ?? "",
        isFree: initialData?.isFree ?? true,
        minPlan: initialData?.minPlan ?? "SEEKER",
    });
    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError("");

        const url = mode === "edit" ? `/api/admin/diary/${initialData?.id}` : "/api/admin/diary";
        const method = mode === "edit" ? "PATCH" : "POST";

        try {
            // Spring Boot backend expects full ISO for LocalDateTime
            const submissionData = {
                ...form,
                date: form.date ? `${form.date}T00:00:00` : new Date().toISOString().split('T')[0] + 'T00:00:00',
                id: mode === "edit" ? initialData?.id : `entry-${Date.now()}` // Generate ID for new if missing
            };

            await fetchFromBackend(url, {
                method,
                body: JSON.stringify(submissionData),
            });

            router.push("/admin/diary");
            router.refresh();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    const inputCls =
        "block w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all";

    if (!mounted) return <div className="p-20 text-center animate-pulse text-[#a5a3ae] font-black uppercase tracking-widest">Optimizing Workspace...</div>;

    return (
        <form onSubmit={handleSubmit} className="space-y-6 bg-card text-card-foreground rounded-2xl shadow-lg p-5 sm:p-8 max-w-4xl border border-border">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5 ml-1">Date <span className="text-destructive">*</span></label>
                    <input type="date" name="date" required value={form.date} onChange={handleChange} className={inputCls} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5 ml-1">Title / Heading</label>
                    <input type="text" name="title" value={form.title} onChange={handleChange} placeholder="e.g. Day of Rest" className={inputCls} />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-foreground mb-1.5 ml-1">Spiritual Theme</label>
                <div className="flex gap-3">
                    <select
                        name="theme"
                        value={PRESET_THEMES.includes(form.theme) ? form.theme : form.theme ? "Other" : ""}
                        onChange={(e) => {
                            if (e.target.value === "Other") setForm(prev => ({ ...prev, theme: "" }));
                            else setForm(prev => ({ ...prev, theme: e.target.value }));
                        }}
                        className={`${inputCls} w-1/3`}
                    >
                        <option value="">Select a Theme</option>
                        {PRESET_THEMES.map(t => <option key={t} value={t}>{t}</option>)}
                        <option value="Other">Other / Custom</option>
                    </select>
                    {(!PRESET_THEMES.includes(form.theme) || form.theme === "") && (
                        <input
                            type="text"
                            name="theme"
                            value={form.theme}
                            onChange={handleChange}
                            placeholder="Enter custom theme..."
                            className={inputCls}
                        />
                    )}
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-foreground mb-1.5 ml-1">Reading 1 <span className="text-destructive">*</span></label>
                <input type="text" name="readingOne" required value={form.readingOne} onChange={handleChange} placeholder="e.g. Genesis 1:1-31" className={inputCls} />
            </div>

            <div>
                <label className="block text-sm font-medium text-foreground mb-1.5 ml-1">Reading 2</label>
                <input type="text" name="readingTwo" value={form.readingTwo} onChange={handleChange} placeholder="e.g. Psalms 23:1-6" className={inputCls} />
            </div>

            <div>
                <label className="block text-sm font-medium text-foreground mb-1.5 ml-1">Reading 3</label>
                <input type="text" name="readingThree" value={form.readingThree} onChange={handleChange} placeholder="e.g. John 3:16-21" className={inputCls} />
            </div>

            {/* ── Access Control ── */}
            <div className="rounded-xl border border-border p-5 space-y-4 bg-background/50">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Access Level</p>
                <div className="flex items-center gap-3">
                    <input
                        type="checkbox"
                        id="isFree"
                        checked={form.isFree}
                        onChange={(e) => setForm(prev => ({ ...prev, isFree: e.target.checked }))}
                        className="w-4 h-4 rounded accent-blue-600"
                    />
                    <label htmlFor="isFree" className="text-sm font-medium text-foreground">
                        Free — visible to all users
                    </label>
                </div>
                {!form.isFree && (
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1">Minimum Plan Required</label>
                        <select
                            name="minPlan"
                            value={form.minPlan}
                            onChange={(e) => setForm(prev => ({ ...prev, minPlan: e.target.value }))}
                            className="w-full bg-background border border-border rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                        >
                            <option value="SEEKER">Seeker (Free)</option>
                            <option value="PILGRIM">Pilgrim ($7/mo)</option>
                            <option value="SHEPHERD">Shepherd ($18/mo)</option>
                        </select>
                    </div>
                )}
            </div>

            {error && (
                <p className="text-sm text-destructive bg-destructive/10 p-4 rounded-xl border border-destructive/20">{error}</p>
            )}

            <div className="flex gap-3 pt-2">
                <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-500 disabled:opacity-60 transition"
                >
                    {saving ? "Saving…" : mode === "edit" ? "Update Entry" : "Create Entry"}
                </button>
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="px-6 py-2.5 bg-muted text-muted-foreground rounded-lg text-sm font-semibold hover:bg-muted/80 transition-all active:scale-95"
                >
                    Cancel
                </button>
            </div>
        </form>
    );
}
