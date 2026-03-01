import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { formatDistanceToNow } from "date-fns";

export const dynamic = "force-dynamic";

export default async function UserLogsPage() {
    // 1. Authenticate and authorize User
    const session = await getServerSession(authOptions);

    if (!session || (session.user as any)?.role !== "SUPER_ADMIN") {
        redirect("/admin");
    }

    // 2. Fetch users with their sessions
    const users = await prisma.user.findMany({
        include: {
            sessions: {
                where: {
                    expires: {
                        gt: new Date() // Only get currently active sessions
                    }
                }
            }
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">🔐 User Logs</h2>
                    <p className="text-muted-foreground mt-1 text-sm font-medium">Detailed view of user accounts, encrypted passwords, and active sessions. Restrictly for <span className="text-red-500 font-bold">SUPER_ADMIN</span> access only.</p>
                </div>
                <div className="bg-red-500/10 text-red-500 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border border-red-500/20">
                    High Security Area
                </div>
            </div>

            <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="bg-muted/50 border-b border-border/50 text-xs uppercase tracking-widest text-muted-foreground font-black">
                                <th className="p-4 sm:p-5 pl-6">User</th>
                                <th className="p-4 sm:p-5">Password Hash</th>
                                <th className="p-4 sm:p-5">Joined</th>
                                <th className="p-4 sm:p-5">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                            {users.map((user) => {
                                const isActiveSession = user.sessions.length > 0;
                                const sessionExpiry = isActiveSession ? user.sessions[0].expires : null;

                                return (
                                    <tr key={user.id} className="hover:bg-muted/20 transition-colors group">
                                        {/* User Details */}
                                        <td className="p-4 sm:p-5 pl-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow-inner bg-gradient-to-br from-blue-600 to-indigo-800">
                                                    {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-foreground group-hover:text-blue-500 transition-colors">{user.name || "Unknown User"}</p>
                                                    <p className="text-xs text-muted-foreground">{user.email}</p>
                                                    <div className="mt-1 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-muted text-muted-foreground">
                                                        {user.role}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Password Hash (Truncated) */}
                                        <td className="p-4 sm:p-5 align-top pt-6">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-mono text-muted-foreground truncate max-w-[150px] inline-block bg-muted/50 px-2 py-1 rounded-md border border-border/50" title={user.password || "No Password / OAuth"}>
                                                    {user.password ? `${user.password.substring(0, 15)}...` : <span className="text-blue-500 font-sans text-xs italic">OAuth Login</span>}
                                                </span>
                                            </div>
                                        </td>

                                        {/* Joined Date */}
                                        <td className="p-4 sm:p-5 align-top pt-6">
                                            <div className="text-sm">
                                                <p className="font-medium text-foreground">{formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}</p>
                                                <p className="text-xs text-muted-foreground mt-0.5">{new Date(user.createdAt).toLocaleDateString()}</p>
                                            </div>
                                        </td>

                                        {/* Session Status */}
                                        <td className="p-4 sm:p-5 align-top pt-6">
                                            {isActiveSession ? (
                                                <div className="flex flex-col gap-1">
                                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 w-fit">
                                                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                                        Online
                                                    </div>
                                                    {sessionExpiry && (
                                                        <p className="text-[10px] text-muted-foreground mt-1">
                                                            Expires: {formatDistanceToNow(new Date(sessionExpiry), { addSuffix: true })}
                                                        </p>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest bg-muted text-muted-foreground border border-border/50 w-fit">
                                                    <span className="w-2 h-2 rounded-full bg-muted-foreground"></span>
                                                    Offline
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}

                            {users.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="p-12 text-center text-muted-foreground italic">
                                        No users found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            {/* Disclaimer */}
            <div className="bg-orange-500/10 border border-orange-500/20 rounded-2xl p-4 sm:p-6 flex gap-4 items-start">
                <span className="text-2xl mt-1">⚠️</span>
                <div>
                    <h4 className="text-sm font-black text-orange-500 uppercase tracking-widest">Security Notice</h4>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                        Passwords are encrypted using bcrypt hashing algorithms. It is impossible to decrypt these hashes back to plain-text passwords. This page is purely for administrative auditing of session activity and account creation timestamps.
                    </p>
                </div>
            </div>
        </div>
    );
}
