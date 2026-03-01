"use client"

import { useState, Suspense } from "react"
import { signIn, getSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Lock, Mail, ShieldCheck, Home, Eye, EyeOff } from "lucide-react"
import { AnimatedRing } from "@/components/AnimatedRing"

function AdminLoginForm() {
    const router = useRouter()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError("")

        try {
            const res = await signIn("credentials", {
                email,
                password,
                redirect: false,
            })

            if (res?.error) {
                setError("Access Denied: Invalid admin credentials")
            } else {
                const session = await getSession()
                const userRole = (session?.user as any)?.role?.toLowerCase()

                const adminRoles = ["admin", "super_admin", "staff", "editor"]
                if (adminRoles.includes(userRole)) {
                    router.push("/admin")
                } else {
                    setError("Unauthorized: You do not have administrative privileges")
                    // Log them out if they are not admin
                    // signOut({ redirect: false }) 
                }
                router.refresh()
            }
        } catch (err) {
            setError("Something went wrong. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="relative z-10 w-full bg-slate-900/95 backdrop-blur-md p-6 sm:p-10 rounded-[30px] shadow-[0_20px_60px_rgba(0,0,0,0.6)] border border-white/5 animate-in fade-in zoom-in duration-700">
            <h2 className="text-center text-indigo-400 text-3xl font-bold uppercase tracking-[4px] mb-2">
                Admin Portal
            </h2>
            <p className="text-center text-slate-500 text-xs uppercase tracking-widest mb-8">Management & Oversight</p>

            <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="relative group">
                    <input
                        type="email"
                        placeholder="Admin Email"
                        required
                        className="w-full bg-indigo-500/5 border border-indigo-500/20 rounded-full px-5 py-3.5 pr-12 text-white outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:text-slate-600"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <Mail className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-indigo-400 transition-colors" />
                </div>

                <div className="relative group">
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Admin Password"
                        required
                        className="w-full bg-indigo-500/5 border border-indigo-500/20 rounded-full px-5 py-3.5 pr-[4.5rem] text-white outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:text-slate-600"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Lock className="absolute right-12 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-indigo-400 transition-colors" />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-indigo-400 focus:outline-none transition-colors"
                    >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                </div>

                {error && (
                    <div className="text-red-400 text-xs text-center bg-red-900/20 py-2 rounded-full border border-red-900/30">
                        {error}
                    </div>
                )}

                <button
                    disabled={isLoading}
                    className="w-full py-4 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:to-indigo-500 rounded-full text-white font-bold uppercase tracking-wider shadow-lg shadow-indigo-500/30 hover:-translate-y-1 active:scale-95 transition-all disabled:opacity-50"
                >
                    {isLoading ? "Verifying Authority..." : "Access Dashboard"}
                </button>
            </form>

            <div className="mt-8 text-center pt-6 border-t border-white/5 space-y-4">
                <Link href="/" className="text-slate-400 hover:text-white text-xs inline-flex items-center gap-2 transition-colors">
                    <Home className="w-3 h-3" /> Return to Sanctuary
                </Link>
            </div>
        </div>
    )
}

export default function AdminLoginPage() {
    return (
        <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-6 overflow-hidden select-none">
            <div className="relative w-full max-w-[400px] aspect-square flex items-center justify-center">
                <AnimatedRing
                    colorFrom="from-indigo-400"
                    colorTo="to-indigo-600"
                    shadowColor="shadow-[0_0_15px_rgba(99,102,241,0.8)]"
                />
                <Suspense fallback={<div className="text-white">Loading...</div>}>
                    <AdminLoginForm />
                </Suspense>
            </div>
        </div>
    )
}
