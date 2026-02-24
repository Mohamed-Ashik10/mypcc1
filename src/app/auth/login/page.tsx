"use client"

import { useState, useEffect, Suspense } from "react"
import { signIn, getSession } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Lock, Mail, User, ShieldCheck, UserPlus, Facebook, Twitter, Chrome as Google } from "lucide-react"
import { VantaBackground } from "@/components/VantaBackground"

// Inner component that safely uses useSearchParams (must be wrapped in Suspense)
function LoginForm() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [loginType, setLoginType] = useState<"user" | "admin">("user")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [forgotPasswordMsg, setForgotPasswordMsg] = useState("")

    useEffect(() => {
        if (searchParams.get("registered")) {
            setSuccess("Registration successful! Please sign in.")
        }
        const type = searchParams.get("type")
        if (type === "admin") setLoginType("admin")
        if (type === "user" || type === "member") setLoginType("user")
    }, [searchParams])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError("")
        setSuccess("")
        setForgotPasswordMsg("")

        try {
            const res = await signIn("credentials", {
                email,
                password,
                redirect: false,
            })

            if (res?.error) {
                setError("Invalid email or password")
            } else {
                const session = await getSession()
                const userRole = (session?.user as any)?.role

                router.push("/admin")
                router.refresh()
            }
        } catch (err) {
            setError("Something went wrong. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    const handleForgotPassword = async (e: React.MouseEvent) => {
        e.preventDefault()
        if (!email) {
            setError("Please enter your email first")
            return
        }

        try {
            const res = await fetch("/api/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            })

            console.log("Server Response Status:", res.status);

            if (res.ok) {
                setForgotPasswordMsg("A password reset link has been sent to your email address")
                setError("")
            } else {
                setError("Failed to send verification code")
            }
        } catch (err) {
            setError("Communication error")
        }
    }

    return (
        <div className="w-full max-w-md space-y-8 bg-slate-900/40 backdrop-blur-2xl p-6 sm:p-8 rounded-[40px] shadow-[0_20px_60px_rgba(0,0,0,0.5)] border border-white/10 animate-in fade-in zoom-in duration-700 z-10">
            <div className="text-center">
                <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-4xl font-bold shadow-2xl ring-4 ring-blue-600/20 transform hover:scale-110 transition-transform cursor-default">
                        PCC
                    </div>
                </div>
                <h2 className="text-4xl font-extrabold tracking-tight text-white drop-shadow-md">
                    Welcome Back
                </h2>
                <p className="mt-2 text-sm text-slate-300 font-medium opacity-80">
                    Please sign in to your account
                </p>
            </div>

            {/* Role Switcher */}
            <div className="grid grid-cols-2 p-1 bg-white/5 dark:bg-slate-800/40 rounded-2xl mb-8 relative border border-white/10">
                <button
                    onClick={() => { setLoginType("user"); setError(""); setSuccess(""); setForgotPasswordMsg(""); }}
                    className={`flex items-center justify-center gap-2 py-3 text-sm font-bold rounded-xl transition-all z-10 ${loginType === "user"
                        ? "bg-blue-600 text-white shadow-lg"
                        : "text-slate-400 hover:text-white"
                        }`}
                >
                    <User className="w-4 h-4" />
                    Member
                </button>
                <button
                    onClick={() => { setLoginType("admin"); setError(""); setSuccess(""); setForgotPasswordMsg(""); }}
                    className={`flex items-center justify-center gap-2 py-3 text-sm font-bold rounded-xl transition-all z-10 ${loginType === "admin"
                        ? "bg-indigo-600 text-white shadow-lg"
                        : "text-slate-400 hover:text-white"
                        }`}
                >
                    <ShieldCheck className="w-4 h-4" />
                    Admin
                </button>
            </div>

            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-4">
                    <div className="relative group">
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-4">
                            Email Address
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-500 transition-colors">
                                <Mail className="w-5 h-5" />
                            </div>
                            <input
                                name="email"
                                type="email"
                                required
                                className="block w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 text-white rounded-2xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all placeholder:text-slate-500 sm:text-sm"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="relative group">
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-4">
                            Password
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-500 transition-colors">
                                <Lock className="w-5 h-5" />
                            </div>
                            <input
                                name="password"
                                type="password"
                                required
                                className="block w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 text-white rounded-2xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all placeholder:text-slate-500 sm:text-sm"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <div className="text-right">
                    <button
                        type="button"
                        onClick={handleForgotPassword}
                        className="text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors bg-transparent border-none cursor-pointer"
                    >
                        Forgot Password?
                    </button>
                </div>

                {error && (
                    <div className="text-red-400 text-sm text-center bg-red-900/20 p-4 rounded-2xl border border-red-900/30 animate-pulse">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="text-emerald-400 text-sm text-center bg-emerald-900/20 p-4 rounded-2xl border border-emerald-900/30">
                        {success}
                    </div>
                )}

                {forgotPasswordMsg && (
                    <div className="text-blue-400 text-sm text-center bg-blue-900/20 p-4 rounded-2xl border border-blue-900/30">
                        {forgotPasswordMsg}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={isLoading}
                    className={`group relative flex w-full justify-center rounded-2xl px-3 py-4 text-sm font-black text-white shadow-2xl transition-all active:scale-95 uppercase tracking-widest ${loginType === "admin"
                        ? "bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/20"
                        : "bg-blue-600 hover:bg-blue-700 shadow-blue-600/20"
                        } disabled:opacity-70 disabled:cursor-not-allowed`}
                >
                    {isLoading ? (
                        <span className="flex items-center gap-2">
                            <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Authenticating...
                        </span>
                    ) : (
                        `Sign in as ${loginType === "admin" ? "Admin" : "Member"}`
                    )}
                </button>
            </form>

            <div className="text-center space-y-6">
                <div className="flex items-center gap-4 py-2">
                    <div className="h-[1px] bg-white/10 flex-1"></div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Or Login With</span>
                    <div className="h-[1px] bg-white/10 flex-1"></div>
                </div>

                <div className="flex justify-center gap-6">
                    {[
                        { icon: Facebook, color: "hover:bg-[#3b5998] hover:text-white", href: "https://www.facebook.com/login" },
                        { icon: Twitter, color: "hover:bg-white hover:text-black", href: "https://twitter.com/login" },
                        { icon: Google, color: "hover:bg-[#db4437] hover:text-white", href: "https://accounts.google.com/signin" }
                    ].map((social, i) => (
                        <a
                            href={social.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            key={i}
                            className={`w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-slate-400 transition-all hover:-translate-y-1 hover:shadow-xl ${social.color}`}
                        >
                            <social.icon className="w-5 h-5" />
                        </a>
                    ))}
                </div>

                <p className="text-sm text-slate-400 font-medium pt-4">
                    New to PCC?{" "}
                    <Link
                        href="/auth/register"
                        className="text-blue-400 hover:text-blue-300 underline font-bold inline-flex items-center gap-1 transition-colors"
                    >
                        <UserPlus className="w-4 h-4" />
                        Join Now
                    </Link>
                </p>
                <p className="text-[10px] text-slate-600 uppercase tracking-[0.2em] font-black opacity-50">
                    © {new Date().getFullYear()} Presbyterian Church in Cameroon
                </p>
            </div>
        </div>
    )
}

export default function LoginPage() {
    return (
        <div className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8 relative overflow-hidden">
            <VantaBackground />
            <Suspense fallback={<div className="text-white">Loading…</div>}>
                <LoginForm />
            </Suspense>
        </div>
    )
}
