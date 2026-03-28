import { fetchFromBackend } from "@/lib/api";
import prisma from "@/lib/prisma";
import { User, Mail, Clock, ShieldCheck, CheckCircle, MessageSquare, AlertCircle } from "lucide-react";
import FeedbackStatusButton from "@/components/FeedbackStatusButton";

export const dynamic = "force-dynamic";

export default async function FeedbackPage() {
    let requests: any[] = [];
    
    try {
        // Try getting from Prisma first as it's the source for this specific Next.js API
        requests = await (prisma as any).supportRequest.findMany({
            include: { User: true },
            orderBy: { createdAt: 'desc' }
        });
    } catch (error) {
        console.error("Failed to fetch feedback from Prisma", error);
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <MessageSquare className="w-6 h-6 text-indigo-500" />
                        Priority Support & Feedback
                    </h1>
                    <p className="text-sm text-gray-500">Manage incoming queries from Shepherd partners and community members.</p>
                </div>
                <div className="flex gap-4">
                    <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center">
                            <ShieldCheck className="w-5 h-5 text-amber-600" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 font-medium">Priority Open</p>
                            <p className="text-lg font-bold text-gray-800">{requests.filter(r => r.isPriority && r.status === 'OPEN').length}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50/50 border-bottom border-gray-100">
                            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">User / Contact</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Message</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Submitted</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {requests.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-gray-400 italic">
                                    No support requests found.
                                </td>
                            </tr>
                        ) : (
                            requests.map((req) => (
                                <tr key={req.id} className={`hover:bg-gray-50/50 transition-colors ${req.isPriority ? 'bg-amber-50/20' : ''}`}>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${req.isPriority ? 'bg-amber-500' : 'bg-slate-400'}`}>
                                                {(req.name || 'A')[0].toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-gray-800 flex items-center gap-1">
                                                    {req.name || "Anonymous"}
                                                    {req.isPriority && <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 rounded uppercase">Shepherd</span>}
                                                </p>
                                                <p className="text-xs text-gray-400 flex items-center gap-1">
                                                    <Mail className="w-3 h-3" /> {req.email}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="max-w-md">
                                            <p className="text-xs font-semibold text-indigo-600 mb-1">{req.subject}</p>
                                            <p className="text-sm text-gray-600 line-clamp-2">{req.message}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                                            req.status === 'OPEN' ? 'bg-red-100 text-red-600' : 
                                            req.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-600' : 
                                            'bg-green-100 text-green-600'
                                        }`}>
                                            {req.status.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-xs text-gray-400">
                                        <div className="flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {new Date(req.createdAt).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <FeedbackStatusButton requestId={req.id} currentStatus={req.status} />
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
