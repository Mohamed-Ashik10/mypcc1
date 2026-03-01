"use client";

import { useState } from "react";
import { Plus, Search, Edit2, Trash2, X } from "lucide-react";

interface User {
    id: string;
    name: string | null;
    email: string | null;
    role: string;
    createdAt: Date | string;
}

export default function UserManagementClient({ initialUsers }: { initialUsers: User[] }) {
    const [users, setUsers] = useState<User[]>(initialUsers);
    const [search, setSearch] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    // Form states
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "USER"
    });

    const filteredUsers = users.filter(user =>
        user.name?.toLowerCase().includes(search.toLowerCase()) ||
        user.email?.toLowerCase().includes(search.toLowerCase())
    );

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
                role: "USER"
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

    return (
        <div className="space-y-6">
            {/* Controls */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                <div className="relative w-full sm:max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-500 transition-all active:scale-95 whitespace-nowrap"
                >
                    <Plus className="w-4 h-4" />
                    Add New User
                </button>
            </div>

            {/* Users Table */}
            <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-border bg-muted/30">
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">User</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Role</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Joined</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-muted/10 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-semibold text-foreground">{user.name || "N/A"}</div>
                                        <div className="text-xs text-muted-foreground">{user.email}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${user.role === "SUPER_ADMIN" ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" :
                                            user.role === "ADMIN" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" :
                                                user.role === "EDITOR" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" :
                                                    "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400"
                                            }`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-muted-foreground">
                                        {new Date(user.createdAt).toLocaleDateString('en-US')}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => handleOpenModal(user)}
                                                className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg transition-colors"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(user.id)}
                                                className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-card w-full max-w-md rounded-[32px] p-8 shadow-2xl border border-border relative animate-in slide-in-from-bottom-4 duration-300">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute right-6 top-6 p-2 hover:bg-muted rounded-full text-muted-foreground transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <h3 className="text-2xl font-bold mb-6 text-foreground">
                            {editingUser ? "Edit User" : "Add New User"}
                        </h3>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Full Name</label>
                                    <input
                                        required
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-3 bg-muted/30 border border-border rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none"
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Email Address</label>
                                    <input
                                        required
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full px-4 py-3 bg-muted/30 border border-border rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none"
                                        placeholder="john@example.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                                        Password {editingUser && "(Leave blank to keep current)"}
                                    </label>
                                    <input
                                        required={!editingUser}
                                        type="password"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="w-full px-4 py-3 bg-muted/30 border border-border rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none"
                                        placeholder="••••••••"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Role</label>
                                    <select
                                        value={formData.role}
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                        className="w-full px-4 py-3 bg-muted/30 border border-border rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none appearance-none"
                                    >
                                        <option value="SUPER_ADMIN">⚙️ Super Admin</option>
                                        <option value="ADMIN">👨💼 Admin Staff</option>
                                        <option value="EDITOR">📝 Content Editor</option>
                                        <option value="USER">📱 Church User</option>
                                    </select>
                                </div>
                            </div>

                            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl shadow-xl hover:bg-blue-500 transition-all active:scale-95 disabled:opacity-50"
                            >
                                {isLoading ? "Saving..." : editingUser ? "Update User" : "Create Account"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
