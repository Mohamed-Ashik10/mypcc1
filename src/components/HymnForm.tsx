"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface HymnFormData {
    number: string;
    title: string;
    lyrics: string;
}

interface Props {
    initialData?: HymnFormData & { id?: string };
    mode: "create" | "edit";
}

export default function HymnForm({ initialData, mode }: Props) {
    const router = useRouter();
    const [form, setForm] = useState<HymnFormData>({
        number: initialData?.number ?? "",
        title: initialData?.title ?? "",
        lyrics: initialData?.lyrics ?? "",
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
        const url = mode === "edit" ? `/api/hymns/${initialData?.id}` : "/api/hymns";
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
            router.push("/admin/hymns");
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
                    <label className="block text-sm font-medium text-foreground mb-1.5 ml-1">
                        Hymn Number <span className="text-destructive">*</span>
                    </label>
                    <input
                        type="number"
                        name="number"
                        required
                        min="1"
                        value={form.number}
                        onChange={handleChange}
                        placeholder="e.g. 1"
                        className={inputCls}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5 ml-1">
                        Title <span className="text-destructive">*</span>
                    </label>
                    <input
                        type="text"
                        name="title"
                        required
                        value={form.title}
                        onChange={handleChange}
                        placeholder="e.g. Abide With Me"
                        className={inputCls}
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-foreground mb-1.5 ml-1">
                    Lyrics <span className="text-destructive">*</span>
                </label>
                <textarea
                    name="lyrics"
                    required
                    rows={10}
                    value={form.lyrics}
                    onChange={handleChange}
                    placeholder="Enter the full hymn lyrics here, one verse per block…"
                    className={`${inputCls} resize-y`}
                />
                <p className="text-xs text-muted-foreground/60 mt-2 ml-1">Separate verses with a blank line.</p>
            </div>

            {error && <p className="text-sm text-destructive bg-destructive/10 p-4 rounded-xl border border-destructive/20">{error}</p>}

            <div className="flex gap-3 pt-2">
                <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-500 disabled:opacity-60 transition"
                >
                    {saving ? "Saving…" : mode === "edit" ? "Update Hymn" : "Create Hymn"}
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
