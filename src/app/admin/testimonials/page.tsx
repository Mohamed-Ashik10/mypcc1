import prisma from "@/lib/prisma";
import Link from "next/link";
import TestimonialDeleteButton from "@/components/TestimonialDeleteButton";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function TestimonialsAdminPage() {
  const session = await getServerSession(authOptions);
  const userRole = (session?.user as any)?.role || "NORMAL_USER";
  
  // Only Admin Staff or Content Editors can manage these
  if (!["SUPER_ADMIN", "ADMIN_STAFF", "CONTENT_EDITOR"].includes(userRole)) {
    redirect("/admin/dashboard");
  }

  const testimonials = await prisma.testimonial.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">💬 Community Voices</h2>
          <p className="text-muted-foreground mt-1 text-sm">Manage the testimonials shown on the home page.</p>
        </div>
        <Link
          href="/admin/testimonials/new"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl shadow hover:bg-blue-500 transition-all active:scale-95 whitespace-nowrap"
        >
          ➕ Add Testimonial
        </Link>
      </div>

      <div className="bg-card rounded-2xl shadow-sm border overflow-hidden">
        {testimonials.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-muted-foreground">No testimonials found. Add the first one!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[600px]">
              <thead className="bg-muted/50 text-xs text-muted-foreground uppercase tracking-wide border-b">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold">Author</th>
                  <th className="px-6 py-4 text-left font-semibold">Role</th>
                  <th className="px-6 py-4 text-left font-semibold">Content</th>
                  <th className="px-6 py-4 text-center font-semibold">Visibility</th>
                  <th className="px-6 py-4 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {testimonials.map((t) => (
                  <tr key={t.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 font-medium text-foreground whitespace-nowrap">
                      {t.authorName}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground whitespace-nowrap">
                      {t.authorRole || "—"}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground max-w-xs truncate">
                      {t.content}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex px-2 py-1 rounded text-xs font-medium ${t.isActive ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"}`}>
                        {t.isActive ? "Active" : "Hidden"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <Link
                          href={`/admin/testimonials/${t.id}/edit`}
                          className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                        >
                          Edit
                        </Link>
                        <TestimonialDeleteButton id={t.id} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
