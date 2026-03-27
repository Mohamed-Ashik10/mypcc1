"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { fetchFromBackend } from "@/lib/api";

interface TestimonialFormProps {
  initialData?: {
    id: string;
    content: string;
    authorName: string;
    authorRole?: string | null;
    isActive: boolean;
  };
}

export default function TestimonialForm({ initialData }: TestimonialFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const isEditing = !!initialData;

  const [formData, setFormData] = useState({
    authorName: initialData?.authorName || "",
    authorRole: initialData?.authorRole || "",
    content: initialData?.content || "",
    isActive: initialData?.isActive ?? true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value;
    setFormData((prev) => ({ ...prev, [e.target.name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const url = isEditing ? `/api/admin/testimonials/${initialData.id}` : "/api/admin/testimonials";
      const method = isEditing ? "PATCH" : "POST";

      await fetchFromBackend(url, {
        method,
        body: JSON.stringify({
          ...formData,
          id: isEditing ? initialData.id : `testimonial-${Date.now()}`
        }),
      });

      router.push("/admin/testimonials");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-card p-6 md:p-8 rounded-2xl shadow-sm border">
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm border border-red-200">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5 cursor-pointer">Author Name</label>
        <input
          name="authorName"
          required
          value={formData.authorName}
          onChange={handleChange}
          className="w-full p-3 border rounded-xl bg-background text-foreground text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
          placeholder="e.g. Sarah Jenkins"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5 cursor-pointer">Author Role / Detail (Optional)</label>
        <input
          name="authorRole"
          value={formData.authorRole}
          onChange={handleChange}
          className="w-full p-3 border rounded-xl bg-background text-foreground text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
          placeholder="e.g. Worship Team Member, Congregation Member"
        />
        <p className="text-xs text-muted-foreground mt-1.5 ml-1">Optional subtitle to appear under the author's name.</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5 cursor-pointer">Testimonial Content</label>
        <textarea
          name="content"
          required
          rows={6}
          value={formData.content}
          onChange={handleChange}
          className="w-full p-3 border rounded-xl bg-background text-foreground text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none resize-y"
          placeholder="Before this platform, I always struggled to find the right hymn..."
        />
        <p className="text-xs text-muted-foreground mt-1.5 ml-1">Write the actual testimony of the user.</p>
      </div>

      <div className="flex items-center gap-3 bg-muted/30 p-4 rounded-xl border border-input">
        <input
          type="checkbox"
          id="isActive"
          name="isActive"
          checked={formData.isActive}
          onChange={handleChange}
          className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500 flex-shrink-0"
        />
        <div>
          <label htmlFor="isActive" className="font-medium text-foreground text-sm cursor-pointer select-none">Show on Home Page</label>
          <p className="text-xs text-muted-foreground">If checked, this testimonial will appear in the Community Voices section.</p>
        </div>
      </div>

      <div className="pt-4 flex justify-end gap-3 border-t">
        <button
          type="button"
          onClick={() => router.push("/admin/testimonials")}
          className="px-5 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl transition-all"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl shadow-sm hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-all active:scale-[0.98]"
        >
          {loading ? "Saving..." : isEditing ? "Save Changes" : "Create Testimonial"}
        </button>
      </div>
    </form>
  );
}
