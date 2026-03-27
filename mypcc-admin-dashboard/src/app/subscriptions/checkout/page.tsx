"use client"

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useState } from "react";
import Link from "next/link";

function CheckoutContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const planType = searchParams.get("plan") || "SEEKER";
    const [paymentMethod, setPaymentMethod] = useState("MOBILE_MONEY");
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Form inputs
    const [phoneNumber, setPhoneNumber] = useState("");

    const plans: Record<string, any> = {
        SEEKER: { name: "The Seeker", price: 1500, features: ["200 Hymns Access", "Current Echo Issue"] },
        PILGRIM: { name: "The Pilgrim", price: 4500, features: ["400 Hymns Access", "Full Echo Archive"] },
        SHEPHERD: { name: "The Shepherd", price: 12000, features: ["Unlimited Hymn Library", "Full Echo Archive"] },
    };

    const currentPlan = plans[planType] || plans.SEEKER;

    const handleCompletePayment = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch("/api/subscriptions/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    planType,
                    paymentMethod,
                    phoneNumber,
                }),
            });

            const data = await response.json();

            if (data.success) {
                setIsSuccess(true);
                // Redirect back to home after 3 seconds
                setTimeout(() => {
                    router.push("/");
                    router.refresh(); // Refresh to update session/subscription badges
                }, 3000);
            } else {
                setError(data.error || "Payment failed. Please try again.");
            }
        } catch (err) {
            setError("A network error occurred. Please check your connection.");
        } finally {
            setIsLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-[#F7F3EC] flex flex-col items-center justify-center p-4">
                <div className="bg-white rounded-[40px] p-12 text-center max-w-md w-full shadow-2xl border border-[#e8e1d5] border-b-8 border-b-[#6e1799]">
                    <div className="w-24 h-24 bg-[#6e1799]/10 rounded-full flex items-center justify-center text-4xl mx-auto mb-8 animate-bounce">
                        ✨
                    </div>
                    <h2 className="text-3xl font-black tracking-tighter text-[#1a1510] uppercase mb-4" style={{ fontFamily: '"Cormorant Garamond", serif' }}>
                        JOURNEY <span className="text-[#6e1799] italic">CONCLUDED</span>
                    </h2>
                    <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-8">
                        Your {currentPlan.name} membership is now active.
                    </p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.3em]">
                        Redirecting to the library...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F7F3EC] flex flex-col items-center py-16 px-4">
            {/* Header / Logo */}
            <div className="mb-12 text-center">
                <Link href="/" className="text-2xl font-light tracking-widest text-[#1a1510]" style={{ fontFamily: '"Cormorant Garamond", serif' }}>
                    CANTI<span className="italic text-[#6e1799] font-medium">CLE</span>
                </Link>
                <div className="h-px w-12 bg-[#6e1799]/30 mx-auto mt-4"></div>
            </div>

            <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-5 gap-8">
                {/* ── LEFT: PLAN SUMMARY ────────────────────────────────────── */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-3xl p-8 border border-[#e8e1d5] shadow-sm">
                        <p className="text-[10px] font-black uppercase tracking-widest text-[#6e1799] mb-6">Order Summary</p>
                        
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-2xl bg-[#6e1799]/5 flex items-center justify-center text-xl">📜</div>
                            <div>
                                <h2 className="text-lg font-black tracking-tight text-[#1a1510] uppercase">{currentPlan.name}</h2>
                                <p className="text-xs text-slate-400 font-bold uppercase tracking-tight">Monthly Subscription</p>
                            </div>
                        </div>

                        <div className="space-y-4 pt-6 border-t border-[#f7f3ec]">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Plan Price</span>
                                <span className="font-mono font-black text-[#1a1510]">{currentPlan.price.toLocaleString()} XAF</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Tax / Fee</span>
                                <span className="font-mono font-black text-[#1a1510]">0 XAF</span>
                            </div>
                            <div className="flex justify-between items-center pt-4 border-t border-[#f7f3ec]">
                                <span className="text-slate-800 font-black uppercase tracking-widest text-xs">Total Amount</span>
                                <span className="text-xl font-black tracking-tighter text-[#6e1799]">{currentPlan.price.toLocaleString()} XAF</span>
                            </div>
                        </div>

                        {/* Order Benefits List */}
                        <div className="mt-8 space-y-3">
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4">Included Access</p>
                            {currentPlan.features.map((f: string, i: number) => (
                                <div key={i} className="flex items-center gap-3 text-xs font-bold text-slate-500">
                                    <span className="text-[#6e1799] opacity-50">◈</span> {f}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="p-6 text-center bg-[#6e1799]/5 rounded-2xl border border-[#6e1799]/10">
                        <p className="text-[10px] text-[#6e1799] font-black uppercase tracking-[0.2em] mb-1">Secure Transaction</p>
                        <p className="text-[11px] text-[#1a1510]/60 font-medium leading-relaxed">
                            Your payment is processed by Canticle Gateway. Support is available for any billing issues.
                        </p>
                    </div>
                </div>

                {/* ── RIGHT: PAYMENT FORM ────────────────────────────────────── */}
                <div className="lg:col-span-3">
                    <div className="bg-white rounded-3xl p-10 border border-[#e8e1d5] shadow-xl shadow-[#6e1799]/5 relative overflow-hidden">
                        {isLoading && (
                            <div className="absolute inset-0 bg-white/80 backdrop-blur-[2px] z-50 flex flex-col items-center justify-center">
                                <span className="w-8 h-8 border-4 border-[#6e1799] border-t-transparent rounded-full animate-spin mb-4"></span>
                                <p className="text-[10px] font-black uppercase tracking-widest text-[#6e1799]">Processing Payment...</p>
                            </div>
                        )}

                        <h2 className="text-2xl font-black tracking-tight text-[#1a1510] uppercase mb-8">Payment Details</h2>

                        {/* Payment Method Tabs */}
                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <button 
                                onClick={() => setPaymentMethod("MOBILE_MONEY")}
                                className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all group
                                    ${paymentMethod === "MOBILE_MONEY" ? "border-[#6e1799] bg-[#6e1799]/5" : "border-[#f7f3ec] hover:border-[#6e1799]/30"}`}
                            >
                                <span className="text-2xl">📱</span>
                                <span className="text-[10px] font-black uppercase tracking-widest group-hover:text-[#6e1799]">MTN / Orange</span>
                            </button>
                            <button 
                                onClick={() => setPaymentMethod("CARD")}
                                className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all group
                                    ${paymentMethod === "CARD" ? "border-[#6e1799] bg-[#6e1799]/5" : "border-[#f7f3ec] hover:border-[#6e1799]/30"}`}
                            >
                                <span className="text-2xl">💳</span>
                                <span className="text-[10px] font-black uppercase tracking-widest group-hover:text-[#6e1799]">Credit Card</span>
                            </button>
                        </div>

                        {/* ERROR MESSAGE */}
                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl text-[10px] font-bold text-red-600 uppercase tracking-widest leading-relaxed">
                                {error}
                            </div>
                        )}

                        {/* Dynamic Form Fields */}
                        <div className="space-y-6">
                            {paymentMethod === "MOBILE_MONEY" ? (
                                <>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block ml-2">Phone Number</label>
                                        <div className="relative">
                                            <input 
                                                type="tel" 
                                                value={phoneNumber}
                                                onChange={(e) => setPhoneNumber(e.target.value)}
                                                placeholder="6XX XXX XXX" 
                                                className="w-full bg-[#fdfaf5] border border-[#e8e1d5] rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-[#6e1799]/20 focus:border-[#6e1799] outline-none transition-all"
                                            />
                                            <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-30 text-xs font-black uppercase font-mono tracking-tighter">CMR</div>
                                        </div>
                                    </div>
                                    <p className="text-[10px] text-slate-400 font-bold italic ml-2">Enter your money account number. You will receive a prompt on your phone to confirm.</p>
                                </>
                            ) : (
                                <>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block ml-2">Card Holder Name</label>
                                        <input type="text" placeholder="FULL NAME" className="w-full bg-[#fdfaf5] border border-[#e8e1d5] rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-[#6e1799]/20 focus:border-[#6e1799] outline-none transition-all" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block ml-2">Card Number</label>
                                        <input type="text" placeholder="XXXX XXXX XXXX XXXX" className="w-full bg-[#fdfaf5] border border-[#e8e1d5] rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-[#6e1799]/20 focus:border-[#6e1799] outline-none transition-all" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block ml-2">Expiry Date</label>
                                            <input type="text" placeholder="MM/YY" className="w-full bg-[#fdfaf5] border border-[#e8e1d5] rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-[#6e1799]/20 focus:border-[#6e1799] outline-none transition-all" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block ml-2">CVV</label>
                                            <input type="text" placeholder="XXX" className="w-full bg-[#fdfaf5] border border-[#e8e1d5] rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-[#6e1799]/20 focus:border-[#6e1799] outline-none transition-all" />
                                        </div>
                                    </div>
                                </>
                            )}

                            <button 
                                onClick={handleCompletePayment}
                                className="w-full bg-[#1a1510] text-[#f7f3ec] rounded-2xl py-5 text-xs font-black uppercase tracking-[0.4em] hover:bg-[#6e1799] hover:shadow-2xl hover:shadow-[#6e1799]/20 transition-all active:scale-[0.98] mt-4"
                            >
                                Complete Payment &rarr;
                            </button>
                        </div>

                        {/* Support Footer */}
                        <div className="mt-12 flex items-center justify-between opacity-40">
                            <span className="text-[9px] font-black tracking-widest uppercase">Verified Secure</span>
                            <div className="flex gap-4 grayscale">
                                <span className="text-xl">🏦</span>
                                <span className="text-xl">💳</span>
                                <span className="text-xl">🛡️</span>
                            </div>
                        </div>
                    </div>

                    <p className="text-center mt-8 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                        Back to <Link href="/" className="text-[#6e1799] hover:underline">Hymn Library</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default function CheckoutPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#F7F3EC] flex items-center justify-center font-black uppercase tracking-widest text-[#6e1799]">Preparing Journey...</div>}>
            <CheckoutContent />
        </Suspense>
    );
}
