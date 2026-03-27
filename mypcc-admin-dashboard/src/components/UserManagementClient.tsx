"use client";

import { useState } from "react";
import { 
    Plus, Search, Edit2, Trash2, X, Shield, Mail, 
    User as UserIcon, Lock, Users, ShieldCheck, 
    UserCheck, UserCog, UserPlus, Fingerprint,
    ChevronRight, LayoutGrid, ListFilter, Activity
} from "lucide-react";

interface User {
    id: string;
    name: string | null;
    email: string | null;
    role: string;
    createdAt: Date | string;
}

type RoleFilter = "ALL" | "SUPER_ADMIN" | "ADMIN_STAFF" | "CONTENT_EDITOR" | "CHURCH_USER" | "NORMAL_USER";

export default function UserManagementClient({ initialUsers }: { initialUsers: User[] }) {
    const [users, setUsers] = useState<User[]>(initialUsers);
    const [activeFilter, setActiveFilter] = useState<RoleFilter>("ALL");
    const [search, setSearch] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "NORMAL_USER"
    });

    // ─── Filter Logic ───────────────────────────────────────────────────────────
    const filteredUsers = users.filter(user => {
        const matchesSearch = 
            user.name?.toLowerCase().includes(search.toLowerCase()) ||
            user.email?.toLowerCase().includes(search.toLowerCase()) ||
            user.role.toLowerCase().includes(search.toLowerCase());
        
        if (activeFilter === "ALL") return matchesSearch;
        if (activeFilter === "NORMAL_USER") return matchesSearch && (user.role === "NORMAL_USER" || user.role === "USER");
        return matchesSearch && user.role === activeFilter;
    });

    const getCount = (role: string) => users.filter(u => u.role === role).length;
    
    const counts = {
        ALL: users.length,
        SUPER_ADMIN: getCount("SUPER_ADMIN"),
        ADMIN_STAFF: getCount("ADMIN_STAFF"),
        CONTENT_EDITOR: getCount("CONTENT_EDITOR"),
        CHURCH_USER: getCount("CHURCH_USER"),
        NORMAL_USER: getCount("NORMAL_USER") + getCount("USER"),
    };

    // ─── Actions ──────────────────────────────────────────────────────────────
    const handleOpenModal = (user?: User) => {
        if (user) {
            setEditingUser(user);
            setFormData({
                name: user.name || "",
                email: user.email || "",
                password: "",
                role: user.role
            });
        } else {
            setEditingUser(null);
            setFormData({
                name: "",
                email: "",
                password: "",
                role: "NORMAL_USER"
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
            const url = editingUser ? `/api/admin/users/${editingUser.id}` : "/api/admin/users";
            const method = editingUser ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to save user");
            }

            const updatedUser = await res.json();

            if (editingUser) {
                setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
            } else {
                setUsers([updatedUser, ...users]);
            }

            setIsModalOpen(false);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this user?")) return;
        try {
            const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Failed to delete user");
            setUsers(users.filter(u => u.id !== id));
        } catch (err) {
            alert("Failed to delete user");
        }
    };

    // ─── Render Helpers ─────────────────────────────────────────────────────────
    const roleData: Record<string, { label: string; color: string; bg: string; icon: any }> = {
        SUPER_ADMIN: { label: "Super Admin", color: "text-[#7367f0]", bg: "bg-[#7367f0]/10", icon: ShieldCheck },
        ADMIN_STAFF: { label: "Admin Staff", color: "text-[#00cfe8]", bg: "bg-[#00cfe8]/10", icon: UserCog },
        CONTENT_EDITOR: { label: "Content Editor", color: "text-[#28c76f]", bg: "bg-[#28c76f]/10", icon: Edit2 },
        CHURCH_USER: { label: "Church Member", color: "text-[#ff9f43]", bg: "bg-[#ff9f43]/10", icon: UserCheck },
        NORMAL_USER: { label: "Seeker", color: "text-slate-500", bg: "bg-slate-100", icon: UserIcon },
        USER: { label: "Seeker", color: "text-slate-500", bg: "bg-slate-100", icon: UserIcon },
    };

    const NavItem = ({ filter, label, icon: Icon, count }: { filter: RoleFilter; label: string; icon: any; count?: number }) => {
        const isActive = activeFilter === filter;
        return (
            <button
                onClick={() => setActiveFilter(filter)}
                className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl transition-all duration-300 group ${isActive ? 'bg-primary/10 text-primary shadow-sm' : 'text-[#5d596c] hover:bg-[#f8f7fa]'}`}
            >
                <div className="flex items-center gap-4">
                    <span className={`${isActive ? 'opacity-100' : 'opacity-30 group-hover:opacity-100'} transition-opacity`}>
                        {isActive ? '»' : <Icon size={18} />}
                    </span>
                    <span className={`text-[13px] font-black uppercase tracking-widest ${isActive ? 'text-primary' : ''}`}>{label}</span>
                </div>
                {count !== undefined && (
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isActive ? 'bg-primary text-white' : 'bg-[#dbdade] text-[#5d596c]'}`}>
                        {count}
                    </span>
                )}
            </button>
        );
    };

    return (
        <div className="flex flex-col lg:flex-row gap-8 min-h-[800px] animate-in fade-in duration-700">
            {/* ── ROLE SIDEBAR (LEFT) ─────────────────────────────────── */}
            <aside className="w-full lg:w-[320px] shrink-0 space-y-6">
                <div className="bg-white rounded-[2rem] border border-[#dbdade]/50 shadow-sm p-4 overflow-hidden">
                    <div className="px-6 py-4 mb-2 border-b border-[#dbdade]/30">
                        <h4 className="text-[11px] font-black text-[#a5a3ae] uppercase tracking-[0.3em]">Authority Tiers</h4>
                    </div>
                    
                    <div className="space-y-1">
                        <NavItem filter="ALL" label="Entire Registry" icon={LayoutGrid} count={counts.ALL} />
                        <NavItem filter="SUPER_ADMIN" label="Super Admins" icon={ShieldCheck} count={counts.SUPER_ADMIN} />
                        <NavItem filter="ADMIN_STAFF" label="Admin Staff" icon={UserCog} count={counts.ADMIN_STAFF} />
                        <NavItem filter="CONTENT_EDITOR" label="Content Editors" icon={Edit2} count={counts.CONTENT_EDITOR} />
                    </div>

                    <div className="px-6 py-4 mt-6 mb-2 border-b border-[#dbdade]/30">
                        <h4 className="text-[11px] font-black text-[#a5a3ae] uppercase tracking-[0.3em]">Congregation</h4>
                    </div>
                    <div className="space-y-1">
                        <NavItem filter="CHURCH_USER" label="Church Member" icon={UserCheck} count={counts.CHURCH_USER} />
                        <NavItem filter="NORMAL_USER" label="Normal Seeker" icon={UserIcon} count={counts.NORMAL_USER} />
                    </div>
                </div>

                <div className="bg-primary p-8 rounded-[2rem] text-white shadow-xl shadow-primary/30 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-xl group-hover:scale-150 transition-transform duration-700" />
                    <h5 className="text-[16px] font-black uppercase leading-tight mb-4 relative z-10">Add New Official</h5>
                    <p className="text-[11px] font-bold text-white/70 uppercase tracking-widest leading-relaxed mb-6 relative z-10">Expand your governing team instantly.</p>
                    <button 
                        onClick={() => handleOpenModal()}
                        className="w-full py-3 bg-white text-primary rounded-xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-white/90 transition-all relative z-10 shadow-lg"
                    >
                        Create Account
                    </button>
                </div>
            </aside>

            {/* ── MAIN CONTENT (RIGHT) ────────────────────────────────── */}
            <main className="flex-1 space-y-8">
                {/* Search Bar */}
                <div className="bg-white rounded-3xl p-6 border border-[#dbdade]/50 shadow-sm flex items-center gap-4">
                    <Search size={22} className="text-[#a5a3ae] ml-2" />
                    <input
                        type="text"
                        placeholder={`Sift through ${activeFilter === 'ALL' ? 'all' : activeFilter.replace('_', ' ')} records...`}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="flex-1 bg-transparent border-none outline-none text-[15px] font-medium text-[#5d596c] placeholder:text-[#a5a3ae]"
                    />
                    <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-[#f8f7fa] rounded-lg border border-[#dbdade]/50">
                        <ListFilter size={14} className="text-[#a5a3ae]" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-[#a5a3ae]">Active Filter: {activeFilter}</span>
                    </div>
                </div>

                {/* Grid vs Table Based on Filter */}
                {activeFilter !== "NORMAL_USER" && activeFilter !== "CHURCH_USER" && activeFilter !== "ALL" ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
                        {filteredUsers.length > 0 ? filteredUsers.map((user) => {
                            const RD = roleData[user.role] || roleData.NORMAL_USER;
                            return (
                                <div key={user.id} className="bg-white rounded-[2.5rem] p-10 border border-[#dbdade]/50 shadow-sm flex flex-col items-center text-center relative group overflow-hidden hover:shadow-2xl transition-all">
                                    <div className={`absolute top-0 right-0 w-32 h-32 ${RD.bg} rounded-full -mr-16 -mt-16 blur-xl opacity-50 group-hover:scale-150 transition-transform duration-700`} />
                                    <div className={`w-20 h-20 rounded-3xl ${RD.bg} ${RD.color} flex items-center justify-center text-[28px] font-black mb-6 shadow-inner relative z-10`}>
                                        {user.name ? user.name[0] : <Fingerprint />}
                                    </div>
                                    <h4 className="text-[20px] font-black text-[#5d596c] leading-tight mb-1">{user.name || "Unnamed Official"}</h4>
                                    <p className="text-[13px] font-bold text-[#a5a3ae] mb-6">{user.email}</p>
                                    <span className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border border-transparent ${RD.bg} ${RD.color} mb-8`}>
                                        {RD.label}
                                    </span>
                                    <div className="flex w-full gap-4 pt-8 border-t border-[#dbdade]/30">
                                        <button onClick={() => handleOpenModal(user)} className="flex-1 py-4 bg-[#f8f7fa] rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all">Edit Access</button>
                                        <button onClick={() => handleDelete(user.id)} className="p-4 bg-[#f8f7fa] text-red-400 rounded-2xl hover:bg-red-500 hover:text-white transition-all"><Trash2 size={18} /></button>
                                    </div>
                                </div>
                            );
                        }) : (
                            <div className="col-span-full py-40 text-center">
                                <div className="w-20 h-20 bg-[#f8f7fa] rounded-full flex items-center justify-center mx-auto mb-6"><Users className="text-[#dbdade]" /></div>
                                <p className="text-[12px] font-black text-[#a5a3ae] uppercase tracking-widest">No officials found in this category</p>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="bg-white rounded-[2.5rem] border border-[#dbdade]/50 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-[#f8f7fa] border-b border-[#dbdade]/50 text-[11px] font-black text-[#a5a3ae] uppercase tracking-widest">
                                        <th className="px-10 py-6">Member Information</th>
                                        <th className="px-10 py-6">Designation</th>
                                        <th className="px-10 py-6 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#dbdade]/30">
                                    {filteredUsers.length > 0 ? filteredUsers.map((user) => (
                                        <tr key={user.id} className="hover:bg-primary/[0.02] transition-colors group">
                                            <td className="px-10 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-2xl bg-[#f8f7fa] text-[#5d596c] font-black text-[15px] flex items-center justify-center border border-[#dbdade]/40 group-hover:border-primary/30 transition-all">
                                                        {user.name ? user.name[0] : <Fingerprint size={18} />}
                                                    </div>
                                                    <div>
                                                        <div className="text-[15px] font-black text-[#5d596c] leading-none mb-1.5">{user.name || "Member"}</div>
                                                        <div className="text-[12px] font-bold text-[#a5a3ae] tracking-tight">{user.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-10 py-6">
                                                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${(roleData[user.role] || roleData.NORMAL_USER).bg} ${(roleData[user.role] || roleData.NORMAL_USER).color}`}>
                                                    {user.role.replace('_', ' ')}
                                                </span>
                                            </td>
                                            <td className="px-10 py-6 text-right">
                                                <div className="flex justify-end gap-6 opacity-40 group-hover:opacity-100 transition-opacity">
                                                    <button onClick={() => handleOpenModal(user)} className="text-[#a5a3ae] hover:text-primary"><Edit2 size={16} /></button>
                                                    <button onClick={() => handleDelete(user.id)} className="text-[#a5a3ae] hover:text-red-500"><Trash2 size={16} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={3} className="py-40 text-center text-[12px] font-black text-[#a5a3ae] uppercase tracking-widest italic">The registry is empty for this query</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </main>

            {/* ── MODAL ────────────────────────────────────────────────── */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/40 backdrop-blur-[4px] animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-md rounded-[3rem] p-12 shadow-2xl border border-[#dbdade]/50 relative animate-in zoom-in-95 duration-200">
                        <button onClick={() => setIsModalOpen(false)} className="absolute right-10 top-10 p-4 hover:bg-[#f8f7fa] rounded-full text-[#a5a3ae] transition-colors"><X size={24} /></button>
                        <div className="flex items-center gap-6 mb-12">
                            <div className="w-20 h-20 bg-primary/10 rounded-[2rem] flex items-center justify-center text-primary shadow-inner"><UserCog size={40} /></div>
                            <div>
                                <h3 className="text-[28px] font-black tracking-tighter uppercase text-[#5d596c] leading-none mb-2">{editingUser ? "Edit Profile" : "New Official"}</h3>
                                <p className="text-[11px] font-black text-[#a5a3ae] uppercase tracking-[0.3em]">Authority Management</p>
                            </div>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-[10px] font-black text-[#a5a3ae] uppercase tracking-[0.2em] mb-2 ml-1">Legal Name</label>
                                    <input required type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-6 py-4.5 bg-[#f8f7fa] border border-[#dbdade]/60 rounded-2xl text-[14px] font-bold text-[#5d596c]" placeholder="Full Name" />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-[#a5a3ae] uppercase tracking-[0.2em] mb-2 ml-1">Secure Email</label>
                                    <input required type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-6 py-4.5 bg-[#f8f7fa] border border-[#dbdade]/60 rounded-2xl text-[14px] font-bold text-[#5d596c]" placeholder="email@mypcc.org" />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-[#a5a3ae] uppercase tracking-[0.2em] mb-2 ml-1">Credentials {editingUser && "(Empty to keep)"}</label>
                                    <input required={!editingUser} type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className="w-full px-6 py-4.5 bg-[#f8f7fa] border border-[#dbdade]/60 rounded-2xl text-[14px] font-bold text-[#5d596c]" placeholder="••••••••" />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-[#a5a3ae] uppercase tracking-[0.2em] mb-2 ml-1">Role Designation</label>
                                    <select value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} className="w-full px-6 py-4.5 bg-[#f8f7fa] border border-[#dbdade]/60 rounded-2xl text-[12px] font-black uppercase tracking-widest text-[#5d596c]">
                                        <option value="SUPER_ADMIN">⚙️ Super Admin</option>
                                        <option value="ADMIN_STAFF">🧩 Admin Staff</option>
                                        <option value="CONTENT_EDITOR">✏️ Content Editor</option>
                                        <option value="CHURCH_USER">👥 Church Member</option>
                                        <option value="NORMAL_USER">👤 Normal User / Seeker</option>
                                    </select>
                                </div>
                            </div>
                            {error && <p className="text-red-500 text-[11px] text-center font-bold uppercase tracking-widest">{error}</p>}
                            <button type="submit" disabled={isLoading} className="w-full py-6 bg-primary text-white text-[13px] font-black uppercase tracking-[0.3em] rounded-[2rem] shadow-2xl shadow-primary/30 hover:-translate-y-1 transition-all">{isLoading ? "Processing..." : "Commit Changes"}</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
