"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { fetchFromBackend } from "@/lib/api";

export default function DevotionalDeleteButton({ id }: { id: string }) {
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this devotional? This action cannot be undone.")) return;

        setIsDeleting(true);
        try {
            await fetchFromBackend(`/api/admin/content/devotionals/${id}`, {
                method: "DELETE",
            });
            router.refresh();
        } catch (error) {
            console.error(error);
            alert("Error deleting devotional");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-xs font-medium text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition-colors disabled:opacity-50"
        >
            {isDeleting ? "Deleting..." : "Delete"}
        </button>
    );
}
