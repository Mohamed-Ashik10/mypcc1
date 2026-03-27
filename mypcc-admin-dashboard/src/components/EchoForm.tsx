"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { uploadToBackend, fetchFromBackend } from "@/lib/api";

interface EchoFormData {
    title: string;
    issueMonth: string;
    pdfUrl: string;
    coverUrl: string;
    images: string[];
    isFree: boolean;
    isFeatured: boolean;
    excerpt: string;
    fullText: string;
}

interface Props {
    initialData?: any; // Use any to handle Json parsing from prisma
    mode: "create" | "edit";
}

export default function EchoForm({ initialData, mode }: Props) {
    const router = useRouter();
    
    // Parse images if they come as string/Json
    const initialImages = Array.isArray(initialData?.images) 
        ? initialData.images 
        : (typeof initialData?.images === 'string' ? JSON.parse(initialData.images) : []);

    const [form, setForm] = useState<EchoFormData>({
        title: initialData?.title ?? "",
        issueMonth: initialData?.issueMonth?.slice(0, 7) ?? "",
        pdfUrl: initialData?.pdfUrl ?? "#",
        coverUrl: initialData?.coverUrl ?? "",
        images: initialImages,
        isFree: initialData?.isFree ?? true,
        isFeatured: initialData?.isFeatured ?? false,
        excerpt: initialData?.excerpt ?? "",
        fullText: initialData?.fullText ?? "",
    });
    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState<"pdf" | "cover" | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: "pdfUrl" | "coverUrl") => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(field === "pdfUrl" ? "pdf" : "cover");
        setError("");
        try {
            const data = await uploadToBackend(file);
            setForm(prev => ({ ...prev, [field]: data.url }));
        } catch (err: any) {
            setError(`Upload failed for ${field === "pdfUrl" ? "PDF" : "Cover"}: ` + err.message);
        } finally {
            setUploading(null);
        }
    };

    const handleImageChange = (index: number, value: string) => {
        const newImages = [...form.images];
        newImages[index] = value;
        setForm(prev => ({ ...prev, images: newImages }));
    };

    const addImage = () => {
        setForm(prev => ({ ...prev, images: [...prev.images, ""] }));
    };

    const removeImage = (index: number) => {
        setForm(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError("");

        const path = mode === "edit" ? `/api/admin/content/echo/${initialData?.id}` : "/api/admin/content/echo";
        const method = mode === "edit" ? "PATCH" : "POST";

        // Format date for Spring Boot LocalDateTime (e.g. 2026-03-01T00:00:00)
        const formattedIssueMonth = `${form.issueMonth}-01T00:00:00`;

        try {
            await fetchFromBackend(path, {
                method,
                body: JSON.stringify({
                    ...form,
                    issueMonth: formattedIssueMonth,
                }),
            });
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
        <form onSubmit={handleSubmit} className="space-y-6 bg-card text-card-foreground rounded-2xl shadow-lg p-5 sm:p-8 max-w-2xl border border-border">
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
                        <input type="checkbox" id="isFree" name="isFree" checked={form.isFree} onChange={handleChange} className="h-4 w-4 rounded border-border bg-background text-blue-600 focus:ring-blue-500 transition-colors" />
                        <span className="group-hover:text-foreground transition-colors mr-6">Free Access</span>
                    </label>
                    <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground cursor-pointer group">
                        <input type="checkbox" id="isFeatured" name="isFeatured" checked={form.isFeatured} onChange={handleChange} className="h-4 w-4 rounded border-border bg-background text-amber-600 focus:ring-amber-500 transition-colors" />
                        <span className="group-hover:text-amber-600 transition-colors">Featured Issue</span>
                    </label>
                </div>
            </div>

            <div className="space-y-4">
                <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-foreground mb-1.5 ml-1">Cover Image</label>
                    <div className="flex gap-2">
                        <input type="url" name="coverUrl" value={form.coverUrl} onChange={handleChange} placeholder="https://storage.example.com/cover.jpg" className={inputCls + " flex-1"} />
                        <div className="relative">
                            <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, "coverUrl")} className="absolute inset-0 opacity-0 cursor-pointer" disabled={!!uploading} />
                            <button type="button" disabled={!!uploading} className="px-4 py-2.5 bg-blue-50 text-blue-600 border border-blue-200 rounded-lg text-sm font-semibold hover:bg-blue-100 transition whitespace-nowrap">
                                {uploading === "cover" ? "..." : "Upload Cover"}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-foreground mb-1.5 ml-1">PDF Document <span className="text-destructive">*</span></label>
                    <div className="flex gap-2">
                        <input type="url" name="pdfUrl" required value={form.pdfUrl} onChange={handleChange} placeholder="https://storage.example.com/issue.pdf" className={inputCls + " flex-1"} />
                        <div className="relative">
                            <input type="file" accept=".pdf" onChange={(e) => handleFileUpload(e, "pdfUrl")} className="absolute inset-0 opacity-0 cursor-pointer" disabled={!!uploading} />
                            <button type="button" disabled={!!uploading} className="px-4 py-2.5 bg-blue-50 text-blue-600 border border-blue-200 rounded-lg text-sm font-semibold hover:bg-blue-100 transition whitespace-nowrap">
                                {uploading === "pdf" ? "..." : "Upload PDF"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-3">
                <div className="flex items-center justify-between ml-1">
                    <label className="text-sm font-medium text-foreground">Gallery Images</label>
                    <button type="button" onClick={addImage} className="text-xs font-semibold text-blue-600 hover:text-blue-500 flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-md transition-all">
                       <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg> Add Image
                    </button>
                </div>
                <div className="grid grid-cols-1 gap-2">
                    {form.images.map((url, index) => (
                        <div key={index} className="flex gap-2">
                            <input 
                                type="url" 
                                value={url} 
                                onChange={(e) => handleImageChange(index, e.target.value)} 
                                placeholder={`Gallery Image #${index + 1} URL`} 
                                className={inputCls + " flex-1"} 
                            />
                            <button type="button" onClick={() => removeImage(index)} className="p-2.5 text-destructive hover:bg-destructive/10 rounded-lg transition-colors border border-transparent hover:border-destructive/20" title="Remove image">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                            </button>
                        </div>
                    ))}
                    {form.images.length === 0 && (
                        <p className="text-xs text-muted-foreground italic ml-1">No additional gallery images added.</p>
                    )}
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-foreground mb-1.5 ml-1">Excerpt <span className="text-xs text-muted-foreground">(short summary shown on cards)</span></label>
                <textarea
                    name="excerpt"
                    value={form.excerpt}
                    onChange={(e) => setForm(prev => ({ ...prev, excerpt: e.target.value }))}
                    placeholder="A brief description of this Echo issue…"
                    rows={2}
                    className={inputCls + " resize-none"}
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-foreground mb-1.5 ml-1">Full Article Text <span className="text-xs text-muted-foreground">(shown when user clicks "Read More")</span></label>
                <textarea
                    name="fullText"
                    value={form.fullText}
                    onChange={(e) => setForm(prev => ({ ...prev, fullText: e.target.value }))}
                    placeholder="Paste the full article content here…"
                    rows={8}
                    className={inputCls + " resize-y"}
                />
            </div>

            {error && <p className="text-sm text-destructive bg-destructive/10 p-4 rounded-xl border border-destructive/20">{error}</p>}

            <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving || !!uploading} className="px-6 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-500 disabled:opacity-60 transition">
                    {saving ? "Saving…" : mode === "edit" ? "Update Issue" : "Publish Issue"}
                </button>
                <button type="button" onClick={() => router.back()} className="px-6 py-2.5 bg-muted text-muted-foreground rounded-lg text-sm font-semibold hover:bg-muted/80 transition-all active:scale-95">
                    Cancel
                </button>
            </div>
        </form>
    );
}
