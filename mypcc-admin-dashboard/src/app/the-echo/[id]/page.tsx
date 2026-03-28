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
                <div className="mb-16">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="h-[1px] w-8 bg-[#b8935a]"></span>
                        <span className="text-[11px] font-black uppercase tracking-[0.3em] text-[#b8935a]">
                            {issue.category || 'PCC NEWS'}
                        </span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-serif font-black text-[#1a1a1a] leading-[1.1] mb-10 tracking-tight">
                        {issue.title}
                    </h1>
                    
                    <div className="flex items-center gap-5 py-10 border-y border-[#e8e1d5]/60">
                        <div className="w-14 h-14 rounded-full bg-[#1a1a1a] flex items-center justify-center text-[#b8935a] font-black text-xl border-2 border-[#b8935a]/20">
                            {(issue.author?.[0] || 'A').toUpperCase()}
                        </div>
                        <div>
                            <p className="text-base font-black text-[#1a1a1a] tracking-tight">{issue.author || 'PCC Admin'}</p>
                            <p className="text-xs font-bold text-[#b8935a]/60 uppercase tracking-widest mt-1">{dateStr}</p>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-3 ml-auto">
                            <button 
                                onClick={(e) => {
                                    navigator.clipboard.writeText(window.location.href);
                                    const btn = e.currentTarget;
                                    const original = btn.innerHTML;
                                    btn.style.background = "#b8935a";
                                    btn.style.color = "white";
                                    btn.innerHTML = "<span>COPIED</span><span>✓</span>";
                                    setTimeout(() => {
                                        btn.style.background = "";
                                        btn.style.color = "";
                                        btn.innerHTML = original;
                                    }, 2000);
                                }}
                                className="flex items-center gap-2 px-6 py-3 rounded-full border-2 border-[#e8e1d5] text-[#b8935a] font-black text-[11px] bg-white hover:border-[#b8935a] transition-all shadow-sm uppercase tracking-widest"
                            >
                                <span>Copy Link</span>
                                <span className="text-sm">🔗</span>
                            </button>
                        </div>
                    </div>
                </div>

                {issue.coverUrl && (
                    <div className="w-full aspect-[21/9] rounded-[40px] overflow-hidden mb-20 shadow-2xl shadow-[#b8935a]/10 ring-1 ring-[#b8935a]/5">
                        <img src={issue.coverUrl} alt={issue.title} className="w-full h-full object-cover" />
                    </div>
                )}

                <article 
                    className="text-[#2c3e50] leading-[1.8] font-serif text-2xl md:text-3xl selection:bg-[#b8935a]/10 first-letter:text-7xl first-letter:font-black first-letter:text-[#b8935a] first-letter:mr-4 first-letter:float-left first-letter:font-serif"
                    style={{ whiteSpace: 'pre-wrap' }}
                >
                    {issue.fullText || "The full text for this issue is not yet available in the digital library."}
                </article>

                <div className="mt-32 pt-16 border-t-4 border-double border-[#e8e1d5] text-center">
                    <div className="opacity-10 mb-8 grayscale">
                         <span className="text-4xl">✝</span>
                    </div>
                    <p className="text-xs text-[#b8935a] font-black uppercase tracking-[0.5em] mb-12">The Echo Shared Archive &copy; 2026</p>
                    <Link href="/" className="inline-flex items-center gap-3 px-12 py-5 bg-[#b8935a] text-white rounded-2xl font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition shadow-2xl shadow-[#b8935a]/40">
                        📖 Return To Library
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
