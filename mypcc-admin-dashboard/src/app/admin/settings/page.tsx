"use client";
import { useEffect, useState } from "react";
import { Settings, Mail, Bell, Save, ShieldCheck, Send, Globe, MapPin, Phone, Info, UploadCloud } from "lucide-react";
import { useRouter } from "next/navigation";

import { BACKEND_URL, uploadToBackend, fetchFromBackend } from "@/lib/api";

// ─── Tab Types ─────────────────────────────────────────────────────────────────
type Tab = "general" | "branding" | "appearance" | "email" | "notifications";

// ─── Toggle Switch ─────────────────────────────────────────────────────────────
function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
    return (
        <button
            type="button"
            onClick={() => onChange(!checked)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 ${checked ? "bg-primary" : "bg-[#dbdade]"}`}
        >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-300 ${checked ? "translate-x-6" : "translate-x-1"}`} />
        </button>
    );
}

// ─── Input Field ──────────────────────────────────────────────────────────────
function Field({ label, hint, type = "text", value, onChange, placeholder, onUpload }: {
    label: string; hint?: string; type?: string;
    value: string; onChange: (v: string) => void; placeholder?: string;
    onUpload?: (url: string) => void;
}) {
    const [uploading, setUploading] = useState(false);
    return (
        <div className="space-y-1.5">
            <label className="text-[11px] font-black text-[#5d596c] uppercase tracking-widest">{label}</label>
            <div className="flex gap-2">
                <input
                    type={type}
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    placeholder={placeholder}
                    className="flex-1 bg-white border border-[#dbdade] rounded-xl px-4 py-2.5 text-[13px] text-[#5d596c] placeholder-[#dbdade] focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all outline-none"
                />
                {onUpload && (
                    <button
                        type="button"
                        className="p-2.5 bg-primary/5 text-primary border border-primary/10 rounded-xl hover:bg-primary hover:text-white transition-all relative overflow-hidden flex items-center justify-center min-w-[40px] disabled:opacity-50"
                        title="Upload File"
                        disabled={uploading}
                    >
                        <input
                            type="file"
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            accept="image/*"
                            onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                setUploading(true);
                                try {
                                    const data = await uploadToBackend(file);
                                    if (data.url) onUpload(data.url);
                                } catch (err) {
                                    console.error("Upload error:", err);
                                } finally {
                                    setUploading(false);
                                }
                            }}
                        />
                        {uploading ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
                        ) : (
                            <UploadCloud size={18} />
                        )}
                    </button>
                )}
            </div>
            {hint && <p className="text-[10px] text-[#a5a3ae] font-bold italic opacity-70">{hint}</p>}
        </div>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function SettingsPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<Tab>("general");
    const [saving, setSaving] = useState(false);
    const [testingEmail, setTestingEmail] = useState(false);
    const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
    const [testEmailTo, setTestEmailTo] = useState("");
    const [isDbLoaded, setIsDbLoaded] = useState(false);

    // General settings
    const [appName, setAppName] = useState("Canticle");
    const [sidebarTitle, setSidebarTitle] = useState("Canticle");
    const [contactEmail, setContactEmail] = useState("");
    const [supportPhone, setSupportPhone] = useState("");
    const [churchAddress, setChurchAddress] = useState("");
    const [churchWebsite, setChurchWebsite] = useState("");
    const [footerDesc, setFooterDesc] = useState("");

    // Email / SMTP settings
    const [smtpHost, setSmtpHost] = useState("");
    const [smtpPort, setSmtpPort] = useState("587");
    const [smtpUser, setSmtpUser] = useState("");
    const [smtpPass, setSmtpPass] = useState("");
    const [smtpFromName, setSmtpFromName] = useState("Canticle");
    const [smtpFromEmail, setSmtpFromEmail] = useState("");

    // Notification toggles
    const [notifyWelcome, setNotifyWelcome] = useState(true);
    const [notifyDevoEmail, setNotifyDevoEmail] = useState(false);
    const [notifyNewSub, setNotifyNewSub] = useState(true);
    const [notifyPasswordReset, setNotifyPasswordReset] = useState(true);

    // Branding settings
    const [logoAdmin, setLogoAdmin] = useState("/logo.png");
    const [logoApp, setLogoApp] = useState("/logo.png");
    const [logoPrint, setLogoPrint] = useState("/logo.png");

    // ── Appearance settings ────────────────────────────────────────────────
    const [themePreset, setThemePreset] = useState("default");
    const [loginBg, setLoginBg] = useState("");
    const [adminLoginBg, setAdminLoginBg] = useState("");

    // ── Theme Matrix Mapping ────────────────────────────────────────────────
    const themeMatrix: Record<string, string> = {
        white: "--primary: 221.2 83.2% 53.3%; --primary-foreground: 210 40% 98%; --accent: 210 40% 96.1%;",
        red: "--primary: 0 72.2% 50.6%; --primary-foreground: 0 85.7% 97.3%; --accent: 0 0% 96.1%;",
        blue: "--primary: 199 89% 48%; --primary-foreground: 210 40% 98%; --accent: 210 40% 96.1%;",
        gray: "--primary: 215 25% 27%; --primary-foreground: 210 40% 98%; --accent: 210 40% 96.1%;",
        default: "--primary: 283 74% 35%; --primary-foreground: 210 40% 98%; --accent: 255 0% 96%;",
        emerald: "--primary: 142.1 76.2% 36.3%; --primary-foreground: 355.7 100% 97.3%; --accent: 142.1 76.2% 90%;",
        teal: "--primary: 171 100% 29%; --primary-foreground: 0 0% 100%; --accent: 171 100% 90%;",
        rose: "--primary: 346.8 77.2% 49.8%; --primary-foreground: 0 0% 100%; --accent: 346.8 77.2% 90%;",
        amber: "--primary: 38 92% 50%; --primary-foreground: 0 0% 100%; --accent: 38 92% 90%;",
        brown: "--primary: 25 76% 31%; --primary-foreground: 0 0% 100%; --accent: 25 76% 90%;"
    };

    // ── Preview theme instantly ─────────────────────────────────────────────
    useEffect(() => {
        if (!isDbLoaded) return; // Prevent overwriting accurate SSR layout before API resolves
        const styles = themeMatrix[themePreset] || themeMatrix.default;
        window.dispatchEvent(new CustomEvent("system-theme-updated", { detail: { styles } }));
    }, [themePreset, isDbLoaded]);

    // ── Load settings on mount ──────────────────────────────────────────────
    useEffect(() => {
        fetch("/api/admin/settings")
            .then(res => res.json())
            .then((s) => {
                if (s.app_name) setAppName(s.app_name);
                if (s.contact_email) setContactEmail(s.contact_email);
                if (s.support_phone) setSupportPhone(s.support_phone);
                if (s.church_address) setChurchAddress(s.church_address);
                if (s.church_website) setChurchWebsite(s.church_website);
                if (s.smtp_host) setSmtpHost(s.smtp_host);
                if (s.smtp_port) setSmtpPort(s.smtp_port);
                if (s.smtp_user) setSmtpUser(s.smtp_user);
                if (s.smtp_pass) setSmtpPass(s.smtp_pass);
                if (s.smtp_from_name) setSmtpFromName(s.smtp_from_name);
                if (s.smtp_from_email) setSmtpFromEmail(s.smtp_from_email);
                if (s.notify_welcome !== undefined) setNotifyWelcome(s.notify_welcome === "true");
                if (s.notify_devo_email !== undefined) setNotifyDevoEmail(s.notify_devo_email === "true");
                if (s.notify_new_sub !== undefined) setNotifyNewSub(s.notify_new_sub === "true");
                if (s.notify_password_reset !== undefined) setNotifyPasswordReset(s.notify_password_reset === "true");
                
                if (s.logo_admin) setLogoAdmin(s.logo_admin);
                if (s.logo_app) setLogoApp(s.logo_app);
                if (s.logo_print) setLogoPrint(s.logo_print);
                if (s.theme_preset) setThemePreset(s.theme_preset);
                if (s.login_bg) setLoginBg(s.login_bg);
                if (s.admin_login_bg) setAdminLoginBg(s.admin_login_bg);
                if (s.footer_desc) setFooterDesc(s.footer_desc);
                if (s.sidebar_title) setSidebarTitle(s.sidebar_title);
            })
            .catch(() => { })
            .finally(() => setIsDbLoaded(true));
    }, []);

    const showToast = (msg: string, type: "success" | "error") => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 4000);
    };

    // ── Save settings ───────────────────────────────────────────────────────
    const handleSave = async () => {
        setSaving(true);

        try {
            const payload: Record<string, string> = {
                app_name: appName, contact_email: contactEmail,
                support_phone: supportPhone, church_address: churchAddress,
                church_website: churchWebsite,
                smtp_host: smtpHost, smtp_port: smtpPort,
                smtp_user: smtpUser, smtp_pass: smtpPass,
                smtp_from_name: smtpFromName, smtp_from_email: smtpFromEmail,
                notify_welcome: String(notifyWelcome),
                notify_devo_email: String(notifyDevoEmail),
                notify_new_sub: String(notifyNewSub),
                notify_password_reset: String(notifyPasswordReset),
                logo_admin: logoAdmin,
                logo_app: logoApp,
                logo_print: logoPrint,
                theme_preset: themePreset,
                login_bg: loginBg,
                admin_login_bg: adminLoginBg,
                footer_desc: footerDesc,
                sidebar_title: sidebarTitle,
            };

            const res = await fetch("/api/admin/settings", { 
                method: "POST", 
                body: JSON.stringify(payload) 
            });
            if (!res.ok) throw new Error(await res.text());

            showToast("Settings synchronized successfully.", "success");
            router.refresh();
        } catch (err: any) {
            // Show actual error — TiDB can be slow so we now have 30s timeout
            showToast(err?.message || "Save failed. The database may be slow — try again.", "error");
        } finally {
            setSaving(false);
        }
    };

    // ── Test email ──────────────────────────────────────────────────────────
    const handleTestEmail = async () => {
        if (!testEmailTo) { showToast("Recipient address required.", "error"); return; }
        setTestingEmail(true);
        try {
            const res = await fetch("/api/admin/settings/test-email", {
                method: "PUT",
                body: JSON.stringify({ toEmail: testEmailTo }),
            });
            if (!res.ok) throw new Error(await res.text());
            const data: any = await res.json();
            showToast(data.message || "Test broadcast dispatched!", "success");
        } catch (err: any) {
            showToast(err.message || "Broadcast delivery failed.", "error");
        } finally {
            setTestingEmail(false);
        }
    };

    const tabs: { id: Tab; label: string; icon: any }[] = [
        { id: "general", label: "General Ledger", icon: Settings },
        { id: "branding", label: "Brand Identity", icon: Globe },
        { id: "appearance", label: "Visual Theme", icon: Info },
        { id: "email", label: "SMTP Gateway", icon: Mail },
        { id: "notifications", label: "Alert Matrix", icon: Bell },
    ];

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500 pb-20">
            {/* Toast Notification */}
            {toast && (
                <div className={`fixed top-8 right-8 z-[100] flex items-center gap-4 px-6 py-4 rounded-2xl shadow-2xl border-2 transition-all animate-in slide-in-from-right-10 duration-300 ${toast.type === "success" ? "bg-emerald-50 border-emerald-500/20 text-emerald-700" : "bg-red-50 border-red-500/20 text-red-700"}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${toast.type === "success" ? "bg-emerald-500 text-white" : "bg-red-500 text-white"}`}>
                        {toast.type === "success" ? <ShieldCheck size={18} /> : <div className="text-sm font-black">!</div>}
                    </div>
                    <div>
                        <p className="text-[12px] font-black uppercase tracking-widest leading-none mb-1">System Message</p>
                        <p className="text-[13px] font-bold">{toast.msg}</p>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-[26px] font-black text-primary tracking-tighter uppercase leading-none mb-2">Vault & System Preferences</h1>
                    <div className="flex items-center gap-2 text-[11px] font-bold text-[#a5a3ae] uppercase tracking-widest">
                        <Settings size={12} className="text-primary" />
                        <span>Governing application infrastructure and digital gateway configurations</span>
                    </div>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-primary/5 text-primary border border-primary/10 rounded-xl">
                    <ShieldCheck size={16} />
                    <span className="text-[10px] font-black uppercase tracking-widest leading-none">High Security Access Granted</span>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-10">
                {/* Sidebar Navigation */}
                <div className="lg:w-72 flex-shrink-0">
                    <nav className="bg-white border border-[#dbdade]/50 rounded-[2rem] p-4 space-y-2 shadow-sm sticky top-24">
                        {tabs.map(t => (
                            <button
                                key={t.id}
                                onClick={() => setActiveTab(t.id)}
                                className={`flex items-center gap-4 px-5 py-4 rounded-[1.25rem] text-[11px] font-black uppercase tracking-widest transition-all w-full text-left ${activeTab === t.id ? "bg-primary text-white shadow-lg shadow-primary/30 -translate-y-0.5" : "text-[#a5a3ae] hover:bg-primary/5 hover:text-primary"}`}
                            >
                                <t.icon size={18} />
                                <span>{t.label}</span>
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Main Settings Panel */}
                <div className="flex-1 space-y-8">
                    <div className="bg-white rounded-[2.5rem] border border-[#dbdade]/50 shadow-sm p-10 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none" />
                        
                        {/* ── General Content ── */}
                        {activeTab === "general" && (
                            <div className="space-y-8 relative z-10 transition-all">
                                <div>
                                    <h2 className="text-[20px] font-black text-[#5d596c] tracking-tight mb-1 uppercase">Institutional Identity</h2>
                                    <p className="text-[11px] font-bold text-[#a5a3ae] uppercase tracking-widest">Define the primary characteristics of your digital ministry</p>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <Field label="Platform Branding" placeholder="Canticle" value={appName} onChange={setAppName} hint="The primary name displayed throughout the portal" />
                                    <Field label="Sidebar Title" placeholder="Canticle" value={sidebarTitle} onChange={setSidebarTitle} hint="The brand title displayed in the admin sidebar" />
                                    <Field label="Official Contact Email" type="email" placeholder="hello@canticle.app" value={contactEmail} onChange={setContactEmail} />
                                    <Field label="Support Line" placeholder="+237 000 000 000" value={supportPhone} onChange={setSupportPhone} />
                                    <Field label="Ministry Web Repository" placeholder="https://yourchurch.com" value={churchWebsite} onChange={setChurchWebsite} />
                                    <div className="md:col-span-2">
                                        <Field label="Canonical Church Address" placeholder="123 Faith Avenue, Cameroon" value={churchAddress} onChange={setChurchAddress} />
                                    </div>
                                    <div className="md:col-span-2">
                                        <div className="space-y-1.5">
                                            <label className="text-[11px] font-black text-[#5d596c] uppercase tracking-widest text-[#5d596c]">Landing Footer Description</label>
                                            <textarea 
                                                value={footerDesc}
                                                onChange={e => setFooterDesc(e.target.value)}
                                                placeholder="A sacred digital space for believers to read hymns, keep a spiritual diary, and grow daily in faith."
                                                className="w-full bg-white border border-[#dbdade] rounded-xl px-4 py-3 text-[13px] text-[#5d596c] focus:border-primary outline-none min-h-[100px] resize-none"
                                            />
                                            <p className="text-[10px] text-[#a5a3ae] font-bold italic opacity-70 uppercase tracking-wider">This mission statement appears in the footer of your public website.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ── Branding Content ── */}
                        {activeTab === "branding" && (
                            <div className="space-y-8 relative z-10 transition-all">
                                <div>
                                    <h2 className="text-[20px] font-black text-[#5d596c] tracking-tight mb-1 uppercase">Visual Assets & Branding</h2>
                                    <p className="text-[11px] font-bold text-[#a5a3ae] uppercase tracking-widest">Manage your organization's logos across different environments</p>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <Field label="Admin Dashboard Logo" placeholder="URL or click icon ->" value={logoAdmin} onChange={setLogoAdmin} onUpload={setLogoAdmin} hint="Displayed in the top bar and sidebar" />
                                        <div className="w-20 h-20 bg-white rounded-2xl border border-[#dbdade]/50 p-2 overflow-hidden flex items-center justify-center shadow-inner">
                                            <img src={logoAdmin || "/logo.png"} alt="Preview" className="max-w-full max-h-full object-contain" onError={(e) => (e.currentTarget.src = "/logo.png")} />
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <Field label="Public Application Logo" placeholder="URL or click icon ->" value={logoApp} onChange={setLogoApp} onUpload={setLogoApp} hint="Displayed on the public website and landing page" />
                                        <div className="w-20 h-20 bg-white rounded-2xl border border-[#dbdade]/50 p-2 overflow-hidden flex items-center justify-center shadow-inner">
                                            <img src={logoApp || "/logo.png"} alt="Preview" className="max-w-full max-h-full object-contain" onError={(e) => (e.currentTarget.src = "/logo.png")} />
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <Field label="Print & Reporting Logo" placeholder="URL or click icon ->" value={logoPrint} onChange={setLogoPrint} onUpload={setLogoPrint} hint="High-resolution logo for PDF exports and printed reports" />
                                        <div className="w-20 h-20 bg-white rounded-2xl border border-[#dbdade]/50 p-2 overflow-hidden flex items-center justify-center shadow-inner">
                                            <img src={logoPrint || "/logo.png"} alt="Preview" className="max-w-full max-h-full object-contain" onError={(e) => (e.currentTarget.src = "/logo.png")} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ── Appearance Content ── */}
                        {activeTab === "appearance" && (
                            <div className="space-y-8 relative z-10 transition-all">
                                <div>
                                    <h2 className="text-[20px] font-black text-[#5d596c] tracking-tight mb-1 uppercase">Aesthetics & Environment</h2>
                                    <p className="text-[11px] font-bold text-[#a5a3ae] uppercase tracking-widest">Define the visual persona and login entry points of the platform</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-black text-[#5d596c] uppercase tracking-widest">Admin Backend Preset</label>
                                        <select 
                                            value={themePreset} 
                                            onChange={(e) => setThemePreset(e.target.value)}
                                            className="w-full bg-white border border-[#dbdade] rounded-xl px-4 py-2.5 text-[13px] text-[#5d596c] focus:border-primary outline-none transition-all"
                                        >
                                            <option value="white">White (Clean)</option>
                                            <option value="default">Default (Corporate)</option>
                                            <option value="red">Sacred Red (Ceremonial)</option>
                                            <option value="blue">Heavenly Blue (Peace)</option>
                                            <option value="gray">Industrial Gray (Formal)</option>
                                            <option value="emerald">Emerald Green (Life)</option>
                                            <option value="teal">Ocean Teal (Depth)</option>
                                            <option value="rose">Desert Rose (Warmth)</option>
                                            <option value="amber">Warm Amber (Light)</option>
                                            <option value="brown">Leather Brown (Earthy)</option>
                                        </select>
                                        <p className="text-[10px] text-[#a5a3ae] font-bold italic opacity-70">Applies a primary color matrix to the entire administrative portal</p>
                                    </div>

                                    <div className="md:col-span-1" />

                                    <div className="space-y-4">
                                        <Field label="User Login Background" placeholder="URL or click icon ->" value={loginBg} onChange={setLoginBg} onUpload={setLoginBg} hint="Background visual for the public member login screen" />
                                        <div className="aspect-video w-full bg-[#f8f7fa] rounded-2xl border border-[#dbdade]/50 overflow-hidden relative shadow-inner">
                                            {loginBg ? <img src={loginBg} className="w-full h-full object-cover" /> : <div className="flex items-center justify-center h-full text-[#a5a3ae] text-[10px] font-black uppercase">Background Default</div>}
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <Field label="Admin Login Background" placeholder="URL or click icon ->" value={adminLoginBg} onChange={setAdminLoginBg} onUpload={setAdminLoginBg} hint="Custom background for the backend administration entry" />
                                        <div className="aspect-video w-full bg-[#f8f7fa] rounded-2xl border border-[#dbdade]/50 overflow-hidden relative shadow-inner">
                                            {adminLoginBg ? <img src={adminLoginBg} className="w-full h-full object-cover" /> : <div className="flex items-center justify-center h-full text-[#a5a3ae] text-[10px] font-black uppercase">Background Default</div>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ── Email / SMTP Content ── */}
                        {activeTab === "email" && (
                            <div className="space-y-8 relative z-10 transition-all">
                                <div>
                                    <h2 className="text-[20px] font-black text-[#5d596c] tracking-tight mb-1 uppercase">Broadcast Infrastructure</h2>
                                    <p className="text-[11px] font-bold text-[#a5a3ae] uppercase tracking-widest">Configure SMTP protocols for digital outreach and delivery</p>
                                </div>

                                <div className="bg-primary/5 border border-primary/10 rounded-2xl p-6 flex gap-4 items-start">
                                    <Info className="text-primary shrink-0" size={24} />
                                    <div className="text-[13px] text-[#5d596c] font-medium leading-relaxed">
                                        <strong className="block text-primary font-black uppercase text-[10px] tracking-widest mb-1">Gateway Optimization:</strong> 
                                        For standardized delivery via Google: utilize host <code>smtp.gmail.com</code> and port <code>587</code>. Ensure "App Passwords" are active in your security vault.
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <Field label="Gateway Server" placeholder="smtp.gmail.com" value={smtpHost} onChange={setSmtpHost} />
                                    <Field label="Communication Port" placeholder="587" value={smtpPort} onChange={setSmtpPort} />
                                    <Field label="Authorized User" placeholder="your@gmail.com" value={smtpUser} onChange={setSmtpUser} />
                                    <Field label="Secret Vault Password" type="password" placeholder="••••••••••••" value={smtpPass} onChange={setSmtpPass} hint="Encrypted system-level credential" />
                                    <Field label="Origin Alias" placeholder="Canticle" value={smtpFromName} onChange={setSmtpFromName} />
                                    <Field label="Origin Email" type="email" placeholder="noreply@canticle.app" value={smtpFromEmail} onChange={setSmtpFromEmail} />
                                </div>

                                <div className="bg-[#f8f7fa] rounded-[2rem] p-8 border border-dashed border-[#dbdade]">
                                    <h3 className="text-[12px] font-black text-[#5d596c] mb-1 uppercase tracking-widest">Protocol Testing</h3>
                                    <p className="text-[11px] font-bold text-[#a5a3ae] mb-6 uppercase tracking-widest">Verify the integrity of the communication gateway</p>
                                    <div className="flex gap-4 flex-wrap">
                                        <input
                                            type="email"
                                            value={testEmailTo}
                                            onChange={e => setTestEmailTo(e.target.value)}
                                            placeholder="Recipient Address..."
                                            className="flex-1 min-w-[240px] bg-white border border-[#dbdade] rounded-[1.25rem] px-5 py-3 text-[13px] text-[#5d596c] outline-none focus:border-primary transition-all"
                                        />
                                        <button
                                            onClick={handleTestEmail}
                                            disabled={testingEmail}
                                            className="flex items-center gap-3 px-8 py-3 rounded-[1.25rem] bg-[#5d596c] hover:bg-primary text-white text-[11px] font-black uppercase tracking-widest transition-all disabled:opacity-50 shadow-lg shadow-[#5d596c]/20"
                                        >
                                            <Send size={16} />
                                            {testingEmail ? "Broadcasting…" : "Send Test Dispatch"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ── Notifications Content ── */}
                        {activeTab === "notifications" && (
                            <div className="space-y-8 relative z-10 transition-all">
                                <div>
                                    <h2 className="text-[20px] font-black text-[#5d596c] tracking-tight mb-1 uppercase">Automated Alert Matrix</h2>
                                    <p className="text-[11px] font-bold text-[#a5a3ae] uppercase tracking-widest">Manage trigger points for system-generated spiritual engagement</p>
                                </div>
                                <div className="grid gap-6">
                                    {[
                                        { label: "New Disciple Greeting", desc: "Automated welcome transmission upon registration", checked: notifyWelcome, onChange: setNotifyWelcome },
                                        { label: "Credentials Recovery", desc: "Security dispatch for lost password protocols", checked: notifyPasswordReset, onChange: setNotifyPasswordReset },
                                        { label: "Patronage Notification", desc: "Instant alert regarding new membership commitments", checked: notifyNewSub, onChange: setNotifyNewSub },
                                        { label: "Manna Synchronization", desc: "Cyclic distribution of daily devotions to the flock", checked: notifyDevoEmail, onChange: setNotifyDevoEmail },
                                    ].map(item => (
                                        <div key={item.label} className="bg-[#f8f7fa] rounded-[1.5rem] p-6 border border-[#dbdade]/50 flex items-center justify-between group hover:border-primary/30 transition-all">
                                            <div className="flex items-center gap-5">
                                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${item.checked ? 'bg-primary/10 text-primary' : 'bg-white text-[#dbdade]'}`}>
                                                    <Bell size={20} />
                                                </div>
                                                <div>
                                                    <p className="text-[14px] font-black text-[#5d596c] leading-none mb-1 group-hover:text-primary transition-colors">{item.label}</p>
                                                    <p className="text-[11px] font-bold text-[#a5a3ae] uppercase tracking-[0.1em]">{item.desc}</p>
                                                </div>
                                            </div>
                                            <Toggle checked={item.checked} onChange={item.onChange} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Save Trigger */}
                        <div className="mt-12 pt-8 border-t border-[#dbdade]/30 flex justify-end">
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="group flex items-center gap-3 px-10 py-4 rounded-[1.5rem] bg-primary text-white text-[12px] font-black uppercase tracking-widest shadow-2xl shadow-primary/40 hover:-translate-y-1 transition-all disabled:opacity-50"
                            >
                                <Save size={18} className="group-hover:rotate-12 transition-transform" />
                                {saving ? "Synchronizing Vault…" : "Apply System Preferences"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
