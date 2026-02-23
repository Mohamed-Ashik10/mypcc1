"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { CreditCard, Smartphone, ShieldCheck, ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"

export default function CheckoutPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const planType = searchParams.get("plan") || "MONTHLY"

    const [paymentMethod, setPaymentMethod] = useState<"MOBILE_MONEY" | "VISA" | "PAYPAL">("MOBILE_MONEY")
    const [phoneNumber, setPhoneNumber] = useState("")
    const [isProcessing, setIsProcessing] = useState(false)
    const [step, setStep] = useState<"checkout" | "sim_prompt" | "success">("checkout")

    const planPrices: Record<string, number> = {
        MONTHLY: 1000,
        QUARTERLY: 2500,
        YEARLY: 9000,
    }

    const amount = planPrices[planType] || 1000

    const handlePayNow = async () => {
        if (paymentMethod === "MOBILE_MONEY" && !phoneNumber) {
            alert("Please enter your phone number")
            return
        }

        setIsProcessing(true)

        // Simulate "Initiating Payment" API call
        await new Promise(r => setTimeout(r, 1500))

        if (paymentMethod === "MOBILE_MONEY") {
            setStep("sim_prompt")
        } else {
            // For others, just go to success for this mock
            confirmPayment()
        }
        setIsProcessing(false)
    }

    const confirmPayment = async () => {
        setIsProcessing(true)

        try {
            // Mock API call to finalize transaction and subscription
            const res = await fetch("/api/payments/complete", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    planType,
                    amount,
                    paymentMethod,
                    phoneNumber
                })
            })

            if (res.ok) {
                setStep("success")
                setTimeout(() => {
                    router.push("/admin/subscriptions?success=true")
                    router.refresh()
                }, 3000)
            } else {
                alert("Payment processing failed. Please try again.")
            }
        } catch (err) {
            alert("Connection error")
        } finally {
            setIsProcessing(false)
        }
    }

    if (step === "sim_prompt") {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="w-full max-w-sm bg-slate-900 border-4 border-slate-800 rounded-[3rem] p-6 shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-500">
                    <div className="absolute top-0 inset-x-0 h-8 flex justify-center items-center">
                        <div className="w-20 h-4 bg-slate-800 rounded-full" />
                    </div>

                    <div className="mt-8 bg-slate-800/50 rounded-2xl p-6 text-center space-y-4 border border-white/5">
                        <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-3xl mx-auto shadow-lg shadow-blue-500/20">
                            📱
                        </div>
                        <h3 className="text-white font-bold text-lg">SIM Toolkit Prompt</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            A payment prompt has been sent to <span className="text-white font-bold">{phoneNumber}</span>.
                            Please enter your PIN on your phone to authorize the transaction of <span className="text-white font-bold">{amount.toLocaleString()} XAF</span>.
                        </p>

                        <div className="pt-4 flex flex-col gap-3">
                            <button
                                onClick={confirmPayment}
                                disabled={isProcessing}
                                className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-xl text-sm transition-all flex items-center justify-center gap-2"
                            >
                                {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : "I've Entered My PIN"}
                            </button>
                            <button
                                onClick={() => setStep("checkout")}
                                className="w-full py-3 bg-transparent text-slate-500 hover:text-white text-sm font-bold"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>

                    <div className="mt-8 text-[10px] text-slate-600 text-center uppercase tracking-widest font-black">
                        Encrypted Connection
                    </div>
                </div>
            </div>
        )
    }

    if (step === "success") {
        return (
            <div className="min-h-[60vh] flex items-center justify-center text-center">
                <div className="space-y-6 animate-in fade-in zoom-in duration-700">
                    <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center text-white text-5xl mx-auto shadow-2xl shadow-green-500/20">
                        ✓
                    </div>
                    <h2 className="text-3xl font-black text-foreground">Payment Successful!</h2>
                    <p className="text-muted-foreground font-medium max-w-sm mx-auto">
                        Your subscription for the <span className="text-foreground font-bold">{planType}</span> plan is now active.
                        Redirecting you back to your dashboard...
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-2xl mx-auto">
            <Link
                href="/admin/subscriptions"
                className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground mb-8 transition-colors"
            >
                <ArrowLeft className="w-4 h-4" /> Back to Plans
            </Link>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
                {/* Checkout Form */}
                <div className="md:col-span-3 space-y-8">
                    <div>
                        <h2 className="text-3xl font-black text-foreground tracking-tight">Checkout</h2>
                        <p className="text-muted-foreground font-medium mt-1">Complete your subscription</p>
                    </div>

                    <div className="space-y-4">
                        <label className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em]">Select Payment Method</label>

                        <div className="grid grid-cols-1 gap-3">
                            <button
                                onClick={() => setPaymentMethod("MOBILE_MONEY")}
                                className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${paymentMethod === "MOBILE_MONEY" ? "border-blue-600 bg-blue-600/5 shadow-md" : "border-border hover:border-muted-foreground/30"}`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-xl ${paymentMethod === "MOBILE_MONEY" ? "bg-blue-600 text-white" : "bg-muted text-muted-foreground"}`}>
                                        <Smartphone className="w-5 h-5" />
                                    </div>
                                    <span className="font-bold text-sm">Mobile Money (MTN/Orange)</span>
                                </div>
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === "MOBILE_MONEY" ? "border-blue-600" : "border-muted-foreground/30"}`}>
                                    {paymentMethod === "MOBILE_MONEY" && <div className="w-2.5 h-2.5 bg-blue-600 rounded-full" />}
                                </div>
                            </button>

                            <button
                                onClick={() => setPaymentMethod("VISA")}
                                className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${paymentMethod === "VISA" ? "border-blue-600 bg-blue-600/5 shadow-md" : "border-border hover:border-muted-foreground/30"}`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-xl ${paymentMethod === "VISA" ? "bg-blue-600 text-white" : "bg-muted text-muted-foreground"}`}>
                                        <CreditCard className="w-5 h-5" />
                                    </div>
                                    <span className="font-bold text-sm">Credit / Debit Card</span>
                                </div>
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === "VISA" ? "border-blue-600" : "border-muted-foreground/30"}`}>
                                    {paymentMethod === "VISA" && <div className="w-2.5 h-2.5 bg-blue-600 rounded-full" />}
                                </div>
                            </button>
                        </div>
                    </div>

                    {paymentMethod === "MOBILE_MONEY" && (
                        <div className="space-y-4 animate-in slide-in-from-top-2 duration-300">
                            <label className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em] block ml-1">Phone Number</label>
                            <input
                                type="tel"
                                placeholder="e.g. 677XXXXXX"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                className="w-full px-5 py-4 bg-card border-border border-2 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-bold text-lg"
                            />
                            <p className="text-[10px] text-muted-foreground font-medium px-2">We'll send a SIM Toolkit push notification to this number for PIN entry.</p>
                        </div>
                    )}

                    <button
                        onClick={handlePayNow}
                        disabled={isProcessing}
                        className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl text-base shadow-xl shadow-blue-600/20 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
                    >
                        {isProcessing ? <Loader2 className="w-6 h-6 animate-spin" /> : "Confirm & Pay Now"}
                    </button>

                    <div className="flex items-center center gap-2 justify-center text-muted-foreground">
                        <ShieldCheck className="w-4 h-4 text-emerald-500" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Secure 256-bit SSL encrypted payment</span>
                    </div>
                </div>

                {/* Summary */}
                <div className="md:col-span-2">
                    <div className="bg-muted/50 rounded-3xl p-6 border border-border space-y-6 sticky top-8">
                        <h3 className="font-black text-sm uppercase tracking-widest text-muted-foreground">Order Summary</h3>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-sm font-bold">
                                <span className="text-muted-foreground">{planType.replace(/_/g, " ")} Subscription</span>
                                <span>{amount.toLocaleString()} XAF</span>
                            </div>
                            <div className="flex justify-between items-center text-sm font-bold">
                                <span className="text-muted-foreground">Processing Fee</span>
                                <span>0 XAF</span>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-border flex justify-between items-end">
                            <div>
                                <p className="text-xs font-black text-muted-foreground uppercase tracking-widest">Total to pay</p>
                                <p className="text-3xl font-black text-foreground">{amount.toLocaleString()} XAF</p>
                            </div>
                        </div>

                        <div className="bg-blue-600/5 p-4 rounded-2xl text-[11px] font-medium text-blue-600 leading-relaxed border border-blue-600/10">
                            💡 Tip: Quarterly and Yearly plans save you up to 30% on subscription costs!
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
