"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const CATEGORIES = ["Inspiration", "Youth", "Special Series", "Healing", "Praise", "Prayer", "Faith", "Community"];

export default function NewDevotionalPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [imagePreview, setImagePreview] = useState("");

    const [formData, setFormData] = useState({
        title: "",
        date: new Date().toISOString().slice(0, 10),
        author: "",
        content: "",
        image: "",
        category: "Inspiration",
        reading: "",
        excerpt: "",
        isFree: true,
        minPlan: "SEEKER",
    });

    const handleChange = (field: string, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (field === "image") setImagePreview(value);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const res = await fetch("/api/devotionals", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                router.push("/admin/devotionals");
                router.refresh();
            } else {
                const data = await res.json();
                setError(data.error || "Failed to create devotional");
            }
        } catch (err) {
            console.error(err);
            setError("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/admin/devotionals" className="text-muted-foreground hover:text-foreground">← Back</Link>
                <h2 className="text-2xl font-bold text-foreground">Add New Devotional</h2>
            </div>

            <div className="bg-card text-card-foreground p-6 sm:p-8 rounded-2xl shadow-md border border-border">
                {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl mb-6 text-sm border border-red-200 dark:border-red-800/30">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* ── Hero Image ── */}
                    <div className="rounded-xl border border-border p-5 space-y-4 bg-background/50">
                        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Hero Image</p>
                        <div className="flex gap-4 items-start">
                            {imagePreview && (
                                <div className="flex-shrink-0 w-32 h-20 rounded-lg overflow-hidden border border-border bg-muted">
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="w-full h-full object-cover"
                                        onError={() => setImagePreview("")}
                                    />
                                </div>
                            )}
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-foreground mb-1">Image URL</label>
                                <input
                                    type="url"
                                    placeholder="https://images.unsplash.com/..."
                                    className="w-full bg-background border border-border rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm"
                                    value={formData.image}
                                    onChange={(e) => handleChange("image", e.target.value)}
                                />
                                <p className="text-xs text-muted-foreground mt-1">
                                    Paste any public image URL (Unsplash, etc.). Shown as the full-width cinematic hero banner.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* ── Title ── */}
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1">Title</label>
                        <input
                            type="text"
                            required
                            placeholder="e.g. Strength in Weakness"
                            className="w-full bg-background border border-border rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                            value={formData.title}
                            onChange={(e) => handleChange("title", e.target.value)}
                        />
                    </div>

                    {/* ── Date + Author ── */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">Date to Publish</label>
                            <input
                                type="date"
                                required
                                className="w-full bg-background border border-border rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                value={formData.date}
                                onChange={(e) => handleChange("date", e.target.value)}
                            />
                            <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1.5">
                                <span className="text-amber-500">⏳</span> Select a future date to automatically queue this devotional.
                            </p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">Author (Optional)</label>
                            <input
                                type="text"
                                placeholder="e.g. Rev. John Doe"
                                className="w-full bg-background border border-border rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                value={formData.author}
                                onChange={(e) => handleChange("author", e.target.value)}
                            />
                        </div>
                    </div>

                    {/* ── Category + Reading ── */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">Category</label>
                            <select
                                className="w-full bg-background border border-border rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                value={formData.category}
                                onChange={(e) => handleChange("category", e.target.value)}
                            >
                                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">Scripture Reading</label>
                            <input
                                type="text"
                                placeholder="e.g. Psalm 23:1–6"
                                className="w-full bg-background border border-border rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                value={formData.reading}
                                onChange={(e) => handleChange("reading", e.target.value)}
                            />
                        </div>
                    </div>

                    {/* ── Excerpt ── */}
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1">
                            Excerpt <span className="text-muted-foreground font-normal text-xs">(Short preview shown to non-subscribers)</span>
                        </label>
                        <textarea
                            rows={2}
                            placeholder="A short teaser shown before the paywall..."
                            className="w-full bg-background border border-border rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm resize-y"
                            value={formData.excerpt}
                            onChange={(e) => handleChange("excerpt", e.target.value)}
                        />
                    </div>

                    {/* ── Access Control ── */}
                    <div className="rounded-xl border border-border p-5 space-y-4 bg-background/50">
                        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Access Level</p>
                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                id="isFree"
                                checked={formData.isFree}
                                onChange={(e) => handleChange("isFree", e.target.checked)}
                                className="w-4 h-4 rounded accent-blue-600"
                            />
                            <label htmlFor="isFree" className="text-sm font-medium text-foreground">
                                Free — visible to all users
                            </label>
                        </div>
                        {!formData.isFree && (
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">Minimum Plan Required</label>
                                <select
                                    className="w-full bg-background border border-border rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                    value={formData.minPlan}
                                    onChange={(e) => handleChange("minPlan", e.target.value)}
                                >
                                    <option value="SEEKER">Seeker (Free)</option>
                                    <option value="PILGRIM">Pilgrim ($7/mo)</option>
                                    <option value="SHEPHERD">Shepherd ($18/mo)</option>
                                </select>
                            </div>
                        )}
                    </div>

                    {/* ── Content ── */}
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1">Content (Markdown supported)</label>
                        <p className="text-xs text-muted-foreground mb-2">
                            Use{" "}
                            <code className="bg-muted px-1 py-0.5 rounded text-xs">{"### Reflection"}</code>,{" "}
                            <code className="bg-muted px-1 py-0.5 rounded text-xs">{"### Prayer"}</code>, and{" "}
                            <code className="bg-muted px-1 py-0.5 rounded text-xs">{"### Companion Hymn"}</code>{" "}
                            as section headers. Scripture quotes go on lines starting with <code className="bg-muted px-1 py-0.5 rounded text-xs">{">"}</code>.
                        </p>
                        <textarea
                            required
                            rows={14}
                            className="w-full bg-background border border-border rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 font-mono text-sm resize-y"
                            value={formData.content}
                            onChange={(e) => handleChange("content", e.target.value)}
                        />
                    </div>

                    <div className="flex justify-end pt-4 border-t border-border mt-8">
                        {(() => {
                            const selectedDate = new Date(formData.date);
                            const today = new Date();
                            today.setHours(0,0,0,0);
                            const isQueued = selectedDate > today;
                            
                            return (
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className={`px-6 py-2.5 text-white font-medium rounded-xl shadow-sm transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2 ${
                                        isQueued 
                                        ? "bg-amber-600 hover:bg-amber-500" 
                                        : "bg-blue-600 hover:bg-blue-500"
                                    }`}
                                >
                                    {isLoading 
                                        ? "Saving..." 
                                        : isQueued ? "⏳ Queue Devotional" : "💾 Publish Automatically"
                                    }
                                </button>
                            );
                        })()}
                    </div>
                </form>
            </div>
        </div>
    );
}
