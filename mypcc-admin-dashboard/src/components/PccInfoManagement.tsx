"use client";

import { useState } from "react";
import { 
    Plus, Search, Edit2, Trash2, X, Landmark, 
    Calendar, Save, AlertCircle, Info, BookOpen,
    FileText, ArrowRight, ShieldCheck, History
} from "lucide-react";
import { useRouter } from "next/navigation";
import { fetchFromBackend } from "@/lib/api";

interface PccSection {
    id: string;
    section: string;
    content: string;
    updatedAt: Date | string;
}

export default function PccInfoManagement({ initialSections }: { initialSections: PccSection[] }) {
    const router = useRouter();
    const [sections, setSections] = useState<PccSection[]>(initialSections);
    const [search, setSearch] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSection, setEditingSection] = useState<PccSection | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        section: "",
        content: ""
    });

    const filteredSections = sections.filter(s =>
        s.section.toLowerCase().includes(search.toLowerCase()) ||
        s.content.toLowerCase().includes(search.toLowerCase())
    );

    const handleOpenModal = (section?: PccSection) => {
        if (section) {
            setEditingSection(section);
            setFormData({
                section: section.section,
                content: section.content
            });
        } else {
            setEditingSection(null);
            setFormData({
                section: "",
                content: ""
            });
        }
        setError("");
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const path = editingSection ? `/api/admin/pcc-info/${editingSection.id}` : "/api/admin/pcc-info";
            const method = editingSection ? "PATCH" : "POST";

            const result = await fetchFromBackend<PccSection>(path, {
                method,
                body: JSON.stringify({
                    ...formData,
                    id: editingSection ? editingSection.id : `pcc-${Date.now()}`
                }),
            });

            if (editingSection) {
                setSections(sections.map(s => s.id === result.id ? result : s));
            } else {
                setSections([result, ...sections]);
            }

            setIsModalOpen(false);
            router.refresh();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to PERMANENTLY delete this official governance record?")) return;
        try {
            await fetchFromBackend(`/api/admin/pcc-info/${id}`, { method: "DELETE" });
            setSections(sections.filter(s => s.id !== id));
            router.refresh();
        } catch (err) {
            alert("Failed to delete the segment.");
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* ── HEADER & SEARCH ─────────────────────────────────────── */}
            <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
                <div className="relative w-full lg:max-w-2xl">
                    <Search size={22} className="absolute left-6 top-1/2 -translate-y-1/2 text-[#a5a3ae]" />
                    <input
                        type="text"
                        placeholder="Search constitutional segments & policies..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-white border border-[#dbdade]/50 rounded-[2rem] pl-16 pr-6 py-5 text-[15px] font-medium placeholder:text-[#a5a3ae] focus:outline-none focus:border-primary focus:ring-8 focus:ring-primary/5 shadow-sm transition-all outline-none"
                    />
                </div>
                
                <button
                    onClick={() => handleOpenModal()}
                    className="w-full lg:w-auto flex items-center justify-center gap-3 px-10 py-5 bg-primary text-white rounded-[2rem] text-[12px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-primary/30 hover:-translate-y-1 hover:shadow-primary/40 transition-all active:scale-95 group"
                >
                    <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
                    <span>Append Official Segment</span>
                </button>
            </div>

            {/* ── CONTENT GRID ────────────────────────────────────────── */}
            {filteredSections.length === 0 ? (
                <div className="bg-white rounded-[3rem] border border-[#dbdade]/50 shadow-sm p-40 text-center animate-in zoom-in duration-700">
                    <div className="w-24 h-24 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-8 border border-primary/10">
                        <BookOpen size={40} className="text-primary opacity-20" />
                    </div>
                    <h4 className="text-[20px] font-black text-[#5d596c] uppercase tracking-tighter mb-2">Registry Offline</h4>
                    <p className="text-[#a5a3ae] text-xs font-bold uppercase tracking-[0.2em]">No official segments found matching your query</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-8 pb-20">
                    {filteredSections.map((s) => (
                        <div key={s.id} className="bg-white rounded-[2.5rem] border border-[#dbdade]/50 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all group overflow-hidden relative">
                             {/* Side Accent */}
                             <div className="absolute left-0 top-0 bottom-0 w-2 bg-primary transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
                             
                             <div className="p-10 lg:p-12 flex flex-col lg:flex-row items-start gap-10 relative z-10">
                                {/* Icon Header */}
                                <div className="w-20 h-20 bg-primary/5 rounded-[2rem] flex items-center justify-center text-primary border border-primary/10 flex-shrink-0 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                                    <FileText size={32} />
                                </div>

                                <div className="flex-1 space-y-6">
                                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                        <div className="space-y-1">
                                            <h3 className="text-[24px] font-black text-[#5d596c] tracking-tight uppercase group-hover:text-primary transition-colors">{s.section}</h3>
                                            <div className="flex items-center gap-3 text-[10px] font-black text-[#a5a3ae] uppercase tracking-widest">
                                                <History size={12} className="text-primary" />
                                                <span>Constitutional Record • Modified {new Date(s.updatedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                                            <button 
                                                onClick={() => handleOpenModal(s)}
                                                className="p-4 bg-[#f8f7fa] text-[#5d596c] rounded-2xl hover:bg-primary hover:text-white transition-all shadow-sm"
                                                title="Edit Segment"
                                            >
                                                <Edit2 size={18} />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(s.id)}
                                                className="p-4 bg-[#f8f7fa] text-red-400 rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                                title="Revoke Segment"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                    
                                    <div className="relative group">
                                        <div className="h-px bg-gradient-to-r from-primary/20 to-transparent mb-6" />
                                        <p className="text-[#5d596c]/90 text-[16px] leading-[1.8] font-medium whitespace-pre-line max-w-6xl">
                                            {s.content}
                                        </p>
                                    </div>

                                    <div className="pt-8 flex items-center gap-4">
                                        <div className="flex items-center gap-2 px-4 py-2 bg-primary/5 rounded-full border border-primary/10">
                                            <ShieldCheck size={14} className="text-primary" />
                                            <span className="text-[10px] font-black text-primary uppercase tracking-widest">Certified Content</span>
                                        </div>
                                    </div>
                                </div>
                             </div>
                        </div>
                    ))}
                </div>
            )}

            {/* ── MANAGEMENT MODAL ────────────────────────────────────── */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/40 backdrop-blur-[4px] animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-3xl rounded-[3rem] p-12 lg:p-16 shadow-2xl border border-[#dbdade]/50 relative animate-in zoom-in-95 duration-200">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute right-10 top-10 p-4 hover:bg-[#f8f7fa] rounded-full text-[#a5a3ae] transition-colors"
                        >
                            <X size={28} />
                        </button>

                        <div className="flex items-center gap-6 mb-12">
                            <div className="w-20 h-20 bg-primary/10 rounded-[2rem] flex items-center justify-center text-primary shadow-inner">
                                <Landmark size={36} />
                            </div>
                            <div>
                                <h3 className="text-[32px] font-black tracking-tighter uppercase text-[#5d596c] leading-none mb-2">
                                    {editingSection ? "Modify Record" : "Append Segment"}
                                </h3>
                                <p className="text-[12px] font-black text-[#a5a3ae] uppercase tracking-[0.3em]">Governance Information Vault</p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-[11px] font-black text-[#a5a3ae] uppercase tracking-[0.2em] mb-3 ml-1">Section Categorization (Title)</label>
                                    <div className="relative">
                                        <ArrowRight size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-primary opacity-30 pointer-events-none" />
                                        <input
                                            required
                                            type="text"
                                            value={formData.section}
                                            onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                                            className="w-full pl-16 pr-8 py-5 bg-[#f8f7fa] border border-[#dbdade]/60 rounded-[2rem] focus:outline-none focus:border-primary text-lg font-black text-[#5d596c] transition-all"
                                            placeholder="e.g. Presbyterial Hierarchy"
                                        />
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="block text-[11px] font-black text-[#a5a3ae] uppercase tracking-[0.2em] mb-3 ml-1">Constitutional Provisions (Content)</label>
                                    <textarea
                                        required
                                        rows={10}
                                        value={formData.content}
                                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                        className="w-full p-8 bg-[#f8f7fa] border border-[#dbdade]/60 rounded-[2.5rem] focus:outline-none focus:border-primary text-[15px] font-medium text-[#5d596c] leading-[1.8] transition-all resize-none"
                                        placeholder="Enter the official content, policies, or structural details here..."
                                    />
                                </div>
                            </div>

                            {error && (
                                <div className="p-5 bg-red-50 border border-red-100 rounded-3xl flex items-center gap-4 text-red-500 animate-pulse">
                                    <AlertCircle size={20} />
                                    <p className="text-[12px] font-black uppercase tracking-widest">{error}</p>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-6 bg-primary text-white text-[13px] font-black uppercase tracking-[0.4em] rounded-[2.5rem] shadow-2xl shadow-primary/30 hover:-translate-y-1 hover:shadow-primary/50 transition-all active:scale-95 disabled:opacity-50"
                            >
                                {isLoading ? "Synchronizing Records..." : editingSection ? "Seal Constitutional Change" : "Authorize New Provision"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
