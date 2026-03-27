"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { fetchFromBackend } from "@/lib/api";

export default function DiaryDeleteButton({ id }: { id: string }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        if (!confirm("Delete this diary entry?")) return;
        setLoading(true);
        try {
            await fetchFromBackend(`/api/admin/diary/${id}`, { method: "DELETE" });
            router.refresh();
        } catch (error) {
            console.error("Delete failed:", error);
            alert("Delete failed. See console for details.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleDelete}
            disabled={loading}
            className="text-xs font-medium text-destructive hover:text-destructive/80 transition-colors disabled:opacity-50"
        >
            {loading ? "…" : "Delete"}
        </button>
    );
}
