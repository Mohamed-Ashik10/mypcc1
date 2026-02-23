import EchoForm from "@/components/EchoForm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function NewEchoIssuePage() {
    const session = await getServerSession(authOptions);
    const userRole = (session?.user as any)?.role;
    if (!["ADMIN", "SUPER_ADMIN", "STAFF", "EDITOR"].includes(userRole)) {
        redirect("/admin");
    }
    return (
        <div>
            <h2 className="text-2xl font-bold text-foreground mb-6">📤 Upload Echo Issue</h2>
            <EchoForm mode="create" />
        </div>
    );
}
