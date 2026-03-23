"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import EchoAudioPlayer from "@/components/EchoAudioPlayer";

interface EchoIssue {
    id: string;
    title: string;
    category: string;
    author: string;
    issueMonth: string;
    fullText: string;
    coverUrl?: string;
}

export default function EchoStandalonePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [issue, setIssue] = useState<EchoIssue | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`/api/the-echo/${id}`)
            .then(res => res.json())
            .then(data => {
                if (data.id) setIssue(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [id]);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-[#faf9f6]">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-[#b8935a]/20 border-t-[#b8935a] rounded-full animate-spin"></div>
                <p className="text-[#b8935a] font-bold animate-pulse">Consulting the Echo Library...</p>
            </div>
        </div>
    );

    if (!issue) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#faf9f6] p-6 text-center">
            <h1 className="text-6xl mb-6">🏜️</h1>
            <h2 className="text-2xl font-bold text-gray-800">Newsletter Not Found</h2>
            <p className="text-gray-500 mt-2 max-w-md">This issue might have been moved or archived.</p>
            <Link href="/" className="mt-8 px-6 py-3 bg-[#b8935a] text-white rounded-xl font-bold hover:shadow-lg transition-all">
                Return to Library
            </Link>
        </div>
    );

    const dateStr = issue.issueMonth ? new Date(issue.issueMonth).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Unknown Date';

    return (
        <div className="min-h-screen bg-[#faf9f6] selection:bg-[#b8935a]/20 pb-20">
            {/* Header / Nav */}
            <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-[#e8e1d5] z-50 px-6 py-4 flex justify-between items-center transition-all">
               <Link href="/" className="text-2xl font-serif font-black tracking-tighter text-[#1a1a1a]">
                    THE <span className="text-[#b8935a]">ECHO</span>
               </Link>
               <Link href="/" className="text-sm font-bold text-[#b8935a] hover:underline">
                    &larr; Back to Library
               </Link>
            </nav>

            {/* Audio Narrator Bar Fixed */}
            {issue.fullText && (
                <div className="fixed top-[73px] w-full z-40">
                   <div className="max-w-4xl mx-auto px-6">
                        <EchoAudioPlayer 
                            title={issue.title}
                            fullText={issue.fullText}
                        />
                   </div>
                </div>
            )}

            {/* Content Area */}
            <main className="max-w-4xl mx-auto px-6 pt-32">
                <div className="mb-12">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#b8935a] mb-4 block">
                        {issue.category || 'NEWS'}
                    </span>
                    <h1 className="text-4xl md:text-6xl font-serif font-bold text-[#1a1a1a] leading-tight mb-8 tracking-tight">
                        {issue.title}
                    </h1>
                    
                    <div className="flex items-center gap-4 py-8 border-y border-[#e8e1d5]/50">
                        <div className="w-12 h-12 rounded-full bg-[#b8935a] flex items-center justify-center text-white font-bold text-lg">
                            {(issue.author?.[0] || 'A').toUpperCase()}
                        </div>
                        <div>
                            <p className="text-sm font-bold text-[#1a1a1a] leading-tight">{issue.author || 'Admin'}</p>
                            <p className="text-xs text-[#6b7280]">{dateStr}</p>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-2 ml-auto">
                            <button 
                                onClick={() => {
                                    const waUrl = `https://wa.me/?text=${encodeURIComponent('Read this issue of The Echo: "' + issue.title + '"\n\n' + window.location.href)}`;
                                    window.open(waUrl, '_blank');
                                }}
                                className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#25D366] text-white font-bold text-[10px] hover:opacity-90 transition shadow-sm uppercase tracking-wider"
                            >
                                <span>WhatsApp</span>
                                <span>📲</span>
                            </button>
                            <button 
                                onClick={(e) => {
                                    navigator.clipboard.writeText(window.location.href);
                                    const btn = e.currentTarget;
                                    const original = btn.innerHTML;
                                    btn.innerHTML = "<span>Copied!</span><span>✅</span>";
                                    setTimeout(() => btn.innerHTML = original, 2000);
                                }}
                                className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#e8e1d5] text-[#b8935a] font-bold text-[10px] bg-white hover:bg-gray-50 transition shadow-sm uppercase tracking-wider"
                                title="Copy Link"
                            >
                                <span>Copy Link</span>
                                <span>🔗</span>
                            </button>
                        </div>
                    </div>
                </div>

                {issue.coverUrl && (
                    <div className="w-full aspect-[16/9] rounded-3xl overflow-hidden mb-12 shadow-2xl shadow-[#b8935a]/10">
                        <img src={issue.coverUrl} alt={issue.title} className="w-full h-full object-cover" />
                    </div>
                )}

                <article 
                    className="text-[#2c3e50] leading-relaxed font-serif text-xl"
                    style={{ whiteSpace: 'pre-wrap' }}
                >
                    {issue.fullText || "The full text for this issue is not yet available in the digital library."}
                </article>

                <div className="mt-20 pt-12 border-t border-[#e8e1d5] text-center">
                    <p className="text-sm text-[#6b7280] italic mb-8">Reading from The Echo Digital Library &copy; 2026</p>
                    <Link href="/" className="inline-flex items-center gap-2 px-10 py-4 bg-[#1a1a1a] text-white rounded-2xl font-bold hover:scale-105 active:scale-95 transition shadow-xl">
                        📖 Explore More Issues
                    </Link>
                </div>
            </main>

            {/* Global Type styles */}
            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Outfit:wght@400;700;900&display=swap');
                
                body {
                    font-family: 'Outfit', sans-serif;
                }
                h1, article {
                    font-family: 'Cormorant Garamond', serif;
                }
            `}</style>
        </div>
    );
}
