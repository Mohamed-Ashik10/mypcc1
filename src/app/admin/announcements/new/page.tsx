"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewAnnouncementPage() {
    const router = useRouter();
    const [form, setForm] = useState({ title: "", content: "", isActive: true });
    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError("");
        try {
            const res = await fetch("/api/announcements", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed");
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
        <div>
            <h2 className="text-2xl font-bold text-foreground mb-6">📢 New Announcement</h2>
            <form onSubmit={handleSubmit} className="space-y-6 bg-card text-card-foreground rounded-2xl shadow-lg p-8 max-w-2xl border border-border">
                <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5 ml-1">Title <span className="text-destructive">*</span></label>
                    <input
                        type="text" name="title" required value={form.title}
                        onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                        placeholder="e.g. Annual Convention Notice" className={inputCls}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5 ml-1">Content <span className="text-destructive">*</span></label>
                    <textarea
                        name="content" required rows={5} value={form.content}
                        onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))}
                        placeholder="Write the announcement here…" className={`${inputCls} resize-y`}
                    />
                </div>
                <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground cursor-pointer group">
                    <input type="checkbox" checked={form.isActive} onChange={(e) => setForm((p) => ({ ...p, isActive: e.target.checked }))} className="h-4 w-4 rounded border-border bg-background text-blue-600 focus:ring-blue-500 transition-colors" />
                    <span className="group-hover:text-foreground transition-colors">Make active immediately</span>
                </label>

                {error && <p className="text-sm text-destructive bg-destructive/10 p-4 rounded-xl border border-destructive/20">{error}</p>}

                <div className="flex gap-3 pt-2">
                    <button type="submit" disabled={saving} className="px-6 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-500 disabled:opacity-60 transition">
                        {saving ? "Posting…" : "Post Announcement"}
                    </button>
                    <button type="button" onClick={() => router.back()} className="px-6 py-2.5 bg-muted text-muted-foreground rounded-lg text-sm font-semibold hover:bg-muted/80 transition-all active:scale-95">
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}
