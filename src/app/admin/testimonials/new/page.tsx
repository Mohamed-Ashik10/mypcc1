import TestimonialForm from "@/components/TestimonialForm";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function NewTestimonialPage() {
  const session = await getServerSession(authOptions);
  const userRole = (session?.user as any)?.role || "NORMAL_USER";
  
  if (!["SUPER_ADMIN", "ADMIN_STAFF", "CONTENT_EDITOR"].includes(userRole)) {
    redirect("/admin/dashboard");
  }

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="mb-8">
        <Link
          href="/admin/testimonials"
          className="text-sm text-blue-600 dark:text-blue-400 font-medium hover:underline inline-flex items-center gap-1 mb-2"
        >
          ← Back to Community Voices
        </Link>
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Add Testimonial</h2>
        <p className="text-muted-foreground mt-1 text-sm">Add a new voice from the congregation.</p>
      </div>

      <TestimonialForm />
    </div>
  );
}
