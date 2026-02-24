"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Lock, ArrowLeft, CheckCircle } from "lucide-react"
import { VantaBackground } from "@/components/VantaBackground"
import { Suspense } from "react"

function ResetPasswordForm() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [error, setError] = useState("")
    const [success, setSuccess] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (password !== confirmPassword) {
            setError("Passwords do not match")
            return
        }

        setIsLoading(true)
        setError("")

        try {
            // Mock API call
            await new Promise(resolve => setTimeout(resolve, 1500))
            setSuccess(true)
        } catch (err) {
            setError("Something went wrong")
        } finally {
            setIsLoading(false)
        }
    }

    if (success) {
        return (
            <div className="w-full max-w-md space-y-8 bg-slate-900/40 backdrop-blur-2xl p-6 sm:p-10 rounded-[40px] shadow-2xl border border-white/10 text-center animate-in zoom-in duration-500">
                <div className="flex justify-center mb-6">
                    <CheckCircle className="w-20 h-20 text-emerald-500" />
                </div>
                <h2 className="text-3xl font-black text-white">Password Reset!</h2>
                <p className="text-slate-300 mt-2 font-medium">Your password has been successfully updated. You can now sign in with your new credentials.</p>
                <Link
                    href="/auth/login"
                    className="mt-8 inline-flex items-center justify-center w-full px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl transition-all shadow-xl active:scale-95"
                >
                    Back to Login
                </Link>
            </div>
        )
    }

    return (
        <div className="w-full max-w-md space-y-8 bg-slate-900/40 backdrop-blur-2xl p-6 sm:p-8 rounded-[40px] shadow-[0_20px_60px_rgba(0,0,0,0.5)] border border-white/10 animate-in fade-in duration-700 z-10">
            <div className="text-center">
                <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-2xl ring-4 ring-blue-600/20">
                        PCC
                    </div>
                </div>
                <h2 className="text-3xl font-extrabold tracking-tight text-white italic">
                    Reset Password
                </h2>
                <p className="mt-2 text-sm text-slate-300 font-medium opacity-80">
                    Create a new secure password for your account
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
                                type="password"
                                required
                                className="block w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 text-white rounded-2xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all placeholder:text-slate-500 sm:text-sm"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="relative group">
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-4">
                            Confirm New Password
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-500 transition-colors">
                                <Lock className="w-5 h-5" />
                            </div>
                            <input
                                type="password"
                                required
                                className="block w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 text-white rounded-2xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all placeholder:text-slate-500 sm:text-sm"
                                placeholder="••••••••"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="text-red-400 text-sm text-center bg-red-900/20 p-4 rounded-2xl border border-red-900/30">
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={isLoading}
                    className="group relative flex w-full justify-center rounded-2xl bg-blue-600 px-3 py-4 text-sm font-black text-white shadow-2xl shadow-blue-600/20 hover:bg-blue-700 transition-all active:scale-95 uppercase tracking-widest disabled:opacity-70"
                >
                    {isLoading ? "Updating..." : "Reset Password"}
                </button>

                <div className="text-center pt-2">
                    <Link
                        href="/auth/login"
                        className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Login
                    </Link>
                </div>
            </form>
        </div>
    )
}

export default function ResetPasswordPage() {
    return (
        <div className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8 relative overflow-hidden">
            <VantaBackground />
            <Suspense fallback={<div className="text-white">Loading...</div>}>
                <ResetPasswordForm />
            </Suspense>
        </div>
    )
}
