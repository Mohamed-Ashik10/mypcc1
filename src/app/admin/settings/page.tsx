"use client";
import { useEffect, useState } from "react";

// ─── Tab Types ─────────────────────────────────────────────────────────────────
type Tab = "general" | "email" | "notifications";

// ─── Icons ────────────────────────────────────────────────────────────────────
const IconSettings = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
        <circle cx="12" cy="12" r="3" />
    </svg>
);
const IconMail = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
);
const IconBell = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
);
const IconSave = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" /><path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7" /><path d="M7 3v4a1 1 0 0 0 1 1h7" />
    </svg>
);

// ─── Toggle Switch ─────────────────────────────────────────────────────────────
function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
    return (
        <button
            type="button"
            onClick={() => onChange(!checked)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${checked ? "bg-purple-600" : "bg-gray-600"}`}
        >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${checked ? "translate-x-6" : "translate-x-1"}`} />
        </button>
    );
}

// ─── Input Field ──────────────────────────────────────────────────────────────
function Field({ label, hint, type = "text", value, onChange, placeholder }: {
    label: string; hint?: string; type?: string;
    value: string; onChange: (v: string) => void; placeholder?: string;
}) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
            {hint && <p className="text-xs text-gray-500 mb-2">{hint}</p>}
            <input
                type={type}
                value={value}
                onChange={e => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition-colors"
            />
        </div>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState<Tab>("general");
    const [saving, setSaving] = useState(false);
    const [testingEmail, setTestingEmail] = useState(false);
    const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
    const [testEmailTo, setTestEmailTo] = useState("");

    // General settings
    const [appName, setAppName] = useState("Canticle");
    const [contactEmail, setContactEmail] = useState("");
    const [supportPhone, setSupportPhone] = useState("");
    const [churchAddress, setChurchAddress] = useState("");
    const [churchWebsite, setChurchWebsite] = useState("");

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

    // ── Load settings on mount ──────────────────────────────────────────────
    useEffect(() => {
        fetch("/api/settings")
            .then(r => r.json())
            .then((s: Record<string, string>) => {
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
            })
            .catch(() => { });
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
            };
            const res = await fetch("/api/settings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
            if (res.ok) showToast("Settings saved successfully.", "success");
            else showToast("Failed to save settings.", "error");
        } catch {
            showToast("Network error.", "error");
        } finally {
            setSaving(false);
        }
    };

    // ── Test email ──────────────────────────────────────────────────────────
    const handleTestEmail = async () => {
        if (!testEmailTo) { showToast("Enter a recipient email address.", "error"); return; }
        setTestingEmail(true);
        try {
            const res = await fetch("/api/settings", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ toEmail: testEmailTo }),
            });
            const data = await res.json();
            if (res.ok) showToast(data.message || "Test email sent!", "success");
            else showToast(data.error || "Failed to send test email.", "error");
        } catch {
            showToast("Network error.", "error");
        } finally {
            setTestingEmail(false);
        }
    };

    const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
        { id: "general", label: "General", icon: <IconSettings /> },
        { id: "email", label: "Email / SMTP", icon: <IconMail /> },
        { id: "notifications", label: "Notifications", icon: <IconBell /> },
    ];

    return (
        <div className="min-h-screen" style={{ background: "transparent" }}>
            {/* Toast */}
            {toast && (
                <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-xl text-sm font-medium transition-all ${toast.type === "success" ? "bg-green-900 border border-green-700 text-green-200" : "bg-red-900 border border-red-700 text-red-200"}`}>
                    <span>{toast.type === "success" ? "✓" : "✕"}</span>
                    {toast.msg}
                </div>
            )}

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-semibold text-white flex items-center gap-3">
                    <span className="p-2 rounded-lg bg-purple-900/40 text-purple-400"><IconSettings /></span>
                    Settings
                </h1>
                <p className="text-gray-400 text-sm mt-1">Configure your application, email, and notification preferences.</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
                {/* Sidebar Tabs */}
                <div className="lg:w-56 flex-shrink-0">
                    <nav className="bg-gray-900/60 border border-gray-800 rounded-xl p-2 flex flex-row lg:flex-col gap-1">
                        {tabs.map(t => (
                            <button
                                key={t.id}
                                onClick={() => setActiveTab(t.id)}
                                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all w-full text-left ${activeTab === t.id ? "bg-purple-600 text-white" : "text-gray-400 hover:bg-gray-800 hover:text-white"}`}
                            >
                                {t.icon}
                                <span className="hidden lg:inline">{t.label}</span>
                                <span className="inline lg:hidden text-xs">{t.label}</span>
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Content Panel */}
                <div className="flex-1 bg-gray-900/60 border border-gray-800 rounded-xl p-6 space-y-6">

                    {/* ── General Tab ── */}
                    {activeTab === "general" && (
                        <>
                            <div>
                                <h2 className="text-lg font-semibold text-white mb-1">General Settings</h2>
                                <p className="text-sm text-gray-500">Basic information about your application and church.</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <Field label="Application Name" placeholder="Canticle" value={appName} onChange={setAppName} />
                                <Field label="Contact Email" type="email" placeholder="hello@canticle.app" value={contactEmail} onChange={setContactEmail} />
                                <Field label="Support Phone" placeholder="+237 000 000 000" value={supportPhone} onChange={setSupportPhone} />
                                <Field label="Church Website" placeholder="https://yourchurch.com" value={churchWebsite} onChange={setChurchWebsite} />
                                <div className="md:col-span-2">
                                    <Field label="Church Address" placeholder="123 Faith Avenue, Cameroon" value={churchAddress} onChange={setChurchAddress} />
                                </div>
                            </div>
                        </>
                    )}

                    {/* ── Email / SMTP Tab ── */}
                    {activeTab === "email" && (
                        <>
                            <div>
                                <h2 className="text-lg font-semibold text-white mb-1">Email / SMTP Settings</h2>
                                <p className="text-sm text-gray-500">Configure the mail server used for password resets, welcome emails, and notifications.</p>
                            </div>

                            {/* Info box */}
                            <div className="bg-blue-950/50 border border-blue-800/40 rounded-lg p-4 text-sm text-blue-300">
                                💡 <strong>Tip:</strong> Use Gmail SMTP: host <code>smtp.gmail.com</code>, port <code>587</code>, and an <a href="https://myaccount.google.com/apppasswords" target="_blank" className="underline">App Password</a> for the password field.
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <Field label="SMTP Host" placeholder="smtp.gmail.com" value={smtpHost} onChange={setSmtpHost} />
                                <Field label="SMTP Port" placeholder="587" value={smtpPort} onChange={setSmtpPort} />
                                <Field label="SMTP Username" placeholder="your@gmail.com" value={smtpUser} onChange={setSmtpUser} />
                                <Field label="SMTP Password" type="password" placeholder="••••••••••••" value={smtpPass} onChange={setSmtpPass}
                                    hint="Use an App Password if using Gmail" />
                                <Field label="From Name" placeholder="Canticle" value={smtpFromName} onChange={setSmtpFromName} />
                                <Field label="From Email Address" type="email" placeholder="noreply@canticle.app" value={smtpFromEmail} onChange={setSmtpFromEmail} />
                            </div>

                            {/* Test Email */}
                            <div className="border border-dashed border-gray-700 rounded-xl p-5">
                                <h3 className="text-sm font-semibold text-white mb-1">Send Test Email</h3>
                                <p className="text-xs text-gray-500 mb-4">Verify your SMTP configuration by sending a test email. Save settings first.</p>
                                <div className="flex gap-3 flex-wrap">
                                    <input
                                        type="email"
                                        value={testEmailTo}
                                        onChange={e => setTestEmailTo(e.target.value)}
                                        placeholder="recipient@example.com"
                                        className="flex-1 min-w-[200px] bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition-colors"
                                    />
                                    <button
                                        onClick={handleTestEmail}
                                        disabled={testingEmail}
                                        className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-700 hover:bg-blue-600 text-white text-sm font-medium transition-colors disabled:opacity-50"
                                    >
                                        <IconMail />
                                        {testingEmail ? "Sending…" : "Send Test Email"}
                                    </button>
                                </div>
                            </div>
                        </>
                    )}

                    {/* ── Notifications Tab ── */}
                    {activeTab === "notifications" && (
                        <>
                            <div>
                                <h2 className="text-lg font-semibold text-white mb-1">Notification Settings</h2>
                                <p className="text-sm text-gray-500">Control which automated emails are sent to users. SMTP must be configured first.</p>
                            </div>
                            <div className="space-y-4">
                                {[
                                    { label: "Welcome Email on Signup", desc: "Send a welcome email when a new user registers.", checked: notifyWelcome, onChange: setNotifyWelcome },
                                    { label: "Password Reset Emails", desc: "Send email when a user requests a password reset.", checked: notifyPasswordReset, onChange: setNotifyPasswordReset },
                                    { label: "New Subscription Alert", desc: "Notify admin when a user subscribes to a plan.", checked: notifyNewSub, onChange: setNotifyNewSub },
                                    { label: "Daily Devotional Email", desc: "Email today's devotional to all subscribers every morning.", checked: notifyDevoEmail, onChange: setNotifyDevoEmail },
                                ].map(item => (
                                    <div key={item.label} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl border border-gray-700/50">
                                        <div>
                                            <p className="text-sm font-medium text-white">{item.label}</p>
                                            <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                                        </div>
                                        <Toggle checked={item.checked} onChange={item.onChange} />
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    {/* Save Button */}
                    <div className="pt-4 border-t border-gray-800 flex justify-end">
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium transition-colors disabled:opacity-50"
                        >
                            <IconSave />
                            {saving ? "Saving…" : "Save Settings"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
