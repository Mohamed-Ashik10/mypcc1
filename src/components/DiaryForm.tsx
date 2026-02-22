"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface DiaryFormData {
    date: string;
    title: string;
    theme: string;
    readingOne: string;
    readingTwo: string;
    readingThree: string;
}

interface Props {
    initialData?: DiaryFormData & { id?: string };
    mode: "create" | "edit";
}

export default function DiaryForm({ initialData, mode }: Props) {
    const router = useRouter();
    const [form, setForm] = useState<DiaryFormData>({
        date: initialData?.date?.slice(0, 10) ?? "",
        title: initialData?.title ?? "",
        theme: initialData?.theme ?? "",
        readingOne: initialData?.readingOne ?? "",
        readingTwo: initialData?.readingTwo ?? "",
        readingThree: initialData?.readingThree ?? "",
    });
    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError("");

        const url = mode === "edit" ? `/api/diary/${initialData?.id}` : "/api/diary";
        const method = mode === "edit" ? "PATCH" : "POST";

        try {
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Something went wrong");
            }

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

    return (
        <form onSubmit={handleSubmit} className="space-y-6 bg-card text-card-foreground rounded-2xl shadow-lg p-8 max-w-2xl border border-border">
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
                <label className="block text-sm font-medium text-foreground mb-1.5 ml-1">Theme / Sermon Note</label>
                <input type="text" name="theme" value={form.theme} onChange={handleChange} placeholder="e.g. God's Grace" className={inputCls} />
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
