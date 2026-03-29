"use client"

import { useState, useEffect, Suspense } from "react"
import { signIn, getSession } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Lock, Mail, Eye, EyeOff, UserPlus, Facebook, Twitter, Chrome as Google } from "lucide-react"
import { VantaBackground } from "@/components/VantaBackground"

const ADMIN_ROLES = ["SUPER_ADMIN", "ADMIN_STAFF", "CONTENT_EDITOR", "ADMIN_STAFF"]

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
    const [logo, setLogo] = useState("/logo.png")
    const [bg, setBg] = useState("")
    const [appName, setAppName] = useState("CANTICLE")

    useEffect(() => {
        fetch("/api/settings")
            .then(r => r.json())
            .then(s => {
                if (s.logo_admin) setLogo(s.logo_admin)
                if (s.login_bg) setBg(s.login_bg)
                if (s.app_name) setAppName(s.app_name.toUpperCase())
            }).catch(() => {})
    }, [])

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
        <div className="w-full max-w-md space-y-8 bg-white/80 backdrop-blur-2xl p-8 sm:p-10 rounded-3xl shadow-[0_24px_60px_rgba(0,0,0,0.06)] border border-white animate-in fade-in zoom-in duration-700 z-10 text-slate-900">
            {/* Logo & Header */}
            <div className="text-center">
                <div className="flex justify-center mb-8">
                    <div className="relative group cursor-default">
                        <div className="absolute inset-0 bg-[#6e1799] blur-2xl opacity-10 group-hover:opacity-20 transition-opacity"></div>
                        <div className="relative flex flex-col items-center gap-2">
                             <img src={logo} alt="Logo" className="w-16 h-16 object-contain mb-2" />
                             <div className="text-[2.5rem] tracking-widest font-light text-slate-900 line-clamp-1" style={{ fontFamily: '"Cormorant Garamond", serif' }}>
                                {appName.substring(0, Math.max(0, appName.length - 3))}
                                <span className="italic text-[#6e1799] font-medium">{appName.substring(Math.max(0, appName.length - 3))}</span>
                             </div>
                        </div>
                    </div>
                </div>
                <h2 className="text-3xl font-light tracking-[.15em] text-slate-800 uppercase" style={{ fontFamily: '"Cormorant Garamond", serif' }}>
                    Welcome Back
                </h2>
                <div className="mt-3 flex items-center justify-center gap-2">
                    <div className="h-px w-8 bg-gradient-to-r from-transparent to-[#6e1799]/30"></div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">
                        Faith · Music · Journey
                    </p>
                    <div className="h-px w-8 bg-gradient-to-l from-transparent to-[#6e1799]/30"></div>
                </div>
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
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-[#6e1799] transition-colors">
                                <Mail className="w-4 h-4" />
                            </div>
                            <input
                                name="email"
                                type="email"
                                required
                                autoComplete="email"
                                className="block w-full pl-12 pr-4 py-4 bg-white border border-slate-200 text-slate-900 rounded-xl focus:ring-1 focus:ring-[#6e1799] focus:border-transparent outline-none transition-all placeholder:text-slate-300 sm:text-sm"
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
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-[#6e1799] transition-colors">
                                <Lock className="w-4 h-4" />
                            </div>
                            <input
                                name="password"
                                type={showPassword ? "text" : "password"}
                                required
                                autoComplete="current-password"
                                className="block w-full pl-12 pr-12 py-4 bg-white border border-slate-200 text-slate-900 rounded-xl focus:ring-1 focus:ring-[#6e1799] focus:border-transparent outline-none transition-all placeholder:text-slate-300 sm:text-sm"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-[#6e1799] transition-colors"
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
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
                        className="text-xs font-bold text-[#6e1799] hover:text-[#8e37b9] uppercase tracking-widest transition-colors bg-transparent border-none cursor-pointer disabled:opacity-50"
                    >
                        {isForgotLoading ? "Sending..." : "Forgot Password?"}
                    </button>
                </div>

                {/* Alerts */}
                {error && (
                    <div className="text-red-500 text-xs font-bold uppercase tracking-widest text-center bg-red-50 p-4 rounded-xl border border-red-100">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="text-emerald-500 text-xs font-bold uppercase tracking-widest text-center bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                        {success}
                    </div>
                )}
                {forgotPasswordMsg && (
                    <div className="text-[#6e1799] text-xs font-bold uppercase tracking-widest text-center bg-[#6e1799]/5 p-4 rounded-xl border border-[#6e1799]/10">
                        {forgotPasswordMsg}
                    </div>
                )}

                {/* Submit */}
                <button
                    type="submit"
                    disabled={isLoading}
                    className="group relative flex w-full justify-center rounded-xl px-3 py-4 text-[11px] font-bold text-white shadow-2xl bg-[#6e1799] hover:bg-[#4e0779] shadow-[#6e1799]/10 transition-all active:scale-95 uppercase tracking-[0.3em] disabled:opacity-70 disabled:cursor-not-allowed border border-white/10"
                >
                    {isLoading ? (
                        <span className="flex items-center gap-2">
                            <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Authenticating...
                        </span>
                    ) : (
                        "Begin Journey"
                    )}
                </button>
            </form>

            {/* Social Login */}
            <div className="text-center space-y-6">
                <div className="flex items-center gap-4 py-2">
                    <div className="h-[1px] bg-slate-200 flex-1"></div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Or Login With</span>
                    <div className="h-[1px] bg-slate-200 flex-1"></div>
                </div>
                <div className="flex justify-center">
                    {[
                        { icon: Google, provider: "google" }
                    ].map((social, i) => (
                        <button
                            key={i}
                            type="button"
                            onClick={() => signIn(social.provider, { callbackUrl: "/" })}
                            className="group/social relative w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 transition-all hover:-translate-y-1 hover:text-[#6e1799] hover:border-[#6e1799]/40 hover:bg-[#6e1799]/5 cursor-pointer shadow-sm hover:shadow-md"
                        >
                            <social.icon className="w-5 h-5 transition-transform group-hover/social:scale-110" />
                            <div className="absolute inset-0 rounded-full blur-lg bg-[#6e1799]/0 group-hover/social:bg-[#6e1799]/10 transition-colors -z-10"></div>
                        </button>
                    ))}
                </div>
                <p className="text-xs text-slate-400 font-medium pt-4 uppercase tracking-widest">
                    New to Canticle?{" "}
                    <Link
                        href="/auth/register"
                        className="text-[#6e1799] hover:text-[#8e37b9] font-bold inline-flex items-center gap-1 transition-colors"
                    >
                        <UserPlus className="w-3 h-3" />
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
        <div className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8 relative overflow-hidden light">
            <LoginStylesWrapper />
            <Suspense fallback={<div className="text-white">Loading…</div>}>
                <LoginForm />
            </Suspense>
        </div>
    )
}

function LoginStylesWrapper() {
    const [bg, setBg] = useState("");
    useEffect(() => {
        fetch("/api/settings")
            .then(r => r.json())
            .then(s => {
                if (s.login_bg) setBg(s.login_bg)
            }).catch(() => {})
    }, []);

    if (bg) {
        return <div className="absolute inset-0 bg-cover bg-center z-0" style={{ backgroundImage: `url(${bg})` }} />;
    }
    return <VantaBackground />;
}
