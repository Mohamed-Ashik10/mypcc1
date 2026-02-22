"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DiaryDeleteButton({ id }: { id: string }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        if (!confirm("Delete this diary entry?")) return;
        setLoading(true);
        try {
            await fetch(`/api/diary/${id}`, { method: "DELETE" });
            router.refresh();
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleDelete}
            disabled={loading}
            className="text-xs font-medium text-red-500 hover:text-red-700 transition disabled:opacity-50"
        >
            {loading ? "…" : "Delete"}
        </button>
    );
}
