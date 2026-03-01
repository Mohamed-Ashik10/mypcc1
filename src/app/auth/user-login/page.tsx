"use client"

import { useState, useEffect, Suspense } from "react"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Lock, Mail, Facebook, Twitter, Chrome as Google, UserPlus, Eye, EyeOff } from "lucide-react"
import { AnimatedRing } from "@/components/AnimatedRing"

function UserLoginForm() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (searchParams.get("registered")) {
            setSuccess("Registration successful! Please sign in.")
        }
    }, [searchParams])

    const [forgotPasswordMsg, setForgotPasswordMsg] = useState("")
    const [isForgotLoading, setIsForgotLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError("")
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
                router.push("/")
                router.refresh()
            }
        } catch (err) {
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
        <div className="relative z-10 w-full bg-[#1e2a3a]/95 backdrop-blur-md p-6 sm:p-10 rounded-[30px] shadow-[0_20px_60px_rgba(0,0,0,0.5)] border border-white/10 animate-in fade-in zoom-in duration-700">
            <h2 className="text-center text-[#ffa500] text-3xl font-bold uppercase tracking-[4px] mb-2">
                User Login
            </h2>
            <p className="text-center text-white/40 text-xs uppercase tracking-widest mb-8">Access the Canticle Community</p>

            <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="relative group">
                    <input
                        type="email"
                        placeholder="Email"
                        required
                        className="w-full bg-white/10 border border-white/20 rounded-full px-5 py-3.5 pr-12 text-white outline-none focus:border-[#ffa500] focus:ring-4 focus:ring-orange-500/20 transition-all placeholder:text-white/40"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <Mail className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-[#ffa500] transition-colors" />
                </div>

                <div className="relative group">
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        required
                        className="w-full bg-white/10 border border-white/20 rounded-full px-5 py-3.5 pr-[4.5rem] text-white outline-none focus:border-[#ffa500] focus:ring-4 focus:ring-orange-500/20 transition-all placeholder:text-white/40"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Lock className="absolute right-12 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-[#ffa500] transition-colors" />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-[#ffa500] focus:outline-none transition-colors"
                    >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                </div>

                {error && (
                    <div className="text-red-400 text-xs text-center bg-red-900/20 py-2 rounded-full border border-red-900/30">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="text-emerald-400 text-xs text-center bg-emerald-900/20 py-2 rounded-full border border-emerald-900/30">
                        {success}
                    </div>
                )}

                {forgotPasswordMsg && (
                    <div className="text-emerald-400 text-xs text-center bg-emerald-900/20 py-2 px-4 rounded-full border border-emerald-900/30">
                        {forgotPasswordMsg}
                    </div>
                )}

                <div className="text-right -mt-2">
                    <button
                        type="button"
                        onClick={handleForgotPassword}
                        disabled={isForgotLoading}
                        className="text-xs text-white/60 hover:text-[#ffa500] transition-colors bg-transparent border-none cursor-pointer disabled:opacity-50"
                    >
                        {isForgotLoading ? "Sending..." : "Forget Your Password?"}
                    </button>
                </div>

                <button
                    disabled={isLoading}
                    className="w-full py-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:to-orange-400 rounded-full text-white font-bold uppercase tracking-wider shadow-lg shadow-orange-500/30 hover:-translate-y-1 active:scale-95 transition-all disabled:opacity-50"
                >
                    {isLoading ? "Authenticating..." : "Login"}
                </button>
            </form>

            <div className="mt-8 text-center space-y-4">
                <p className="text-sm text-white/40 uppercase tracking-widest font-medium">Log in with</p>
                <div className="flex justify-center gap-4">
                    {[
                        { icon: Facebook, color: "bg-[#3b5998]", provider: "facebook" },
                        { icon: Twitter, color: "bg-black", provider: "twitter" },
                        { icon: Google, color: "bg-[#db4437]", provider: "google" }
                    ].map((social, i) => (
                        <button
                            key={i}
                            type="button"
                            onClick={() => signIn(social.provider, { callbackUrl: "/" })}
                            className={`${social.color} w-10 h-10 rounded-full flex items-center justify-center text-white cursor-pointer hover:-translate-y-1 hover:shadow-lg transition-all`}
                        >
                            <social.icon className="w-5 h-5" />
                        </button>
                    ))}
                </div>
            </div>

            <div className="mt-8 text-center pt-6 border-t border-white/10">
                <p className="text-white/40 text-sm">
                    New to PCC?{" "}
                    <Link href="/auth/register" className="text-[#ffa500] font-bold hover:underline inline-flex items-center gap-1">
                        <UserPlus className="w-4 h-4" /> Sign Up
                    </Link>
                </p>
            </div>
        </div>
    )
}

export default function UserLoginPage() {
    return (
        <div className="min-h-screen bg-[#1e2a3a] flex items-center justify-center p-6 overflow-hidden select-none">
            <div className="relative w-full max-w-[400px] aspect-square flex items-center justify-center">
                <AnimatedRing />
                <Suspense fallback={<div className="text-white">Loading...</div>}>
                    <UserLoginForm />
                </Suspense>
            </div>
        </div>
    )
}
