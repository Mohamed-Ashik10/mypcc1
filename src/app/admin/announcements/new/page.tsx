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
        "block w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition";

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">📢 New Announcement</h2>
            <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-2xl shadow-md p-8 max-w-2xl">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title <span className="text-red-500">*</span></label>
                    <input
                        type="text" name="title" required value={form.title}
                        onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                        placeholder="e.g. Annual Convention Notice" className={inputCls}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Content <span className="text-red-500">*</span></label>
                    <textarea
                        name="content" required rows={5} value={form.content}
                        onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))}
                        placeholder="Write the announcement here…" className={`${inputCls} resize-y`}
                    />
                </div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer">
                    <input type="checkbox" checked={form.isActive} onChange={(e) => setForm((p) => ({ ...p, isActive: e.target.checked }))} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    Make active immediately
                </label>

                {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>}

                <div className="flex gap-3 pt-2">
                    <button type="submit" disabled={saving} className="px-6 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-500 disabled:opacity-60 transition">
                        {saving ? "Posting…" : "Post Announcement"}
                    </button>
                    <button type="button" onClick={() => router.back()} className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-200 transition">
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}
