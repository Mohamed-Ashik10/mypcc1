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
        "block w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition";

    return (
        <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-2xl shadow-md p-8 max-w-2xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Hymn Number <span className="text-red-500">*</span>
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Title <span className="text-red-500">*</span>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Lyrics <span className="text-red-500">*</span>
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
                <p className="text-xs text-gray-400 mt-1">Separate verses with a blank line.</p>
            </div>

            {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>}

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
                    className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-200 transition"
                >
                    Cancel
                </button>
            </div>
        </form>
    );
}
