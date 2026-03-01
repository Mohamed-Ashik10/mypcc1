"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewDevotionalPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        title: "",
        date: new Date().toISOString().slice(0, 10),
        author: "",
        content: ""
    });

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
        <div className="max-w-2xl mx-auto space-y-8">
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
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1">Title</label>
                        <input
                            type="text"
                            required
                            placeholder="e.g. Strength in Weakness"
                            className="w-full bg-background border border-border rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">Date</label>
                            <input
                                type="date"
                                required
                                className="w-full bg-background border border-border rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">Author (Optional)</label>
                            <input
                                type="text"
                                placeholder="e.g. Rev. John Doe"
                                className="w-full bg-background border border-border rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                value={formData.author}
                                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1">Content (Markdown supported)</label>
                        <p className="text-xs text-muted-foreground mb-2">Use headers starting with "#### Reflection", "#### Prayer", or "#### Companion Hymn" to format the output.</p>
                        <textarea
                            required
                            rows={10}
                            className="w-full bg-background border border-border rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 font-mono text-sm resize-y"
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        />
                    </div>

                    <div className="flex justify-end pt-4 border-t border-border mt-8">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl shadow-sm transition-all active:scale-95 disabled:opacity-50"
                        >
                            {isLoading ? "Saving..." : "Save Devotional"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
