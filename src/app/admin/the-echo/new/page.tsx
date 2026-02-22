"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewEchoIssuePage() {
    const router = useRouter();
    const [form, setForm] = useState({ title: "", issueMonth: "", pdfUrl: "", coverUrl: "", isFree: true });
    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
        try {
            const res = await fetch("/api/the-echo", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed");
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
        "block w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition";

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">📤 Upload Echo Issue</h2>
            <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-2xl shadow-md p-8 max-w-2xl">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title <span className="text-red-500">*</span></label>
                    <input type="text" name="title" required value={form.title} onChange={handleChange} placeholder="e.g. The Echo – March 2026" className={inputCls} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Issue Month <span className="text-red-500">*</span></label>
                        <input type="month" name="issueMonth" required value={form.issueMonth} onChange={handleChange} className={inputCls} />
                    </div>
                    <div className="flex items-end">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer">
                            <input type="checkbox" name="isFree" checked={form.isFree} onChange={handleChange} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                            Free Access
                        </label>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">PDF URL <span className="text-red-500">*</span></label>
                    <input type="url" name="pdfUrl" required value={form.pdfUrl} onChange={handleChange} placeholder="https://storage.example.com/echo-march-2026.pdf" className={inputCls} />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image URL</label>
                    <input type="url" name="coverUrl" value={form.coverUrl} onChange={handleChange} placeholder="https://storage.example.com/cover.jpg" className={inputCls} />
                </div>

                {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>}

                <div className="flex gap-3 pt-2">
                    <button type="submit" disabled={saving} className="px-6 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-500 disabled:opacity-60 transition">
                        {saving ? "Uploading…" : "Publish Issue"}
                    </button>
                    <button type="button" onClick={() => router.back()} className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-200 transition">
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}
