"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Lock, Mail, User, ArrowLeft, Phone } from "lucide-react"
import { VantaBackground } from "@/components/VantaBackground"

// Common country codes
const COUNTRY_CODES = [
    { code: "+237", flag: "🇨🇲", name: "Cameroon" },
    { code: "+1", flag: "🇺🇸", name: "USA/Canada" },
    { code: "+44", flag: "🇬🇧", name: "UK" },
    { code: "+33", flag: "🇫🇷", name: "France" },
    { code: "+49", flag: "🇩🇪", name: "Germany" },
    { code: "+234", flag: "🇳🇬", name: "Nigeria" },
    { code: "+254", flag: "🇰🇪", name: "Kenya" },
    { code: "+27", flag: "🇿🇦", name: "South Africa" },
    { code: "+91", flag: "🇮🇳", name: "India" },
    { code: "+86", flag: "🇨🇳", name: "China" },
    { code: "+81", flag: "🇯🇵", name: "Japan" },
    { code: "+55", flag: "🇧🇷", name: "Brazil" },
    { code: "+61", flag: "🇦🇺", name: "Australia" },
    { code: "+971", flag: "🇦🇪", name: "UAE" },
    { code: "+966", flag: "🇸🇦", name: "Saudi Arabia" },
];

export default function RegisterPage() {
    const router = useRouter()
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [countryCode, setCountryCode] = useState("+237")
    const [phoneNumber, setPhoneNumber] = useState("")
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError("")

        const phone = phoneNumber ? `${countryCode}${phoneNumber}` : ""

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password, phone }),
            })

            const data = await res.json()

            if (res.ok) {
                router.push("/auth/user-login?registered=true")
            } else {
                setError(data.error || "Something went wrong")
            }
        } catch {
            setError("Communication error. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    const inputClass = "block w-full pl-12 pr-4 py-4 bg-white border border-slate-200 text-slate-900 rounded-xl focus:ring-1 focus:ring-[#6e1799] focus:border-transparent outline-none transition-all placeholder:text-slate-300 sm:text-sm"
    const labelClass = "block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-4"

    return (
        <div className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8 relative overflow-hidden light">
            <VantaBackground />

            <div className="w-full max-w-md space-y-8 bg-white/80 backdrop-blur-2xl p-8 sm:p-10 rounded-3xl shadow-[0_24px_60px_rgba(0,0,0,0.06)] border border-white animate-in fade-in zoom-in duration-700 z-10 text-slate-900">
                <div className="text-center">
                    <div className="flex justify-center mb-8">
                        <div className="relative group cursor-default">
                            <div className="absolute inset-0 bg-[#6e1799] blur-2xl opacity-10 group-hover:opacity-20 transition-opacity"></div>
                            <div className="relative text-[2.5rem] tracking-widest font-light text-slate-900" style={{ fontFamily: '"Cormorant Garamond", serif' }}>
                                CANTI<span className="italic text-[#6e1799] font-medium">CLE</span>
                            </div>
                        </div>
                    </div>
                    <h2 className="text-3xl font-light tracking-[.15em] text-slate-800 uppercase" style={{ fontFamily: '"Cormorant Garamond", serif' }}>
                        Create Account
                    </h2>
                    <div className="mt-3 flex items-center justify-center gap-2">
                        <div className="h-px w-8 bg-gradient-to-r from-transparent to-[#6e1799]/30"></div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">
                            Join the My PCC community
                        </p>
                        <div className="h-px w-8 bg-gradient-to-l from-transparent to-[#6e1799]/30"></div>
                    </div>
                </div>

                <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        {/* Full Name */}
                        <div>
                            <label className={labelClass}>Full Name</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-[#6e1799] transition-colors">
                                    <User className="w-4 h-4" />
                                </div>
                                <input name="name" type="text" required className={inputClass}
                                    placeholder="John Doe" value={name} onChange={e => setName(e.target.value)} />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label className={labelClass}>Email Address</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-[#6e1799] transition-colors">
                                    <Mail className="w-4 h-4" />
                                </div>
                                <input name="email" type="email" autoComplete="email" required className={inputClass}
                                    placeholder="name@example.com" value={email} onChange={e => setEmail(e.target.value)} />
                            </div>
                        </div>

                        {/* Phone with Country Code */}
                        <div>
                            <label className={labelClass}>
                                Phone Number
                            </label>
                            <div className="flex gap-2">
                                {/* Country Code Dropdown */}
                                <div className="relative">
                                    <select
                                        value={countryCode}
                                        onChange={e => {
                                            setCountryCode(e.target.value);
                                            setPhoneNumber(""); // Clear number on country change
                                        }}
                                        className="appearance-none h-full pl-3 pr-8 py-3 bg-white border border-slate-200 text-slate-900 rounded-xl focus:ring-1 focus:ring-[#6e1799] focus:border-transparent outline-none transition-all sm:text-sm cursor-pointer"
                                        style={{ color: '#0f172a', backgroundColor: '#ffffff' }}
                                    >
                                        {COUNTRY_CODES.map(c => (
                                            <option key={c.code} value={c.code} className="text-slate-900 bg-white" style={{ color: '#0f172a', backgroundColor: '#ffffff' }}>
                                                {c.flag} {c.code}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none text-slate-400">
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6" /></svg>
                                    </div>
                                </div>
                                {/* Phone Number */}
                                <div className="relative flex-1 group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-[#6e1799] transition-colors">
                                        <Phone className="w-4 h-4" />
                                    </div>
                                    <input name="phone" type="tel" required className={inputClass}
                                        placeholder="6XX XXX XXX" value={phoneNumber}
                                        onChange={e => setPhoneNumber(e.target.value.replace(/\D/g, ""))} />
                                </div>
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className={labelClass}>Password</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-[#6e1799] transition-colors">
                                    <Lock className="w-4 h-4" />
                                </div>
                                <input name="password" type="password" required className={inputClass}
                                    placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} />
                            </div>
                            <p className="text-xs text-slate-400 mt-1 ml-1">Minimum 6 characters</p>
                        </div>
                    </div>

                    {error && (
                        <div className="text-red-500 text-xs font-bold uppercase tracking-widest text-center bg-red-50 p-4 rounded-xl border border-red-100">
                            {error}
                        </div>
                    )}

                    <button type="submit" disabled={isLoading}
                        className="group relative flex w-full justify-center rounded-xl bg-[#6e1799] px-3 py-4 text-[11px] font-bold text-white shadow-2xl shadow-[#6e1799]/10 hover:bg-[#4e0779] transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed border border-white/10 uppercase tracking-[0.3em]">
                        {isLoading ? (
                            <span className="flex items-center gap-2">
                                <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                Joining...
                            </span>
                        ) : "Join the Journey"}
                    </button>
                </form>

                <div className="pt-6 text-center border-t border-slate-200 mt-6">
                    <Link href="/auth/login"
                        className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#6e1799] hover:text-[#8e37b9] transition-colors">
                        <ArrowLeft className="w-3 h-3" />
                        Back to Login
                    </Link>
                </div>
            </div>
        </div>
    )
}
