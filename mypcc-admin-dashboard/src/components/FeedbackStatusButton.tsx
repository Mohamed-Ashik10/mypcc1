"use client";

import { useState } from "react";
import { CheckCircle, Clock, Trash2, MoreHorizontal } from "lucide-react";

export default function FeedbackStatusButton({ requestId, currentStatus }: { requestId: string, currentStatus: string }) {
    const [status, setStatus] = useState(currentStatus);
    const [isUpdating, setIsUpdating] = useState(false);

    async function updateStatus(newStatus: string) {
        setIsUpdating(true);
        try {
            const res = await fetch(`/api/feedback/${requestId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
            if (res.ok) {
                setStatus(newStatus);
            } else {
                alert("Failed to update status");
            }
        } catch (e) {
            alert("Error updating status");
        } finally {
            setIsUpdating(false);
        }
    }

    return (
        <div className="flex items-center gap-2 justify-end">
            {status !== 'RESOLVED' ? (
                <button
                    onClick={() => updateStatus(status === 'OPEN' ? 'IN_PROGRESS' : 'RESOLVED')}
                    disabled={isUpdating}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-50"
                >
                    {status === 'OPEN' ? <Clock className="w-3 h-3" /> : <CheckCircle className="w-3 h-3" />}
                    {status === 'OPEN' ? "Handle" : "Resolve"}
                </button>
            ) : (
                <span className="text-xs font-bold text-green-600 flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" /> Fixed
                </span>
            )}
        </div>
    );
}
