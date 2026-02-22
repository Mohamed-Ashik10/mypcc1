"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function HymnDeleteButton({ id }: { id: string }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        if (!confirm("Delete this hymn permanently?")) return;
        setLoading(true);
        try {
            await fetch(`/api/hymns/${id}`, { method: "DELETE" });
            router.refresh();
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleDelete}
            disabled={loading}
            className="text-xs font-medium text-destructive hover:text-destructive/80 disabled:opacity-50 transition-colors"
        >
            {loading ? "…" : "Delete"}
        </button>
    );
}
