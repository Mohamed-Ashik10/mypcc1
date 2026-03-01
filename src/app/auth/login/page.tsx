"use client"

import { useState, useEffect, Suspense } from "react"
import { signIn, getSession } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Lock, Mail, Eye, EyeOff, UserPlus, Facebook, Twitter, Chrome as Google } from "lucide-react"
import { VantaBackground } from "@/components/VantaBackground"

const ADMIN_ROLES = ["SUPER_ADMIN", "ADMIN", "EDITOR", "STAFF"]

function LoginForm() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [forgotPasswordMsg, setForgotPasswordMsg] = useState("")
    const [isForgotLoading, setIsForgotLoading] = useState(false)

    useEffect(() => {
        if (searchParams.get("registered")) {
            setSuccess("Registration successful! Please sign in.")
        }
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
                const userRole = (session?.user as any)?.role as string

                // Role-based redirect: admins/editors/staff → /admin, everyone else → /
                if (ADMIN_ROLES.includes(userRole)) {
                    router.push("/admin")
                } else {
                    router.push("/")
                }
                router.refresh()
            }
        } catch {
            setError("Something went wrong. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    const handleForgotPassword = async () => {
        if (!email) {
            setError("Please enter your email address first, then click Forgot Password.")
            return
        }
        setIsForgotLoading(true)
        setError("")
        setForgotPasswordMsg("")
        try {
            const res = await fetch("/api/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            })
            if (res.ok) {
                setForgotPasswordMsg("✅ A password reset link has been sent to your email.")
            } else {
                setError("Failed to send reset email. Please try again.")
            }
        } catch {
            setError("Network error. Please try again.")
        } finally {
            setIsForgotLoading(false)
        }
    }

    return (
        <div className="w-full max-w-md space-y-8 bg-slate-900/40 backdrop-blur-2xl p-6 sm:p-8 rounded-[40px] shadow-[0_20px_60px_rgba(0,0,0,0.5)] border border-white/10 animate-in fade-in zoom-in duration-700 z-10">
            {/* Logo & Header */}
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
                    Sign in to access your account
                </p>
            </div>

            {/* Form */}
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-4">
                    {/* Email */}
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
                                autoComplete="email"
                                className="block w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 text-white rounded-2xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all placeholder:text-slate-500 sm:text-sm"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Password */}
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
                                type={showPassword ? "text" : "password"}
                                required
                                autoComplete="current-password"
                                className="block w-full pl-12 pr-12 py-4 bg-white/5 border border-white/10 text-white rounded-2xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all placeholder:text-slate-500 sm:text-sm"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-blue-400 transition-colors"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Forgot Password */}
                <div className="text-right -mt-2">
                    <button
                        type="button"
                        onClick={handleForgotPassword}
                        disabled={isForgotLoading}
                        className="text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors bg-transparent border-none cursor-pointer disabled:opacity-50"
                    >
                        {isForgotLoading ? "Sending..." : "Forgot Password?"}
                    </button>
                </div>

                {/* Alerts */}
                {error && (
                    <div className="text-red-400 text-sm text-center bg-red-900/20 p-4 rounded-2xl border border-red-900/30">
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

                {/* Submit */}
                <button
                    type="submit"
                    disabled={isLoading}
                    className="group relative flex w-full justify-center rounded-2xl px-3 py-4 text-sm font-black text-white shadow-2xl bg-blue-600 hover:bg-blue-700 shadow-blue-600/20 transition-all active:scale-95 uppercase tracking-widest disabled:opacity-70 disabled:cursor-not-allowed"
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
                        "Sign In"
                    )}
                </button>
            </form>

            {/* Social Login */}
            <div className="text-center space-y-6">
                <div className="flex items-center gap-4 py-2">
                    <div className="h-[1px] bg-white/10 flex-1"></div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Or Login With</span>
                    <div className="h-[1px] bg-white/10 flex-1"></div>
                </div>
                <div className="flex justify-center gap-6">
                    {[
                        { icon: Facebook, color: "hover:bg-[#3b5998] hover:text-white", provider: "facebook" },
                        { icon: Twitter, color: "hover:bg-white hover:text-black", provider: "twitter" },
                        { icon: Google, color: "hover:bg-[#db4437] hover:text-white", provider: "google" }
                    ].map((social, i) => (
                        <button
                            key={i}
                            type="button"
                            onClick={() => signIn(social.provider, { callbackUrl: "/" })}
                            className={`w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-slate-400 transition-all hover:-translate-y-1 hover:shadow-xl cursor-pointer ${social.color}`}
                        >
                            <social.icon className="w-5 h-5" />
                        </button>
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
