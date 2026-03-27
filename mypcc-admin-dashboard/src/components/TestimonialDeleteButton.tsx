"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { fetchFromBackend } from "@/lib/api";

export default function TestimonialDeleteButton({ id }: { id: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this testimonial? This action cannot be undone.")) {
      return;
    }

    setLoading(true);
    try {
      await fetchFromBackend(`/api/admin/testimonials/${id}`, {
        method: "DELETE",
      });

      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Failed to delete testimonial");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="text-xs font-medium text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 disabled:opacity-50 transition-colors"
    >
      {loading ? "Deleting..." : "Delete"}
    </button>
  );
}
