"use client"

import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";
import "./landing_styles.css";

interface LandingPageClientProps {
    session?: any;
    initialHymns: any[];
    initialEcho?: any[];
    initialDevotional?: any | null;
    initialArchive?: any[];
    initialDiary?: any[];
    initialUserDiary?: any[];
    initialAnnouncements?: any[];
    initialTestimonials?: any[];
    initialFavorites?: string[];
    isPaywallActive?: boolean;
    subscriptionType?: string | null;
    appName?: string;
    logoApp?: string;
    footerDesc?: string;
    contactEmail?: string;
}

// ─── SVG Icon Components ──────────────────────────────────────────────────────

const SvgHome = ({ size = 16 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}>
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
);

const SvgMusic = ({ size = 16 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}>
        <path d="M9 18V5l12-2v13" />
        <circle cx="6" cy="18" r="3" />
        <circle cx="18" cy="16" r="3" />
    </svg>
);

const SvgCross = ({ size = 16 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}>
        <line x1="12" y1="2" x2="12" y2="22" />
        <line x1="5" y1="8" x2="19" y2="8" />
    </svg>
);

const SvgBook = ({ size = 16 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}>
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
);

const SvgNewspaper = ({ size = 16 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}>
        <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
        <path d="M18 14h-8" /><path d="M15 18h-5" />
        <path d="M10 6h8v4h-8V6z" />
    </svg>
);

const SvgPray = ({ size = 16 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}>
        <path d="M18 11V6a2 2 0 0 0-2-2 2 2 0 0 0-2 2" />
        <path d="M14 10V4a2 2 0 0 0-2-2 2 2 0 0 0-2 2v2" />
        <path d="M10 10.5V6a2 2 0 0 0-2-2 2 2 0 0 0-2 2v8" />
        <path d="M18 11a2 2 0 1 1 4 0v3a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" />
    </svg>
);
const SvgCard = ({ size = 16 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}>
        <rect width="20" height="14" x="2" y="5" rx="2" />
        <line x1="2" x2="22" y1="10" y2="10" />
    </svg>
);

const SvgSparkle = ({ size = 16 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}>
        <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
        <path d="M5 3v4" /><path d="M19 17v4" />
        <path d="M3 5h4" /><path d="M17 19h4" />
    </svg>
);

// ─────────────────────────────────────────────────────────────────────────────

