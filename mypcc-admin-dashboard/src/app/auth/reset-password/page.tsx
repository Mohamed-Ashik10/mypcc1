"use client"

import { useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Lock, ArrowLeft } from "lucide-react"
import { VantaBackground } from "@/components/VantaBackground"

// Inner component that safely uses useSearchParams (must be wrapped in Suspense)
function ResetPasswordForm() {
    const router = useRouter()
    const searchParams = useSearchParams()

    // Attempt to grab token from the URL parameters
    const token = searchParams.get("token")

    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setSuccess("")

        if (!token) {
            setError("Missing reset token. Please use the exact link from your email.")
            return
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.")
            return
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters long.")
            return
        }

        setIsLoading(true)

        try {
            const res = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, newPassword: password }),
            })

            const data = await res.json()

            if (res.ok) {
                setSuccess("Success! Your password has been changed.")
                setTimeout(() => {
                    router.push("/auth/login")
                }, 3000)
            } else {
                setError(data.error || "Failed to reset password. The link might be expired.")
            }
        } catch (err) {
            setError("A network error occurred. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    if (!token && !error) {
        return (
            <div className="w-full max-w-md space-y-8 bg-slate-900/40 backdrop-blur-2xl p-6 sm:p-8 rounded-[40px] shadow-[0_20px_60px_rgba(0,0,0,0.5)] border border-red-500/30 text-center animate-in fade-in zoom-in duration-700 z-10">
                <div className="text-4xl mb-4">⚠️</div>
                <h2 className="text-2xl font-bold text-white mb-2">Invalid Reset Link</h2>
                <p className="text-slate-300 text-sm mb-6">We could not find a secure token in your URL. Please make sure you copied the entire link from your email.</p>
                <Link href="/auth/login" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-colors">
                    Return to Login
                </Link>
            </div>
        )
    }

    return (
        <div className="w-full max-w-md space-y-8 bg-slate-900/40 backdrop-blur-2xl p-6 sm:p-8 rounded-[40px] shadow-[0_20px_60px_rgba(0,0,0,0.5)] border border-white/10 animate-in fade-in zoom-in duration-700 z-10 relative">

            <Link href="/auth/login" className="absolute top-6 left-6 text-slate-400 hover:text-white transition-colors flex items-center gap-2 text-sm font-bold">
                <ArrowLeft className="w-4 h-4" /> Back
            </Link>

            <div className="text-center pt-8">
                <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-2xl ring-4 ring-blue-600/20 transform hover:scale-110 transition-transform cursor-default">
                        <Lock className="w-8 h-8" />
                    </div>
                </div>
                <h2 className="text-3xl font-extrabold tracking-tight text-white drop-shadow-md">
                    Set New Password
                </h2>
                <p className="mt-2 text-sm text-slate-300 font-medium opacity-80">
                    Your new password must be at least 6 characters long.
                </p>
            </div>

            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-4">
                    <div className="relative group">
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-4">
                            New Password
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-500 transition-colors">
                                <Lock className="w-5 h-5" />
                            </div>
                            <input
                                name="password"
                                type="password"
                                required
                                minLength={6}
                                className="block w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 text-white rounded-2xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all placeholder:text-slate-500 sm:text-sm"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="relative group">
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-4">
                            Confirm Password
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-500 transition-colors">
                                <Lock className="w-5 h-5" />
                            </div>
                            <input
                                name="confirmPassword"
                                type="password"
                                required
                                minLength={6}
                                className="block w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 text-white rounded-2xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all placeholder:text-slate-500 sm:text-sm"
                                placeholder="••••••••"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="text-red-400 text-sm text-center bg-red-900/20 p-4 rounded-2xl border border-red-900/30 animate-pulse">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="text-emerald-400 text-sm text-center bg-emerald-900/20 p-4 rounded-2xl border border-emerald-900/30">
                        {success} <br />
                        <span className="text-xs opacity-70">Redirecting to login...</span>
                    </div>
                )}

                <button
                    type="submit"
                    disabled={isLoading || !!success}
                    className="group relative flex w-full justify-center rounded-2xl px-3 py-4 text-sm font-black text-white shadow-2xl transition-all active:scale-95 uppercase tracking-widest bg-blue-600 hover:bg-blue-700 shadow-blue-600/20 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {isLoading ? (
                        <span className="flex items-center gap-2">
                            <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Resetting...
                        </span>
                    ) : (
                        "Reset Password"
                    )}
                </button>
            </form>
        </div>
    )
}

export default function ResetPasswordPage() {
    return (
        <div className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8 relative overflow-hidden">
            <VantaBackground />
            <Suspense fallback={<div className="text-white">Loading…</div>}>
                <ResetPasswordForm />
            </Suspense>
        </div>
    )
}
