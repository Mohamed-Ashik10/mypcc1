"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Lock, Mail, Facebook, Twitter, Chrome as Google } from "lucide-react"
import { VantaBackground } from "@/components/VantaBackground"

export default function LoginV2Page() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [activeBars, setActiveBars] = useState(0)
    const numBars = 50

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveBars((prev) => (prev + 1) % numBars)
        }, 100)
        return () => clearInterval(interval)
    }, [])

    return (
        <div className="min-h-screen flex items-center justify-center p-6 overflow-hidden select-none relative">
            <VantaBackground />

            {/* Animated Ring Container */}
            <div className="relative w-full max-w-[400px] aspect-square flex items-center justify-center">
                <div className="absolute inset-0 animate-[spin_20s_linear_infinite] scale-[0.8] sm:scale-100">
                    {[...Array(numBars)].map((_, i) => {
                        const isActive = (activeBars >= i && activeBars < i + 8) || (activeBars + numBars < i + 8)
                        return (
                            <div
                                key={i}
                                className={`absolute w-[4px] sm:w-[6px] h-[20px] sm:h-[30px] rounded-full left-1/2 -ml-[2px] sm:-ml-[3px] transition-all duration-300 ${isActive
                                    ? "bg-gradient-to-b from-orange-400 to-orange-600 shadow-[0_0_15px_rgba(251,146,60,0.8)] scale-y-110"
                                    : "bg-slate-700 opacity-30"
                                    }`}
                                style={{
                                    transformOrigin: 'center 50%',
                                    transform: `rotate(${(360 / numBars) * i}deg) translateY(-140px) sm:translateY(-170px)`
                                }}
                            />
                        )
                    })}
                </div>

                {/* Login Card */}
                <div className="relative z-10 w-full bg-[#1e2a3a]/95 backdrop-blur-md p-6 sm:p-10 rounded-[30px] shadow-[0_20px_60px_rgba(0,0,0,0.5)] border border-white/10">
                    <h2 className="text-center text-[#ffa500] text-3xl font-bold uppercase tracking-[4px] mb-8">
                        Login
                    </h2>

                    <form className="space-y-6">
                        <div className="relative group">
                            <input
                                type="email"
                                placeholder="Email"
                                className="w-full bg-white/10 border border-white/20 rounded-full px-5 py-3.5 pr-12 text-white outline-none focus:border-[#ffa500] focus:ring-4 focus:ring-orange-500/20 transition-all placeholder:text-white/40"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <Mail className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-[#ffa500] transition-colors" />
                        </div>

                        <div className="relative group">
                            <input
                                type="password"
                                placeholder="Password"
                                className="w-full bg-white/10 border border-white/20 rounded-full px-5 py-3.5 pr-12 text-white outline-none focus:border-[#ffa500] focus:ring-4 focus:ring-orange-500/20 transition-all placeholder:text-white/40"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <Lock className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-[#ffa500] transition-colors" />
                        </div>

                        <div className="text-right -mt-2">
                            <a href="#" className="text-xs text-white/60 hover:text-[#ffa500] transition-colors">
                                Forget Your Password?
                            </a>
                        </div>

                        <button className="w-full py-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:to-orange-400 rounded-full text-white font-bold uppercase tracking-wider shadow-lg shadow-orange-500/30 hover:-translate-y-1 active:scale-95 transition-all">
                            Login
                        </button>
                    </form>

                    <div className="mt-8 text-center space-y-4">
                        <p className="text-sm text-white/40 uppercase tracking-widest font-medium">Log in with</p>
                        <div className="flex justify-center gap-4">
                            {[
                                { icon: Facebook, color: "bg-[#3b5998]" },
                                { icon: Twitter, color: "bg-black" },
                                { icon: Google, color: "bg-[#db4437]" }
                            ].map((social, i) => (
                                <div key={i} className={`${social.color} w-10 h-10 rounded-full flex items-center justify-center text-white cursor-pointer hover:-translate-y-1 hover:shadow-lg transition-all`}>
                                    <social.icon className="w-5 h-5" />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-8 text-center pt-6 border-t border-white/10">
                        <a href="#" className="text-[#ffa500] font-bold hover:underline">Sign Up</a>
                    </div>
                </div>
            </div>
        </div>
    )
}
