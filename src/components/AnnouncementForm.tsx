"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface AnnouncementFormData {
    title: string;
    content: string;
    isActive: boolean;
}

interface Props {
    initialData?: AnnouncementFormData & { id?: string };
    mode: "create" | "edit";
}

export default function AnnouncementForm({ initialData, mode }: Props) {
    const router = useRouter();
    const [form, setForm] = useState<AnnouncementFormData>({
        title: initialData?.title ?? "",
        content: initialData?.content ?? "",
        isActive: initialData?.isActive ?? true,
    });
    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError("");

        const url = mode === "edit" ? `/api/announcements/${initialData?.id}` : "/api/announcements";
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
            router.push("/admin/announcements");
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
            <div>
                <label className="block text-sm font-medium text-foreground mb-1.5 ml-1">Title <span className="text-destructive">*</span></label>
                <input type="text" name="title" required value={form.title} onChange={handleChange} placeholder="e.g. Youth Camp Registration Open" className={inputCls} />
            </div>

            <div>
                <label className="block text-sm font-medium text-foreground mb-1.5 ml-1">Content <span className="text-destructive">*</span></label>
                <textarea
                    name="content"
                    required
                    value={form.content}
                    onChange={handleChange}
                    placeholder="Write the announcement body here…"
                    rows={5}
                    className={inputCls + " resize-y"}
                />
            </div>

            <div className="flex items-center gap-2">
                <input
                    type="checkbox"
                    id="isActive"
                    name="isActive"
                    checked={form.isActive}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-border bg-background text-blue-600 focus:ring-blue-500 transition-colors"
                />
                <label htmlFor="isActive" className="text-sm font-medium text-foreground cursor-pointer">
                    Active <span className="text-muted-foreground font-normal">(visible to members)</span>
                </label>
            </div>

            {error && <p className="text-sm text-destructive bg-destructive/10 p-4 rounded-xl border border-destructive/20">{error}</p>}

            <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="px-6 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-500 disabled:opacity-60 transition">
                    {saving ? "Saving…" : mode === "edit" ? "Update Announcement" : "Post Announcement"}
                </button>
                <button type="button" onClick={() => router.back()} className="px-6 py-2.5 bg-muted text-muted-foreground rounded-lg text-sm font-semibold hover:bg-muted/80 transition-all active:scale-95">
                    Cancel
                </button>
            </div>
        </form>
    );
}
