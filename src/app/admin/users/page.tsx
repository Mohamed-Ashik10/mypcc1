import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import UserManagementClient from "@/components/UserManagementClient";

export const dynamic = "force-dynamic";

export default async function UserManagementPage() {
    const session = await getServerSession(authOptions);

    if (!session || (session.user as any)?.role !== "SUPER_ADMIN") {
        redirect("/admin");
    }

    const users = await prisma.user.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground">👥 User Management</h2>
                <p className="text-muted-foreground mt-1 text-sm">Manage access for Super Admins, Admins, Editors, and Users.</p>
            </div>

            <UserManagementClient initialUsers={users} />
        </div>
    );
}
