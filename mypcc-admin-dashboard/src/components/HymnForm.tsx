"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { uploadToBackend, fetchFromBackend } from "@/lib/api";

interface HymnFormData {
    number: string;
    title: string;
    lyrics: string;
    author: string;
    tags: string;
    tuneUrl: string;
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
        author: initialData?.author ?? "",
        tags: initialData?.tags ?? "",
        tuneUrl: (initialData as any)?.tuneUrl ?? "",
    });
    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        setError("");
        try {
            const data = await uploadToBackend(file);
            setForm(prev => ({ ...prev, tuneUrl: data.url }));
        } catch (err: any) {
            setError("Upload failed: " + err.message);
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError("");

        const path = mode === "edit" ? `/api/admin/content/hymns/${initialData?.id}` : "/api/admin/content/hymns";
        const method = mode === "edit" ? "PATCH" : "POST";

        try {
            await fetchFromBackend(path, {
                method,
                body: JSON.stringify(form),
            });
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
        <form onSubmit={handleSubmit} className="space-y-6 bg-card text-card-foreground rounded-2xl shadow-lg p-5 sm:p-8 max-w-2xl border border-border">
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

            <div className="space-y-3">
                <label className="block text-sm font-medium text-foreground mb-1.5 ml-1">
                    Tune / Audio File
                </label>
                <div className="flex gap-2">
                    <input
                        type="url"
                        name="tuneUrl"
                        value={form.tuneUrl}
                        onChange={handleChange}
                        placeholder="e.g. https://example.com/hymn.mp3"
                        className={`${inputCls} flex-1`}
                    />
                    <div className="relative">
                        <input
                            type="file"
                            accept="audio/*"
                            onChange={handleFileUpload}
                            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                            disabled={uploading}
                        />
                        <button
                            type="button"
                            disabled={uploading}
                            className="px-4 py-2.5 bg-blue-50 text-blue-600 border border-blue-200 rounded-lg text-sm font-semibold hover:bg-blue-100 transition disabled:opacity-50 whitespace-nowrap"
                        >
                            {uploading ? "Uploading..." : "Upload MP3"}
                        </button>
                    </div>
                </div>
                {form.tuneUrl && (
                    <div className="mt-2 p-3 bg-muted/50 rounded-lg border border-border flex items-center gap-3">
                        <audio src={form.tuneUrl} controls className="h-8 flex-1" />
                        <button 
                            type="button" 
                            onClick={() => setForm(prev => ({ ...prev, tuneUrl: "" }))}
                            className="text-destructive hover:text-destructive/80 p-1"
                        >
                            Remove
                        </button>
                    </div>
                )}
                <p className="text-xs text-muted-foreground/60 ml-1">Link an external URL or upload a file directly to the backend.</p>
            </div>

            {error && <p className="text-sm text-destructive bg-destructive/10 p-4 rounded-xl border border-destructive/20">{error}</p>}

            <div className="flex gap-3 pt-2">
                <button
                    type="submit"
                    disabled={saving || uploading}
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
