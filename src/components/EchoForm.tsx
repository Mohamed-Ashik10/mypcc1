"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface EchoFormData {
    title: string;
    issueMonth: string;
    pdfUrl: string;
    coverUrl: string;
    isFree: boolean;
}

interface Props {
    initialData?: EchoFormData & { id?: string };
    mode: "create" | "edit";
}

export default function EchoForm({ initialData, mode }: Props) {
    const router = useRouter();
    const [form, setForm] = useState<EchoFormData>({
        title: initialData?.title ?? "",
        issueMonth: initialData?.issueMonth?.slice(0, 7) ?? "",
        pdfUrl: initialData?.pdfUrl ?? "",
        coverUrl: initialData?.coverUrl ?? "",
        isFree: initialData?.isFree ?? true,
    });
    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError("");

        const url = mode === "edit" ? `/api/the-echo/${initialData?.id}` : "/api/the-echo";
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
            router.push("/admin/the-echo");
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
                <input type="text" name="title" required value={form.title} onChange={handleChange} placeholder="e.g. The Echo – March 2026" className={inputCls} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5 ml-1">Issue Month <span className="text-destructive">*</span></label>
                    <input type="month" name="issueMonth" required value={form.issueMonth} onChange={handleChange} className={inputCls} />
                </div>
                <div className="flex items-end pb-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground cursor-pointer group">
                        <input type="checkbox" name="isFree" checked={form.isFree} onChange={handleChange} className="h-4 w-4 rounded border-border bg-background text-blue-600 focus:ring-blue-500 transition-colors" />
                        <span className="group-hover:text-foreground transition-colors">Free Access</span>
                    </label>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-foreground mb-1.5 ml-1">PDF URL <span className="text-destructive">*</span></label>
                <input type="url" name="pdfUrl" required value={form.pdfUrl} onChange={handleChange} placeholder="https://storage.example.com/echo-march-2026.pdf" className={inputCls} />
            </div>

            <div>
                <label className="block text-sm font-medium text-foreground mb-1.5 ml-1">Cover Image URL</label>
                <input type="url" name="coverUrl" value={form.coverUrl} onChange={handleChange} placeholder="https://storage.example.com/cover.jpg" className={inputCls} />
            </div>

            {error && <p className="text-sm text-destructive bg-destructive/10 p-4 rounded-xl border border-destructive/20">{error}</p>}

            <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="px-6 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-500 disabled:opacity-60 transition">
                    {saving ? "Saving…" : mode === "edit" ? "Update Issue" : "Publish Issue"}
                </button>
                <button type="button" onClick={() => router.back()} className="px-6 py-2.5 bg-muted text-muted-foreground rounded-lg text-sm font-semibold hover:bg-muted/80 transition-all active:scale-95">
                    Cancel
                </button>
            </div>
        </form>
    );
}