export default function LandingPageClient({
    session,
    initialHymns = [],
    initialEcho = [],
    initialDevotional = null,
    initialArchive = [],
    initialDiary = [],
    initialUserDiary = [],
    initialAnnouncements = [],
    initialTestimonials = [],
    initialFavorites = [],
    isPaywallActive = true,
    subscriptionType = null,
    appName = "Canticle",
    logoApp = "/logo.png",
    footerDesc = "A sacred digital space for believers to read hymns, keep a spiritual diary, and grow daily in faith.",
    contactEmail = "hello@canticle.app"
}: LandingPageClientProps) {
    const [favorites, setFavorites] = useState<string[]>(initialFavorites);
    const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        (window as any).hymnFavorites = favorites;
        (window as any).refreshFavoritesModal = () => {
            setFavorites([...((window as any).hymnFavorites || [])]);
        };
    }, [favorites]);

    useEffect(() => {
        // Inject initial data for the legacy script
        (window as any).hymns_db = initialHymns;
        (window as any).echo_db = initialEcho;
        (window as any).diary_db_official = initialDiary;
        (window as any).diary_db_personal = initialUserDiary;
        (window as any).archive_db = initialArchive;
        (window as any).devotional_db = initialDevotional;
        (window as any).diary_db = initialDiary;
        (window as any).announcements_db = initialAnnouncements;
        (window as any).isPaywallActive = isPaywallActive;
        (window as any).subscriptionType = subscriptionType;
        (window as any).userSession = session;

        // Load external logic script on mount, making sure it isn't loaded twice in Dev environment
        const scriptId = "canticle-logic-script";
        if (!document.getElementById(scriptId)) {
            const script = document.createElement("script");
            script.id = scriptId;
            script.src = `/canticle_logic_v2.js?v=${Date.now()}`;
            script.async = true;
            document.body.appendChild(script);
        } else {
            // If already loaded, just re-trigger the initial renders since data might have changed
            if (typeof (window as any).renderHymns === 'function') {
                (window as any).renderHymns(initialHymns);
                (window as any).renderDiary(initialDiary);
                (window as any).renderEcho();
                (window as any).renderDevotional && (window as any).renderDevotional();
            }
        }

        return () => {
            // Do not remove the script here, as Next.js navigation might rely on it persisting,
            // or we will just let it live for the lifecycle of the SPA.
        };
    }, [initialHymns, initialEcho, initialDevotional, initialArchive, initialDiary, initialAnnouncements]);

    return (
        <div className="landing-body">
            {/* ══ NAV ══ */}
            <div id="scrollBar"></div>
            <div id="parallaxCross">✝</div>
            <nav className="landing-nav">
                <a className="logo" href="#">{appName.substring(0, Math.max(0, appName.length - 3))}<span>{appName.substring(Math.max(0, appName.length - 3))}</span></a>
                
                {/* Mobile Menu Button */}
                <button 
                    className="mobile-menu-toggle"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    style={{ 
                        display: 'none', 
                        background: 'transparent', 
                        border: 'none', 
                        color: 'var(--ink)', 
                        cursor: 'pointer',
                        padding: '8px'
                    }}
                >
                    {isMobileMenuOpen ? (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    ) : (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
                    )}
                </button>

                <div className="nav-tabs">
                    <button className="nav-tab active" onClick={(e) => (window as any).showPage('home', e.currentTarget)}><SvgHome size={15} /> Home<div className="dot"></div></button>
                    <button className="nav-tab" onClick={(e) => (window as any).showPage('hymns', e.currentTarget)}><SvgMusic size={15} /> Hymns<div className="dot"></div></button>
                    <button className="nav-tab" onClick={(e) => (window as any).showPage('diary', e.currentTarget)}><SvgBook size={15} /> Church Diary<div className="dot"></div></button>
                    <button className="nav-tab" onClick={(e) => (window as any).showPage('echo', e.currentTarget)}><SvgNewspaper size={15} /> The Echo<div className="dot"></div></button>
                    <button className="nav-tab" onClick={(e) => (window as any).showPage('devo', e.currentTarget)}><SvgPray size={15} /> Devotionals<div className="dot"></div></button>
                    <button className="nav-tab" onClick={(e) => (window as any).showPage('subs', e.currentTarget)}>
                        <SvgCard size={15} /> Subscriptions 
                        {subscriptionType && <span className="ml-1 text-[8px] animate-pulse">✨</span>}
                        <div className="dot"></div>
                    </button>
                </div>
                <div className="nav-right" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <button
                        title="Global Master Search"
                        onClick={() => (window as any).openMasterSearch && (window as any).openMasterSearch()}
                        style={{
                            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                            width: '32px', height: '32px', borderRadius: '8px',
                            background: 'rgba(0, 0, 0, 0.05)', color: 'var(--ink)',
                            border: '1px solid rgba(0, 0, 0, 0.1)',
                            cursor: 'pointer', flexShrink: 0,
                            transition: 'all .2s'
                        }}
                        onMouseOver={(e:any) => e.currentTarget.style.background='rgba(0, 0, 0, 0.1)'}
                        onMouseOut={(e:any) => e.currentTarget.style.background='rgba(0, 0, 0, 0.05)'}
                    >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                    </button>
                    {session ? (
                        <>
                            <button
                                title="My Profile"
                                onClick={() => (window as any).renderProfileHub && (window as any).renderProfileHub()}
                                style={{
                                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                                    width: '32px', height: '32px', borderRadius: '8px',
                                    background: 'rgba(184,147,90,0.15)', color: 'var(--gold)',
                                    border: '1px solid rgba(184,147,90,0.3)',
                                    cursor: 'pointer', flexShrink: 0,
                                    transition: 'all .2s', fontSize: '14px'
                                }}
                                onMouseOver={(e:any) => {e.currentTarget.style.background='var(--gold)'; e.currentTarget.style.color='#1a1510';}}
                                onMouseOut={(e:any) => {e.currentTarget.style.background='rgba(184,147,90,0.15)'; e.currentTarget.style.color='var(--gold)';}}
                            >
                                👤
                            </button>
                            {subscriptionType && (
                                <button 
                                    onClick={() => (window as any).showPage('subs', document.querySelectorAll('.nav-tab')[5])}
                                    className={`tier-badge ${subscriptionType.toLowerCase()}`}
                                    style={{ border: 'none', cursor: 'pointer', outline: 'none' }}
                                >
                                    {subscriptionType}
                                </button>
                            )}
                            {session.user?.role?.toLowerCase() !== 'user' && (
                                <a
                                    href="/admin"
                                    title="Admin Dashboard"
                                    style={{
                                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                                        width: '32px', height: '32px', borderRadius: '8px',
                                        background: 'rgba(22,163,74,0.12)', color: '#16a34a',
                                        border: '1px solid rgba(22,163,74,0.3)',
                                        textDecoration: 'none', fontSize: '15px', flexShrink: 0,
                                        transition: 'background .2s'
                                    }}
                                >
                                    ⚙️
                                </a>
                            )}
                            <button className="nav-sign" onClick={() => signOut()}>Sign Out</button>
                        </>
                    ) : (
                        <>
                            <button className="nav-sign" onClick={() => window.location.href = '/auth/login'}>Sign In</button>
                            <button className="nav-join" onClick={() => window.location.href = '/auth/login'}>Join Free</button>
                        </>
                    )}
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            <div 
                className={`mobile-nav-overlay ${isMobileMenuOpen ? 'active' : ''}`}
                style={{
                    position: 'fixed',
                    top: '64px',
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'var(--warm)',
                    zIndex: 999,
                    display: isMobileMenuOpen ? 'flex' : 'none',
                    flexDirection: 'column',
                    padding: '40px 24px',
                    gap: '12px',
                    overflowY: 'auto',
                    opacity: isMobileMenuOpen ? 1 : 0,
                    transition: 'opacity 0.3s ease',
                    pointerEvents: isMobileMenuOpen ? 'auto' : 'none'
                }}
            >
                <button className="nav-tab-mobile" onClick={(e) => { (window as any).showPage('home'); setIsMobileMenuOpen(false); }}><SvgHome size={20} /> Home</button>
                <button className="nav-tab-mobile" onClick={(e) => { (window as any).showPage('hymns'); setIsMobileMenuOpen(false); }}><SvgMusic size={20} /> Hymns</button>
                <button className="nav-tab-mobile" onClick={(e) => { (window as any).showPage('diary'); setIsMobileMenuOpen(false); }}><SvgBook size={20} /> Church Diary</button>
                <button className="nav-tab-mobile" onClick={(e) => { (window as any).showPage('echo'); setIsMobileMenuOpen(false); }}><SvgNewspaper size={20} /> The Echo</button>
                <button className="nav-tab-mobile" onClick={(e) => { (window as any).showPage('devo'); setIsMobileMenuOpen(false); }}><SvgPray size={20} /> Devotionals</button>
                <button className="nav-tab-mobile" onClick={(e) => { (window as any).showPage('subs'); setIsMobileMenuOpen(false); }}><SvgCard size={20} /> Subscriptions</button>
                
                <div style={{ height: '1px', background: 'var(--border2)', margin: '20px 0' }}></div>
                
                {!session ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <button className="nav-join" style={{ width: '100%' }} onClick={() => window.location.href = '/auth/login'}>Join Free</button>
                        <button className="nav-sign" style={{ width: '100%', textAlign: 'center' }} onClick={() => window.location.href = '/auth/login'}>Sign In</button>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                         <button className="nav-sign" style={{ width: '100%', textAlign: 'center', color: '#c0392b' }} onClick={() => signOut()}>Sign Out</button>
                    </div>
                )}
            </div>

            {/* ══════════════════════════════════
             PAGE: HOME
         ══════════════════════════════════════ */}
            <div className="page active" id="page-home">
                {/* HERO with floating icons */}
                <section className="hymns-hero" style={{ minHeight: '100vh' }}>
                    <div className="hymns-hero-bg">
                        <div className="ring"></div>
                        <div className="ring"></div>
                        <div className="ring"></div>
                        <div className="ring"></div>
                        <svg style={{ position: 'absolute', opacity: .04, animation: 'rotateSlow 80s linear infinite' }} width="700" height="700" viewBox="0 0 700 700">
                            <line x1="350" y1="0" x2="350" y2="700" stroke="#6e1799" strokeWidth="1" />
                            <line x1="0" y1="233" x2="700" y2="233" stroke="#6e1799" strokeWidth="1" />
                        </svg>
                    </div>
                    {/* Floating hero SVG icons */}
                    <div className="float-icon" style={{ top: '14%', left: '8%', animationDelay: '0s', color: 'rgba(253, 250, 245, 0.15)' }}><SvgMusic size={28} /></div>
                    <div className="float-icon" style={{ top: '22%', right: '9%', animationDelay: '.8s', color: 'rgba(253, 250, 245, 0.15)' }}><SvgCross size={32} /></div>
                    <div className="float-icon" style={{ top: '65%', left: '5%', animationDelay: '1.4s', color: 'rgba(253, 250, 245, 0.15)' }}><SvgBook size={28} /></div>
                    <div className="float-icon" style={{ top: '70%', right: '7%', animationDelay: '.4s', color: 'rgba(253, 250, 245, 0.15)' }}><SvgPray size={28} /></div>
                    <div className="float-icon" style={{ top: '38%', left: '3%', animationDelay: '2s', color: 'rgba(253, 250, 245, 0.15)' }}><SvgMusic size={20} /></div>
                    <div className="float-icon" style={{ top: '42%', right: '4%', animationDelay: '1.1s', color: 'rgba(253, 250, 245, 0.15)' }}><SvgSparkle size={20} /></div>
                    <div className="float-icon" style={{ top: '80%', left: '18%', animationDelay: '.6s', color: 'rgba(253, 250, 245, 0.15)' }}><SvgNewspaper size={22} /></div>
                    <div className="float-icon" style={{ top: '12%', right: '22%', animationDelay: '1.7s', color: 'rgba(253, 250, 245, 0.15)' }}><SvgCard size={22} /></div>

                    <p className="hero-eyebrow" style={{ animation: 'fadeUp .8s .2s ease both', position: 'relative', zIndex: 2 }}>A sacred space for every believer</p>
                    <h1 className="hero-h1" style={{ animation: 'fadeUp .8s .4s ease both', position: 'relative', zIndex: 2 }}>Sing. Listen.<br /><em>Remember.</em></h1>
                    <p className="hero-sub" style={{ maxWidth: '500px', animation: 'fadeUp .8s .6s ease both', position: 'relative', zIndex: 2 }}>
                        Read beloved hymns, keep a personal church diary, stay connected through The Echo, and grow daily with morning devotionals.
                    </p>
                    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center', animation: 'fadeUp .8s .8s ease both', marginTop: '8px', position: 'relative', zIndex: 2 }}>
                        <button onClick={() => (window as any).showPage('hymns', document.querySelectorAll('.nav-tab')[1])} className="btn-primary" style={{ background: 'var(--gold)', color: 'var(--cream)', border: 'none' }}>
                            {subscriptionType ? 'Access Library' : 'Explore Hymns'} &rarr;
                        </button>
                        <button 
                            onClick={(e) => { e.preventDefault(); (window as any).showPage('subs', document.querySelectorAll('.nav-tab')[5]); }}
                            className="btn-ghost" 
                            style={{ borderColor: 'rgba(253, 250, 245, 0.4)', color: 'var(--cream)', background: 'transparent' }}
                        >
                            {subscriptionType ? 'My Plan' : 'View Plans'}
                        </button>
                    </div>
                    <div className="hero-scroll" style={{ animation: 'fadeUp .8s 1.1s ease both', color: 'rgba(253, 250, 245, 0.6)' }}>
                        <div className="scroll-line" style={{ background: 'rgba(253, 250, 245, 0.3)' }}></div><span>Scroll</span>
                    </div>
                </section>

                {/* VERSE STRIP (Optional, but usually part of the aesthetic) */}
                <div className="verse-strip reveal from-bottom">
                    <p id="verseText" style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(.95rem,2vw,1.15rem)', fontWeight: 300, fontStyle: 'italic', letterSpacing: '.04em', lineHeight: 1.8, color: '#f7f3ec', transition: 'opacity .8s' }}>
                        &ldquo;Sing to the Lord a new song; sing to the Lord, all the earth.&rdquo;
                    </p>
                    <p id="verseRef" style={{ fontSize: '.65rem', letterSpacing: '.2em', textTransform: 'uppercase', color: '#6e1799', marginTop: '8px', fontWeight: 300, transition: 'opacity .8s' }}>
                        Psalm 96:1
                    </p>
                </div>

                {/* MARQUEE TICKER */}
                <div className="marquee-section reveal from-bottom">
                    <p style={{ fontSize: '.62rem', letterSpacing: '.28em', textTransform: 'uppercase', color: '#6e1799', textAlign: 'center', marginBottom: '32px', fontWeight: 300 }}>
                        From the hymn library
                    </p>
                    <div className="marquee-wrap" style={{ marginBottom: '12px' }}>
                        <div className="marquee-track">
                            <div className="marquee-item"><SvgMusic size={13} /> Amazing Grace</div>
                            <div className="marquee-item"><SvgCross size={13} /> How Great Thou Art</div>
                            <div className="marquee-item"><SvgPray size={13} /> It Is Well With My Soul</div>
                            <div className="marquee-item"><SvgMusic size={13} /> Be Thou My Vision</div>
                            <div className="marquee-item"><SvgMusic size={13} /> Holy, Holy, Holy</div>
                            <div className="marquee-item"><SvgSparkle size={13} /> Blessed Assurance</div>
                            <div className="marquee-item"><SvgMusic size={13} /> Great Is Thy Faithfulness</div>
                            <div className="marquee-item"><SvgMusic size={13} /> Be Still, My Soul</div>
                            <div className="marquee-item"><SvgCross size={13} /> Crown Him With Many Crowns</div>
                            <div className="marquee-item"><SvgPray size={13} /> To God Be The Glory</div>
                        </div>
                    </div>
                </div>

                {/* STICKY SCROLL SECTION - The Core Content */}
                <section className="sticky-section">
                    <div className="sticky-left">
                        <div className="sticky-panel active" data-panel="0">
                            <p className="sticky-label"><SvgMusic size={14} /> Hymns</p>
                            <h2 className="sticky-title">Ancient words,<br /><em>ever new</em></h2>
                            <p className="sticky-body">Hundreds of classic and contemporary hymns, beautifully typeset. Search by theme, scripture or season. Every word carries centuries of faith.</p>
                            <button onClick={(e) => (window as any).showPage('hymns', document.querySelectorAll('.nav-tab')[1])} className="sticky-btn">Browse Hymns &rarr;</button>
                        </div>
                        <div className="sticky-panel" data-panel="1">
                            <p className="sticky-label"><SvgBook size={14} /> Church Diary</p>
                            <h2 className="sticky-title">Your faith,<br /><em>written down</em></h2>
                            <p className="sticky-body">Every time a hymn moves you, write it down. Over time your diary becomes a testimony — a sacred record of how God spoke through music.</p>
                            <button onClick={(e) => (window as any).showPage('diary', document.querySelectorAll('.nav-tab')[2])} className="sticky-btn">Open Diary &rarr;</button>
                        </div>
                        <div className="sticky-panel" data-panel="2">
                            <p className="sticky-label"><SvgNewspaper size={14} /> The Echo</p>
                            <h2 className="sticky-title">Stories that<br /><em>resonate</em></h2>
                            <p className="sticky-body">Testimonies, church news, and community voices. The Echo carries the stories of believers from around the world.</p>
                            <button onClick={(e) => (window as any).showPage('echo', document.querySelectorAll('.nav-tab')[3])} className="sticky-btn">Read The Echo &rarr;</button>
                        </div>
                        <div className="sticky-panel" data-panel="3">
                            <p className="sticky-label"><SvgPray size={14} /> Devotionals</p>
                            <h2 className="sticky-title">Morning by<br /><em>morning</em></h2>
                            <p className="sticky-body">365 daily devotionals — scripture, reflection and prayer. Start every day grounded in God's word, with a companion hymn to carry you through.</p>
                            <button onClick={(e) => (window as any).showPage('devo', document.querySelectorAll('.nav-tab')[4])} className="sticky-btn">Today's Devotional &rarr;</button>
                        </div>
                    </div>
                    <div className="sticky-right">
                        <div className="sticky-cards-wrap">
                            <div className="sticky-card active" data-card="0" style={{ backgroundImage: "linear-gradient(rgba(26, 21, 16, 0.75), rgba(26, 21, 16, 0.95)), url('/worship_hymns.png')", backgroundSize: 'cover', backgroundPosition: 'center', color: 'var(--cream)', borderColor: 'rgba(255,255,255,0.1)' }}>
                                <div className="sc-icon" style={{ background: 'rgba(255,255,255,0.1)', color: 'var(--cream)' }}><SvgMusic size={22} /></div>
                                <p className="sc-num" style={{ color: '#b8935a' }}>{initialHymns.length}+ Hymns</p>
                                <p className="sc-title" style={{ color: 'var(--cream)' }}>{initialHymns[0]?.title || 'Amazing Grace'}</p>
                                <p className="sc-sub" style={{ color: 'rgba(247,243,236,0.6)' }}>{initialHymns[0]?.author || 'John Newton · 1779'}</p>
                                <div className="sc-bar"><div className="sc-bar-fill" style={{ background: '#b8935a' }}></div></div>
                                <p className="sc-tag" style={{ color: 'rgba(247,243,236,0.6)' }}>
                                    {(Array.isArray(initialHymns[0]?.tags) ? initialHymns[0]?.tags : (initialHymns[0]?.tags || '').split(/[,;]\s*/)).filter(Boolean).join(' · ') || 'Grace · Faith · Salvation'}
                                </p>
                            </div>
                            <div className="sticky-card" data-card="1" style={{ backgroundImage: "linear-gradient(rgba(26, 21, 16, 0.8), rgba(26, 21, 16, 0.95)), url('/church_diary.png')", backgroundSize: 'cover', backgroundPosition: 'center', color: 'var(--cream)', borderColor: 'rgba(255,255,255,0.1)' }}>
                                <div className="sc-icon" style={{ background: 'rgba(255,255,255,0.1)', color: 'var(--cream)' }}><SvgBook size={22} /></div>
                                <p className="sc-num" style={{ color: '#b8935a' }}>Diary Entry &middot; {initialDiary[0] ? new Date(initialDiary[0].date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Feb 25'}</p>
                                <p className="sc-title" style={{ color: 'var(--cream)' }}>{initialDiary[0]?.title || 'Morning of Quiet Grace'}</p>
                                <p className="sc-sub" style={{ color: 'rgba(247,243,236,0.6)' }}>{initialDiary[0]?.hymn || 'Great Is Thy Faithfulness'}</p>
                                <p className="sc-body" style={{ color: 'rgba(247,243,236,0.8)' }}>&ldquo;{initialDiary[0]?.body?.substring(0, 60) || 'The second verse felt like a letter written directly to me...'}...&rdquo;</p>
                                <div style={{ display: 'flex', gap: '6px', marginTop: '16px', flexWrap: 'wrap' }}>
                                    {initialDiary[0]?.theme ? initialDiary[0].theme.split(',').map((t: string) => <span key={t} className="sc-badge" style={{ borderColor: 'rgba(255,255,255,0.2)', color: 'rgba(247,243,236,0.7)' }}>{t.trim()}</span>) : <><span className="sc-badge" style={{ borderColor: 'rgba(255,255,255,0.2)', color: 'rgba(247,243,236,0.7)' }}>Gratitude</span><span className="sc-badge" style={{ borderColor: 'rgba(255,255,255,0.2)', color: 'rgba(247,243,236,0.7)' }}>Faithfulness</span></>}
                                </div>
                            </div>
                            <div className="sticky-card" data-card="2" style={{ backgroundImage: "linear-gradient(rgba(26, 21, 16, 0.8), rgba(26, 21, 16, 0.95)), url('/echo_community.png')", backgroundSize: 'cover', backgroundPosition: 'center', color: 'var(--cream)', borderColor: 'rgba(255,255,255,0.1)' }}>
                                <div className="sc-icon" style={{ background: 'rgba(255,255,255,0.1)', color: 'var(--cream)' }}><SvgNewspaper size={22} /></div>
                                <p className="sc-num" style={{ color: '#b8935a' }}>The Echo &middot; Latest</p>
                                <p className="sc-title" style={{ color: 'var(--cream)' }}>{initialEcho[0]?.title || 'From Doubt to Devotion'}</p>
                                <p className="sc-sub" style={{ color: 'rgba(247,243,236,0.6)' }}>{initialEcho[0]?.author || 'Sarah M.'} &middot; {initialEcho[0]?.date || 'Feb 22, 2026'}</p>
                                <p className="sc-body" style={{ color: 'rgba(247,243,236,0.8)' }}>&ldquo;{initialEcho[0]?.excerpt?.substring(0, 60) || 'Then one Sunday morning, a single hymn changed everything…'}...&rdquo;</p>
                                <span className="sc-badge" style={{ marginTop: '16px', display: 'inline-block', textTransform: 'capitalize', borderColor: 'rgba(255,255,255,0.2)', color: 'rgba(247,243,236,0.7)' }}>{initialEcho[0]?.cat || 'Testimony'}</span>
                            </div>
                            <div className="sticky-card" data-card="3" style={{ backgroundImage: "linear-gradient(rgba(26, 21, 16, 0.8), rgba(26, 21, 16, 0.95)), url('/daily_devo.png')", backgroundSize: 'cover', backgroundPosition: 'center', color: 'var(--cream)', borderColor: 'rgba(255,255,255,0.1)' }}>
                                <div className="sc-icon" style={{ background: 'rgba(255,255,255,0.1)', color: 'var(--cream)' }}><SvgPray size={22} /></div>
                                <p className="sc-num" style={{ color: '#b8935a' }}>Today's Devotional</p>
                                <p className="sc-title" style={{ color: 'var(--cream)' }}>{initialDevotional?.title || 'Still Waters'}</p>
                                <p className="sc-sub" style={{ color: 'rgba(247,243,236,0.6)' }}>{initialDevotional?.date || 'Feb 25, 2026'}</p>
                                <p className="sc-body" style={{ color: 'rgba(247,243,236,0.8)' }}>&ldquo;{initialDevotional?.content?.split('### Reflection')[1]?.replace(/[#>\[\]!\n"]/g, ' ')?.substring(0, 75).trim() || 'He leads me beside quiet waters, he refreshes my soul.'}...&rdquo;</p>
                                <span className="sc-badge" style={{ marginTop: '16px', display: 'inline-block', borderColor: 'rgba(255,255,255,0.2)', color: 'rgba(247,243,236,0.7)' }}>Peace &middot; Rest</span>
                            </div>
                        </div>
                    </div>
                </section>


                {/* CHURCH ANNOUNCEMENTS IN HOME PAGE */}
                <section className="announcements-section reveal from-bottom">
                    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                        <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '2.5rem', color: 'var(--ink)', marginBottom: '40px', textAlign: 'center', fontStyle: 'italic' }}>Church Announcements</h2>
                        <div id="announcementsList" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
                            {initialAnnouncements.length > 0 ? initialAnnouncements.map((ann, i) => (
                                <div key={i} style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: '2px', padding: '32px' }}>
                                    <h3 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.6rem', fontWeight: 400, color: 'var(--ink)', marginBottom: '16px', lineHeight: 1.2 }}>{ann.title}</h3>
                                    <p style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.1rem', color: 'var(--muted)', lineHeight: 1.8 }}>{ann.content}</p>
                                </div>
                            )) : (
                                <p style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.2rem', color: 'var(--muted)', fontStyle: 'italic', textAlign: 'center', width: '100%' }}>No active announcements.</p>
                            )}
                        </div>
                    </div>
                </section>

                {/* HOW IT WORKS */}
                <section className="how-it-works-section reveal from-bottom" style={{ padding: '100px 48px', background: 'var(--warm)' }}>
                    <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
                        <p style={{ fontSize: '.65rem', letterSpacing: '.3em', textTransform: 'uppercase', color: '#6e1799', fontWeight: 300, marginBottom: '16px' }}>Anytime, Anywhere</p>
                        <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: 'clamp(2.5rem, 4vw, 3.5rem)', color: 'var(--ink)', marginBottom: '64px', fontWeight: 300 }}>Worship across all your devices</h2>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '40px', alignItems: 'flex-start' }}>
                            <div className="hiw-card" onClick={(e) => (window as any).showPage('hymns', document.querySelectorAll('.nav-tab')[1])}>
                                <div className="hiw-icon" style={{ background: 'var(--cream)', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', border: '1px solid var(--border)' }}>
                                    <SvgMusic size={28} />
                                </div>
                                <h3 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.4rem', fontWeight: 400, marginBottom: '12px' }}>1. Find your song</h3>
                                <p style={{ fontSize: '.9rem', color: 'var(--muted)', lineHeight: 1.7, fontWeight: 300 }}>Search our library of 850+ hymns by theme, scripture, or author. Press play to hear the melody or read the sheet music.</p>
                            </div>
                            <div className="hiw-card" onClick={(e) => (window as any).showPage('diary', document.querySelectorAll('.nav-tab')[2])}>
                                <div className="hiw-icon" style={{ background: 'var(--cream)', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', border: '1px solid var(--border)' }}>
                                    <SvgBook size={28} />
                                </div>
                                <h3 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.4rem', fontWeight: 400, marginBottom: '12px' }}>2. Record your journey</h3>
                                <p style={{ fontSize: '.9rem', color: 'var(--muted)', lineHeight: 1.7, fontWeight: 300 }}>Save your favorite hymns and attach personal diary entries. Keep a record of how God speaks to you through music.</p>
                            </div>
                            <div className="hiw-card" onClick={(e) => (window as any).showPage('echo', document.querySelectorAll('.nav-tab')[3])}>
                                <div className="hiw-icon" style={{ background: 'var(--cream)', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', border: '1px solid var(--border)' }}>
                                    <SvgNewspaper size={28} />
                                </div>
                                <h3 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.4rem', fontWeight: 400, marginBottom: '12px' }}>3. Stay connected</h3>
                                <p style={{ fontSize: '.9rem', color: 'var(--muted)', lineHeight: 1.7, fontWeight: 300 }}>Read testimonies from the community in The Echo, and start each morning grounded with our daily devotionals.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* TESTIMONIALS */}
                <section className="testimonials-section reveal from-bottom" style={{ background: 'var(--cream)', padding: '100px 48px', borderTop: '1px solid var(--border)' }}>
                    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
                            <p style={{ fontSize: '.65rem', letterSpacing: '.3em', textTransform: 'uppercase', color: '#b8935a', fontWeight: 300, marginBottom: '12px' }}>Community Voices</p>
                            <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: 'clamp(2.5rem, 4vw, 3.5rem)', color: 'var(--ink)', fontWeight: 300 }}>Stories from the congregation</h2>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
                            {initialTestimonials && initialTestimonials.length > 0 ? (
                                initialTestimonials.map((t: any, idx: number) => (
                                    <div key={idx} style={{ background: 'var(--warm)', padding: '40px', border: '1px solid var(--border)', position: 'relative' }}>
                                        <span style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '4rem', color: 'rgba(184, 147, 90, 0.15)', position: 'absolute', top: '10px', left: '24px', lineHeight: 1 }}>"</span>
                                        <p style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.1rem', color: 'var(--ink2)', lineHeight: 1.8, fontStyle: 'italic', marginBottom: '24px', position: 'relative', zIndex: 1 }}>"{t.content}"</p>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <div style={{ width: '40px', height: '40px', background: '#e0d5c1', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '"Cormorant Garamond", serif', fontSize: '1.2rem', color: '#6e1799' }}>
                                                {t.authorName.charAt(0)}
                                            </div>
                                            <div>
                                                <p style={{ fontSize: '.85rem', fontWeight: 500, color: 'var(--ink)' }}>{t.authorName}</p>
                                                {t.authorRole && (
                                                    <p style={{ fontSize: '.7rem', color: 'var(--muted)' }}>{t.authorRole}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.2rem', color: 'var(--muted)', fontStyle: 'italic', textAlign: 'center', width: '100%', padding: '40px 0' }}>Community voices will appear here soon.</p>
                            )}
                        </div>
                    </div>
                </section>


                {/* CTA BANNER */}
                <section className="cta-banner reveal from-bottom">
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                        <span style={{ fontSize: '40vw', color: 'rgba(255,255,255,.015)', fontFamily: "'Cormorant Garamond',serif", lineHeight: 1 }}>✝</span>
                    </div>
                    <p style={{ fontSize: '.65rem', letterSpacing: '.3em', textTransform: 'uppercase', color: '#b8935a', fontWeight: 300, marginBottom: '16px' }}>Begin today</p>
                    <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(2.5rem,5vw,4rem)', fontWeight: 300, color: '#f7f3ec', lineHeight: 1.2, marginBottom: '20px' }}>Your sacred practice<br /><em style={{ fontStyle: 'italic', color: '#6e1799' }}>starts here.</em></h2>
                    <p style={{ fontSize: '.82rem', fontWeight: 300, color: 'rgba(247,243,236,.45)', marginBottom: '44px' }}>Free to join. No commitment required. Just you and the music of faith.</p>
                    <button onClick={(e) => { e.preventDefault(); (window as any).showPage('subs', document.querySelectorAll('.nav-tab')[5]); }} style={{ padding: '14px 40px', background: '#6e1799', color: '#fdfaf5', border: 'none', cursor: 'pointer', fontSize: '.72rem', letterSpacing: '.18em', textTransform: 'uppercase', fontWeight: 300, transition: 'background .3s' }}>Join Free Today</button>
                </section>

                {/* GRACEFUL GIVING SECTION */}
                <section className="giving-section reveal from-bottom" style={{ padding: '100px 48px', background: 'var(--surface)', borderTop: '1px solid var(--border)', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: 0, right: 0, width: '400px', height: '400px', background: 'rgba(110, 23, 153, 0.02)', borderRadius: '50%', filter: 'blur(80px)', marginRight: '-200px', marginTop: '-200px' }}></div>
                    <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
                        <div style={{ marginBottom: '48px' }}>
                            <p style={{ fontSize: '.65rem', letterSpacing: '.35em', textTransform: 'uppercase', color: '#b8935a', fontWeight: 300, marginBottom: '16px' }}>Faith in Action</p>
                            <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: 'clamp(2.5rem, 4vw, 3.5rem)', color: 'var(--ink)', fontWeight: 300, lineHeight: 1.1 }}>
                                Graceful <em style={{ color: '#6e1799', fontStyle: 'italic', fontWeight: 400 }}>Giving</em>
                            </h2>
                            <div style={{ width: '40px', height: '3px', background: '#6e1799', margin: '24px auto', borderRadius: '2px', opacity: 0.3 }}></div>
                            <p style={{ fontSize: '.95rem', color: 'var(--muted)', fontWeight: 300, lineHeight: 1.8, maxWidth: '600px', margin: '0 auto' }}>
                                Your generosity fuels our mission to bring the music of faith to every corner of the world. Support our community projects and digital ministry.
                            </p>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px', marginBottom: '64px' }}>
                            {[
                                { title: 'Tithes & Offerings', desc: 'Support the daily operations and spiritual life of the church.', icon: '🙏' },
                                { title: 'Mission & Outreach', desc: 'Directly fund our community support and global mission projects.', icon: '🌍' },
                                { title: 'Church Development', desc: 'Help us grow our physical and digital sacred spaces.', icon: '🏛️' }
                            ].map((item, idx) => (
                                <div key={idx} style={{ background: 'var(--warm)', padding: '40px', border: '1px solid var(--border)', borderRadius: '2px', transition: 'all 0.3s' }}>
                                    <div style={{ fontSize: '2rem', marginBottom: '20px' }}>{item.icon}</div>
                                    <h3 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.4rem', color: 'var(--ink)', marginBottom: '12px', fontWeight: 400 }}>{item.title}</h3>
                                    <p style={{ fontSize: '.85rem', color: 'var(--muted)', lineHeight: 1.6, fontWeight: 300 }}>{item.desc}</p>
                                </div>
                            ))}
                        </div>

                        <button 
                            onClick={() => (window as any).showPage('subs', document.querySelectorAll('.nav-tab')[5])}
                            style={{ padding: '16px 48px', background: '#6e1799', color: '#fff', border: 'none', borderRadius: '0', fontSize: '.75rem', letterSpacing: '.2em', textTransform: 'uppercase', fontWeight: 300, cursor: 'pointer', boxShadow: '0 20px 40px rgba(110, 23, 153, 0.2)' }}
                        >
                            Give a Gift of Faith &rarr;
                        </button>
                        
                        <p style={{ fontSize: '.7rem', color: 'var(--muted)', marginTop: '32px', fontStyle: 'italic', opacity: 0.6 }}>
                            Secure encrypted giving via mobile money & international cards.
                        </p>
                    </div>
                </section>

                {/* FOOTER */}
                <footer className="landing-footer">
                    <div className="footer-grid">
                        <div>
                            <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.6rem', fontWeight: 300, marginBottom: '14px' }}>{appName.substring(0, Math.max(0, appName.length - 3))}<span style={{ color: '#6e1799', fontStyle: 'italic' }}>{appName.substring(Math.max(0, appName.length - 3))}</span></div>
                            <p style={{ fontSize: '.8rem', fontWeight: 300, lineHeight: 1.9, color: 'rgba(247,243,236,.5)', maxWidth: '260px', marginBottom: '28px' }}>
                                {footerDesc}
                            </p>
                        </div>
                        <div>
                            <p style={{ fontSize: '.6rem', letterSpacing: '.28em', textTransform: 'uppercase', color: '#6e1799', marginBottom: '18px' }}>Explore</p>
                            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '11px' }}>
                                <li><a href="#" onClick={(e) => { e.preventDefault(); (window as any).showPage('hymns', document.querySelectorAll('.nav-tab')[1]); }} style={{ fontSize: '.78rem', fontWeight: 300, color: 'rgba(247,243,236,.5)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}><SvgMusic size={13} /> Hymns</a></li>
                                <li><a href="#" onClick={(e) => { e.preventDefault(); (window as any).showPage('diary', document.querySelectorAll('.nav-tab')[2]); }} style={{ fontSize: '.78rem', fontWeight: 300, color: 'rgba(247,243,236,.5)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}><SvgBook size={13} /> Church Diary</a></li>
                                <li><a href="#" onClick={(e) => { e.preventDefault(); (window as any).showPage('echo', document.querySelectorAll('.nav-tab')[3]); }} style={{ fontSize: '.78rem', fontWeight: 300, color: 'rgba(247,243,236,.5)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}><SvgNewspaper size={13} /> The Echo</a></li>
                            </ul>
                        </div>
                        <div>
                            <p style={{ fontSize: '.6rem', letterSpacing: '.28em', textTransform: 'uppercase', color: '#6e1799', marginBottom: '18px' }}>Contact</p>
                            <p style={{ fontSize: '.78rem', fontWeight: 300, color: 'rgba(247,243,236,.55)', lineHeight: 1.7 }}>{contactEmail}</p>
                        </div>
                    </div>
                </footer>
            </div>

            {/* ══════════════════════════════════
             PAGE: HYMNS
         ══════════════════════════════════════ */}
            <div className="page" id="page-hymns">
                <section className="hymns-hero" style={{ padding: '140px 24px 100px 24px', position: 'relative', overflow: 'hidden' }}>
                    <div className="hymns-hero-bg" style={{ position: 'absolute', inset: 0, backgroundImage: `url('/hymn_library_hero.png')`, backgroundSize: 'cover', backgroundPosition: 'center', zIndex: 0, opacity: 1 }}>
                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(30,30,30,0.7) 0%, var(--surface) 100%)' }}></div>
                    </div>
                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <p className="hero-eyebrow" style={{ color: '#fff', opacity: 0.9, letterSpacing: '0.25em', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>Ancient words, ever new</p>
                        <h1 className="hero-h1" style={{ color: '#fff', textShadow: '0 4px 12px rgba(0,0,0,0.4)', marginTop: '16px' }}>The Hymn <em>Library</em></h1>
                    </div>
                </section>
                <div className="hymn-search-wrap">
                    <div className="hymn-search-container" style={{ maxWidth: '800px', margin: '0 auto', position: 'relative' }}>
                        <div className="hymn-search" style={{ background: 'var(--surface)', borderRadius: '16px', border: '1px solid rgba(184,147,90,0.15)', boxShadow: '0 15px 35px -10px rgba(0,0,0,0.1)', overflow: 'hidden', display: 'flex', alignItems: 'center', transition: 'all 0.3s ease', padding: '4px' }} onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--gold)'} onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(184,147,90,0.15)'}>
                            <div style={{ padding: '0 16px', color: 'var(--gold)', opacity: 0.6 }}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                            </div>
                            <input type="text" id="hymnSearch" placeholder="Search by title, number, author or scripture..." onInput={(e) => (window as any).onSearchInput(e.currentTarget.value)} style={{ flex: 1, padding: '16px 8px', fontSize: '1.1rem', background: 'transparent', border: 'none', color: 'var(--ink)' }} />
                            <div id="search-clear-btn" style={{ display: 'none', cursor: 'pointer', padding: '0 16px', color: 'var(--muted)', opacity: 0.5 }} onClick={() => (window as any).clearSearch()} title="Clear search">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                            </div>
                            <button id="search-btn-main" className="btn-primary" onClick={() => (window as any).onFindClick()} style={{ margin: '4px', padding: '12px 28px', borderRadius: '12px' }}>Find Hymns</button>
                        </div>
                        <div id="search-status" style={{ marginTop: '12px', fontSize: '0.85rem', color: 'var(--muted)', fontStyle: 'italic', textAlign: 'center', minHeight: '1.2em', opacity: 0.8 }}></div>
                    </div>
                    <div className="hymn-advanced-filters">
                        <div className="hymn-filter-field">
                            <label className="hymn-filter-label">Occasion</label>
                            <select id="occasionSelect" className="hymn-select" onChange={() => (window as any).filterHymns()}>
                                <option value="all">All Occasions</option>
                                <option value="morning">Morning Prayer</option>
                                <option value="evening">Evening Prayer</option>
                                <option value="easter">Easter</option>
                                <option value="christmas">Christmas</option>
                                <option value="burial">Burial</option>
                                <option value="wedding">Wedding</option>
                                <option value="praise">General Praise</option>
                            </select>
                        </div>
                        <div className="hymn-filter-field">
                            <label className="hymn-filter-label">Tempo</label>
                            <select id="tempoSelect" className="hymn-select" onChange={() => (window as any).filterHymns()}>
                                <option value="all">Any Tempo</option>
                                <option value="fast">Fast & Joyful</option>
                                <option value="medium">Medium</option>
                                <option value="slow">Slow & Solemn</option>
                            </select>
                        </div>
                    </div>
                    <div className="hymn-filters">
                        <button className="filter-btn active" onClick={(e) => (window as any).setFilter(e.currentTarget, 'all')}>All</button>
                        <button className="filter-btn" onClick={(e) => (window as any).setFilter(e.currentTarget, 'praise')}>Praise</button>
                        <button className="filter-btn" onClick={(e) => (window as any).setFilter(e.currentTarget, 'grace')}>Grace</button>
                        <button className="filter-btn" onClick={(e) => (window as any).setFilter(e.currentTarget, 'faith')}>Faith</button>
                        <button className="filter-btn" onClick={(e) => (window as any).setFilter(e.currentTarget, 'comfort')}>Comfort</button>
                        <button className="filter-btn" onClick={(e) => (window as any).setFilter(e.currentTarget, 'advent')}>Advent</button>
                        <span style={{ margin: '0 8px', borderLeft: '1px solid var(--border)', opacity: 0.3 }}></span>
                        <button className="filter-btn" onClick={() => (window as any).openPlaylists()} title="View Saved Sets" style={{ color: 'var(--gold)' }}>📂 Playlists</button>
                    </div>

                    {isPaywallActive && (
                        <div style={{ maxWidth: '400px', margin: '32px auto 0', padding: '16px', borderRadius: '16px', background: 'rgba(110, 23, 153, 0.04)', border: '1px solid rgba(110, 23, 153, 0.1)', textAlign: 'center' }}>
                            <p style={{ fontSize: '0.65rem', fontWeight: 800, color: '#6e1799', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '8px' }}>✨ Limited Library Access</p>
                            <p style={{ fontSize: '0.85rem', color: 'var(--muted)', fontWeight: 300, lineHeight: 1.4, marginBottom: '16px' }}>
                                Showing {initialHymns.length} foundational hymns for your tier. Upgrade to access all 850+ hymns.
                            </p>
                            <button 
                                onClick={() => (window as any).showPage('subs', document.querySelectorAll('.nav-tab')[5])}
                                style={{ padding: '8px 20px', background: '#6e1799', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '0.7rem', fontWeight: 600, cursor: 'pointer' }}
                            >
                                Upgrade Membership &rarr;
                            </button>
                        </div>
                    )}

                </div>
                <div className="hymns-grid" id="hymnsGrid"></div>
                </div>

                {/* HYMN MODAL */}
                <div className="hymn-modal-bg" id="hymnModal">
                    <div className="hymn-modal">
                        <div className="modal-content">
                            <div className="modal-actions" style={{ display: 'flex', gap: '8px', zIndex: 10 }}>
                                <button className="font-btn" onClick={() => (window as any).prevHymn()} title="Previous Hymn" style={{ fontSize: '1.2rem', padding: '0 8px' }}>←</button>
                                <button className="font-btn" onClick={() => (window as any).nextHymn()} title="Next Hymn" style={{ fontSize: '1.2rem', padding: '0 8px' }}>→</button>
                                <span style={{ flex: 1 }}></span>
                                <button className="font-btn" onClick={() => (window as any).toggleDarkMode()} title="Toggle Dark Mode" style={{ fontSize: '1.1rem' }}>🌙</button>
                                <div className="font-controls" style={{ display: 'flex', gap: '8px', borderLeft: '1px solid var(--border)', paddingLeft: '8px', marginLeft: '4px' }}>
                                    <button className="font-btn" onClick={() => (window as any).changeFontSize(-1)}>A-</button>
                                    <button className="font-btn" onClick={() => (window as any).changeFontSize(1)}>A+</button>
                                </div>
                            </div>
                            <p className="modal-eyebrow" id="m-eyebrow"></p>
                            <h2 className="modal-title" id="m-title"></h2>
                            <p className="modal-author" id="m-author"></p>
                            <div className="modal-metadata">
                                <span className="m-meta-item" id="m-scripture" style={{ display: 'none' }}>📜 <span className="m-meta-text"></span></span>
                                <span className="m-meta-item" id="m-period" style={{ display: 'none' }}>✍️ <span className="m-meta-text"></span></span>
                            </div>
                            <div className="modal-divider"></div>
                            <div className="modal-lyrics" id="m-lyrics"></div>
                            <div className="modal-player">
                                <p className="player-label">Listen Now</p>
                                <div className="player-wave-container">
                                    <div className="player-wave" id="modalWave"></div>
                                    <div className="player-progress-container" id="playerProgressArea" onClick={(e) => (window as any).seekAudio(e)}>
                                        <div className="progress-track">
                                            <div className="progress-fill" id="progressFill"></div>
                                        </div>
                                        <div className="player-times">
                                            <span id="currentTime">00:00</span>
                                            <span id="totalDuration">00:00</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="player-controls">
                                    <button className="pc-btn modal-play-btn" onClick={(e) => (window as any).togglePlay(e.currentTarget)}>▶ Play</button>
                                    <button className="pc-btn" id="modal-fav-btn" onClick={(e) => { if ((window as any)._ttsHymn) (window as any).toggleFavorite((window as any)._ttsHymn.id, e.currentTarget, true); }}>♡ Add to Favorites</button>
                                </div>
                                <div className="modal-utils">
                                    <button className="util-btn" onClick={() => { if ((window as any)._ttsHymn) (window as any).addToPlaylist((window as any)._ttsHymn.id); }}>➕ Add to Playlist</button>
                                    <button className="util-btn" onClick={() => (window as any).copyLyrics()}>📋 Copy Lyrics</button>
                                    <button className="util-btn" onClick={() => (window as any).shareHymn()}>🔗 Share</button>
                                </div>
                            </div>
                            <button className="modal-close" onClick={() => (window as any).closeModal()}>✕</button>
                        </div>
                    </div>
                </div>

            {/* ══════════════════════════════════
             PAGE: CHURCH DIARY
         ══════════════════════════════════════ */}
            <div className="page" id="page-diary">
                <div className="diary-layout" style={{ maxWidth: '1200px', margin: '40px auto', display: 'grid', gridTemplateColumns: '350px 1fr', gap: '32px', padding: '0 24px 100px' }}>
                    <aside className="diary-sidebar" style={{ background: 'var(--surface)', borderRadius: '24px', border: '1px solid rgba(184,147,90,0.1)', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', height: 'fit-content', overflow: 'hidden' }}>
                        <div className="diary-sidebar-head" style={{ padding: '24px', borderBottom: '1px solid rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(184,147,90,0.03)' }}>
                            <h2 className="diary-sidebar-title" style={{ margin: 0, fontStyle: 'italic', fontSize: '1.4rem' }}>My Reflections</h2>
                            <button className="new-entry-btn" onClick={() => (window as any).showNewEntry()} style={{ background: 'var(--gold)', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', transition: 'transform 0.2s' }} onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'} onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>+ New Entry</button>
                        </div>
                        <div className="diary-entry-list" id="diaryList" style={{ maxHeight: '600px', overflowY: 'auto' }}></div>
                    </aside>

                    <main id="diaryMain" style={{ position: 'relative' }}>
                        <div className="diary-paper-shadow" style={{ position: 'absolute', inset: '0 -10px -10px -10px', background: 'rgba(0,0,0,0.05)', borderRadius: '24px', filter: 'blur(20px)', zIndex: -1 }}></div>
                        <div className="diary-main" id="diaryMainContent" style={{ background: '#fdfbf7', borderRadius: '24px', border: '1px solid #e8e1d5', minHeight: '650px', padding: '60px', position: 'relative', boxShadow: '0 20px 50px rgba(0,0,0,0.08)' }}>
                            {/* Paper Lines Effect */}
                            <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(#e8e1d5 1px, transparent 1px)', backgroundSize: '100% 32px', opacity: 0.3, pointerEvents: 'none', borderRadius: '24px' }}></div>
                            <div id="diaryEntryContainer"></div>
                        </div>

                        {/* NEW ENTRY FORM */}
                        <div className="new-entry-form" id="newEntryForm" style={{ display: 'none', background: 'var(--surface)', borderRadius: '24px', border: '1px solid var(--gold)', padding: '40px', boxShadow: '0 30px 60px rgba(0,0,0,0.15)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                                <h2 className="nef-title" style={{ margin: 0, fontStyle: 'italic' }}>Capture Your Thoughts</h2>
                                <button className="nef-cancel" onClick={() => (window as any).cancelNewEntry()} style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer' }}>✕ Cancel</button>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                <div>
                                    <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--muted)', marginBottom: '8px', display: 'block' }}>Entry Title</label>
                                    <input type="text" id="newDiaryTitle" placeholder="e.g. A morning of quiet grace..." style={{ width: '100%', padding: '16px', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.1)', background: 'rgba(184,147,90,0.02)', outline: 'none', fontSize: '1.1rem' }} />
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--muted)', marginBottom: '8px', display: 'block' }}>Companion Hymn (Optional)</label>
                                    <input type="text" id="newDiaryHymn" placeholder="Search for a hymn..." style={{ width: '100%', padding: '16px', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.1)', background: 'rgba(184,147,90,0.02)', outline: 'none' }} />
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--muted)', marginBottom: '8px', display: 'block' }}>Your Reflection</label>
                                    <textarea id="newDiaryBody" placeholder="What is the Spirit speaking to you today?" style={{ width: '100%', height: '250px', padding: '20px', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.1)', background: 'rgba(184,147,90,0.02)', outline: 'none', fontSize: '1.05rem', lineHeight: '1.6', resize: 'none' }}></textarea>
                                </div>
                                <button className="btn-primary" onClick={() => (window as any).saveDiaryEntry()} style={{ padding: '18px', borderRadius: '14px', fontSize: '1rem' }}>Save to My Diary</button>
                            </div>
                        </div>
                    </main>
                </div>
            </div>

            {/* ══════════════════════════════════
             PAGE: THE ECHO
         ══════════════════════════════════════ */}
            <div className="page" id="page-echo">
                <div className="echo-hero">
                    <p className="echo-hero-label">COMMUNITY &amp; STORIES</p>
                    <h1 className="echo-hero-title">The <em>Echo</em></h1>
                    <p className="echo-hero-sub">Stories of faith, testimonies, church news and the voices that echo across our community.</p>
                </div>

                <div className="echo-filters-wrap" style={{ maxWidth: '800px', margin: '0 auto 40px', padding: '0 24px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                    <div className="echo-search-bar" style={{ flex: 1, minWidth: '280px', position: 'relative' }}>
                        <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }}>🔍</span>
                        <input 
                            type="text" 
                            placeholder="Search by title or content..." 
                            onInput={(e) => (window as any).onEchoSearch(e.currentTarget.value)}
                            style={{ width: '100%', padding: '16px 16px 16px 44px', borderRadius: '14px', border: '1px solid var(--border)', background: 'var(--surface)', fontSize: '0.9rem', outline: 'none', transition: 'border-color 0.2s' }}
                            onFocus={e => e.currentTarget.style.borderColor = 'var(--gold)'}
                            onBlur={e => e.currentTarget.style.borderColor = 'var(--border)'}
                        />
                    </div>
                    <select 
                        onChange={(e) => (window as any).onEchoYearChange(e.currentTarget.value)}
                        style={{ padding: '0 20px', borderRadius: '14px', border: '1px solid var(--border)', background: 'var(--surface)', fontSize: '0.9rem', outline: 'none', cursor: 'pointer', height: '48px' }}
                    >
                        <option value="">All Years</option>
                        <option value="2026">2026</option>
                        <option value="2025">2025</option>
                        <option value="2024">2024</option>
                    </select>

                    <select 
                        onChange={(e) => (window as any).onEchoMonthChange(e.currentTarget.value)}
                        style={{ padding: '0 20px', borderRadius: '14px', border: '1px solid var(--border)', background: 'var(--surface)', fontSize: '0.9rem', outline: 'none', cursor: 'pointer', height: '48px' }}
                    >
                        <option value="">All Months</option>
                        <option value="Jan">January</option>
                        <option value="Feb">February</option>
                        <option value="Mar">March</option>
                        <option value="Apr">April</option>
                        <option value="May">May</option>
                        <option value="Jun">June</option>
                        <option value="Jul">July</option>
                        <option value="Aug">August</option>
                        <option value="Sep">September</option>
                        <option value="Oct">October</option>
                        <option value="Nov">November</option>
                        <option value="Dec">December</option>
                    </select>
                </div>

                <div className="echo-categories">
                    <button className="echo-cat active" onClick={(e) => (window as any).setEchoCat(e.currentTarget, 'all')}>All</button>
                    <button className="echo-cat" onClick={(e) => (window as any).setEchoCat(e.currentTarget, 'testimony')}>Testimonies</button>
                    <button className="echo-cat" onClick={(e) => (window as any).setEchoCat(e.currentTarget, 'news')}>Church News</button>
                    <button className="echo-cat" onClick={(e) => (window as any).setEchoCat(e.currentTarget, 'music')}>Music &amp; Worship</button>
                    <button className="echo-cat" onClick={(e) => (window as any).setEchoCat(e.currentTarget, 'community')}>Community</button>
                </div>
                <div className="echo-grid" id="echoGrid"></div>
            </div>

            {/* ══════════════════════════════════
             PAGE: DEVOTIONALS
         ══════════════════════════════════════ */}
            <div className="page" id="page-devo">
                <div className="devo-hero">
                    <h1 className="devo-today-title">Daily Devotional</h1>
                </div>

                {/* Main Content Layout for Devotionals */}
                <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px 64px' }}>
                    {/* Current Devotional Content Container */}
                    <div id="currentDevoContent" style={{ minHeight: '200px' }}></div>
                    <div className="devo-archive" style={{ marginTop: '64px' }}>
                        <h2 className="devo-archive-title">Previous Devotionals</h2>
                        <div className="devo-archive-grid" id="devoArchive"></div>
                    </div>
                </div>
            </div>

            {/* DEVOTIONAL MODAL */}
            <div className="hymn-modal-bg" id="devoModal">
                <div className="devo-modal">
                    <button className="modal-close" onClick={() => (window as any).closeDevoModal()}>✕</button>
                    <div id="devoModalContent"></div>
                </div>
            </div>

            {/* ══════════════════════════════════
             PAGE: SUBSCRIPTIONS
         ══════════════════════════════════════ */}
            <div className="page" id="page-subs" style={{ background: 'var(--warm)', padding: '120px 24px 100px' }}>
                <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '60px' }}>
                    {/* Header */}
                    <div className="text-center" style={{ marginBottom: '60px' }}>
                        <div style={{ position: 'relative', display: 'inline-block', marginBottom: '8px' }}>
                            <div style={{ position: 'absolute', inset: '-4px', background: 'linear-gradient(to right, #6e1799, #b8935a)', filter: 'blur(10px)', opacity: 0.15 }}></div>
                            <h2 style={{ position: 'relative', fontFamily: '"Cormorant Garamond", serif', fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', color: 'var(--ink)', fontWeight: 300, letterSpacing: '0.08em' }}>
                                THE <span style={{ color: '#6e1799', fontStyle: 'italic', fontWeight: 500 }}>JOURNEY</span> PLANS
                            </h2>
                        </div>
                        <p style={{ fontSize: '0.65rem', letterSpacing: '0.35em', textTransform: 'uppercase', color: 'var(--muted)', fontWeight: 300, marginTop: '16px' }}>Support the digital ministry</p>
                    </div>

                    {/* Current Plan Summary (Spotify Style) */}
                    {subscriptionType && (
                        <div style={{ background: 'rgba(110, 23, 153, 0.04)', border: '1px solid rgba(110, 23, 153, 0.15)', borderRadius: '24px', padding: '32px', marginBottom: '48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '24px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                <div style={{ width: '48px', height: '48px', background: '#6e1799', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>🛡️</div>
                                <div>
                                    <p style={{ fontSize: '0.6rem', fontWeight: 800, color: '#6e1799', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '4px' }}>Membership Verified</p>
                                    <h3 style={{ fontSize: '1.4rem', fontWeight: 300, color: 'var(--ink)', fontFamily: '"Cormorant Garamond", serif' }}>You are currently on the <strong style={{ fontStyle: 'italic', fontWeight: 500 }}>{subscriptionType}</strong> Tier</h3>
                                </div>
                            </div>
                            {/* Only show Admin Billing link to Administrative roles */}
                            {session?.user?.role !== 'NORMAL_USER' && session?.user?.role !== 'USER' && (
                                <button 
                                    onClick={() => window.location.href = '/admin/subscriptions'} 
                                    style={{ padding: '12px 24px', background: 'transparent', border: '1px solid var(--border)', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--ink)', cursor: 'pointer' }}
                                >
                                    Manage Billing &rarr;
                                </button>
                            )}
                        </div>
                    )}

                    {/* Tiers Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
                        {[
                            { type: 'SEEKER', name: 'The Seeker', price: '1,500', level: 1, desc: 'Ideal for casual readers and new believers.', features: ['Access to 200 Hymns', 'Latest Echo Issue (Current)', 'Personal Church Diary'] },
                            { type: 'PILGRIM', name: 'The Pilgrim', price: '4,500', level: 2, desc: 'Our standard for daily worship and study.', features: ['Access to 400 Hymns', 'Complete Echo Archives', 'Personal Church Diary'], recommended: true },
                            { type: 'SHEPHERD', name: 'The Shepherd', price: '12,000', level: 3, desc: 'The ultimate patronage for the digital ministry.', features: ['Unlimited Hymn Access', 'Complete Echo Archives', 'Personal Church Diary', 'Priority Support & Updates'] }
                        ].map((plan, i) => {
                            const isCurrent = subscriptionType === plan.type;
                            const isUpgrade = subscriptionType && plan.level > (subscriptionType === 'SEEKER' ? 1 : subscriptionType === 'PILGRIM' ? 2 : 3);
                            
                            return (
                                <div key={i} 
                                    onMouseEnter={(e) => {
                                        if (!isCurrent) {
                                            e.currentTarget.style.background = 'rgba(110, 23, 153, 0.08)';
                                            e.currentTarget.style.borderColor = '#6e1799';
                                            e.currentTarget.style.transform = plan.recommended ? 'scale(1.05)' : 'scale(1.02)';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!isCurrent) {
                                            e.currentTarget.style.background = 'var(--surface)';
                                            e.currentTarget.style.borderColor = 'var(--border)';
                                            e.currentTarget.style.transform = plan.recommended ? 'scale(1.03)' : 'scale(1)';
                                        }
                                    }}
                                    style={{ 
                                        background: isCurrent ? 'rgba(110, 23, 153, 0.02)' : 'var(--surface)', 
                                        border: isCurrent ? '2px solid #6e1799' : '1px solid var(--border)', 
                                        borderRadius: '32px', padding: '48px 40px', display: 'flex', flexDirection: 'column', 
                                        position: 'relative', boxShadow: plan.recommended ? '0 30px 60px rgba(0,0,0,0.06)' : 'none',
                                        transform: plan.recommended ? 'scale(1.03)' : 'scale(1)',
                                        zIndex: plan.recommended ? 2 : 1,
                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                                    }}>
                                    {plan.recommended && !isCurrent && <span style={{ position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)', background: '#6e1799', color: '#fff', padding: '4px 16px', borderRadius: '40px', fontSize: '0.6rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Recommended</span>}
                                    {isCurrent && <span style={{ position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)', background: 'var(--ink)', color: '#fff', padding: '4px 16px', borderRadius: '40px', fontSize: '0.6rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Current Plan</span>}
                                    
                                    <div style={{ marginBottom: '32px' }}>
                                        <h4 style={{ fontSize: '1.25rem', fontFamily: '"Cormorant Garamond", serif', color: 'var(--ink)', marginBottom: '16px', fontStyle: 'italic', fontWeight: 500 }}>{plan.name}</h4>
                                        <p style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                                            <span style={{ fontSize: '2.5rem', fontWeight: 300, color: 'var(--ink)', fontFamily: '"Cormorant Garamond", serif' }}>{plan.price}</span>
                                            <span style={{ fontSize: '0.7rem', color: 'var(--muted)', fontWeight: 400, textTransform: 'uppercase', letterSpacing: '0.1em' }}>XAF / month</span>
                                        </p>
                                        <p style={{ fontSize: '0.85rem', color: 'var(--muted)', marginTop: '12px', lineHeight: 1.6 }}>{plan.desc}</p>
                                    </div>

                                    <ul style={{ listStyle: 'none', margin: '0 0 48px', flex: 1 }}>
                                        {plan.features.map((f, j) => (
                                            <li key={j} style={{ display: 'flex', gap: '12px', fontSize: '0.85rem', color: 'var(--ink)', marginBottom: '16px', alignItems: 'center' }}>
                                                <span style={{ color: '#6e1799', fontWeight: 'bold' }}>◈</span> {f}
                                            </li>
                                        ))}
                                    </ul>

                                    <button 
                                        onClick={() => window.location.href = `/subscriptions/checkout?plan=${plan.type}`}
                                        disabled={isCurrent}
                                        style={{ 
                                            width: '100%', padding: '16px', borderRadius: '16px', 
                                            background: isCurrent ? 'transparent' : (plan.recommended ? '#6e1799' : 'var(--ink)'),
                                            color: isCurrent ? 'var(--muted)' : '#fff',
                                            border: isCurrent ? '1px solid var(--border)' : 'none',
                                            fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', 
                                            letterSpacing: '0.2em', cursor: isCurrent ? 'default' : 'pointer',
                                            transition: 'transform 0.2s', opacity: isCurrent ? 0.6 : 1
                                        }}
                                    >
                                        {isCurrent ? 'Active Membership' : (isUpgrade ? 'Upgrade Journey' : 'Select Plan')}
                                    </button>
                                </div>
                            )
                        })}
                    </div>

                    {/* Trust Banner/Stats Footer */}
                    <div style={{ marginTop: '80px', paddingTop: '64px', borderTop: '1px solid var(--border)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '32px', textAlign: 'center', opacity: 0.8 }}>
                        <div>
                            <p style={{ fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#6e1799', marginBottom: '8px' }}>Global Reach</p>
                            <p style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '2.5rem', color: 'var(--ink)' }}>25k+</p>
                            <p style={{ fontSize: '0.8rem', color: 'var(--muted)', marginTop: '4px' }}>Hymns sung monthly</p>
                        </div>
                        <div>
                            <p style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '2.5rem', color: 'var(--ink)' }}>850+</p>
                            <p style={{ fontSize: '0.8rem', color: 'var(--muted)', marginTop: '4px' }}>Original scores</p>
                        </div>
                        <div>
                            <p style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '2.5rem', color: 'var(--ink)' }}>70+</p>
                            <p style={{ fontSize: '0.8rem', color: 'var(--muted)', marginTop: '4px' }}>Congregations linked</p>
                        </div>
                        <div>
                            <p style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '2.5rem', color: 'var(--ink)' }}>100%</p>
                            <p style={{ fontSize: '0.8rem', color: 'var(--muted)', marginTop: '4px' }}>Spiritual dedication</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* FAVORITES MODAL */}
            {isFavoritesOpen && (
                <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setIsFavoritesOpen(false)}>
                    <div style={{ background: '#F7F3EC', padding: '40px', borderRadius: '16px', width: '90%', maxWidth: '600px', maxHeight: '75vh', overflowY: 'auto', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column' }} onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexShrink: 0 }}>
                            <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '2.2rem', color: '#1A1A1A', margin: 0 }}>My Favorite Hymns</h2>
                            <button onClick={() => setIsFavoritesOpen(false)} style={{ background: 'none', border: 'none', fontSize: '1.8rem', cursor: 'pointer', color: '#666', padding: 0 }}>✕</button>
                        </div>
                        {favorites.length === 0 ? (
                            <p style={{ color: '#666', fontStyle: 'italic', lineHeight: 1.6, margin: 0 }}>You haven't saved any hymns yet. Click the heart icon on any hymn to add it here!</p>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto', paddingRight: '12px', margin: '0 -12px 0 0' }}>
                                {initialHymns.filter(h => favorites.includes(h.id)).map(h => (
                                    <div key={h.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '10px', cursor: 'pointer', transition: 'background 0.2s', backgroundColor: '#ffffff' }} 
                                        onClick={() => { setIsFavoritesOpen(false); (window as any).showPage('hymns'); (window as any).openHymn(h); }} 
                                        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#FAF8F5'} 
                                        onMouseLeave={e => e.currentTarget.style.backgroundColor = '#ffffff'}>
                                        <div>
                                            <p style={{ fontSize: '1.05rem', fontWeight: 600, color: '#1A1A1A', margin: '0 0 4px 0' }}>{h.num} - {h.title}</p>
                                            <p style={{ fontSize: '0.85rem', color: '#666', margin: 0 }}>{h.author}</p>
                                        </div>
                                        <div style={{ color: '#d9534f', fontSize: '1.4rem' }}>♥</div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* FLOATING FAVORITES BUTTON */}
            {favorites.length > 0 && (
                <button onClick={() => setIsFavoritesOpen(true)} style={{ position: 'fixed', bottom: '30px', right: '30px', background: '#6e1799', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '30px', boxShadow: '0 10px 20px rgba(110, 23, 153, 0.3)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', zIndex: 100, transition: 'transform 0.2s' }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
                    <span style={{ color: '#ffb3b3', fontSize: '1.2rem' }}>♥</span>
                    <span style={{ fontSize: '0.8rem', letterSpacing: '0.05em', fontWeight: 500 }}>My Favorites ({favorites.length})</span>
                </button>
            )}

            {/* Toast Notification Container */}
            <div id="canticle-toast">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                <span id="toast-text">Copied to clipboard</span>
            </div>

            {/* User Profile Page Container */}
            <div className="page" id="page-profile" style={{ paddingTop: '100px', flexDirection: 'column' }}></div>
        </div>
    );
}
