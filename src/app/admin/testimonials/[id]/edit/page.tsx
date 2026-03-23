import prisma from "@/lib/prisma";
import TestimonialForm from "@/components/TestimonialForm";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function EditTestimonialPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  const userRole = (session?.user as any)?.role || "NORMAL_USER";
  
  if (!["SUPER_ADMIN", "ADMIN_STAFF", "CONTENT_EDITOR"].includes(userRole)) {
    redirect("/admin/dashboard");
  }

  const resolvedParams = await params;
  const testimonial = await prisma.testimonial.findUnique({
    where: { id: resolvedParams.id },
  });

  if (!testimonial) {
    return (
      <div className="p-12 text-center text-foreground font-medium text-lg min-h-[50vh] flex flex-col items-center justify-center">
        Testimonial not found.
        <Link href="/admin/testimonials" className="text-blue-600 mt-4 underline text-sm">Return to Admin</Link>
      </div>
    );
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
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Edit Testimonial</h2>
      </div>

      <TestimonialForm initialData={testimonial} />
    </div>
  );
}
