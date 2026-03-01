"use client"

import { useEffect } from "react";
import { signOut } from "next-auth/react";
import "./landing_styles.css";

interface LandingPageClientProps {
    session?: any;
    initialHymns: any[];
    initialEcho?: any[];
    initialDevotional?: any | null;
    initialDiary?: any[];
    initialAnnouncements?: any[];
}

export default function LandingPageClient({
    session,
    initialHymns = [],
    initialEcho = [],
    initialDevotional = null,
    initialDiary = [],
    initialAnnouncements = []
}: LandingPageClientProps) {
    useEffect(() => {
        // Inject initial data for the legacy script
        (window as any).hymns_db = initialHymns;
        (window as any).echo_db = initialEcho;
        (window as any).devotional_db = initialDevotional;
        (window as any).diary_db = initialDiary;
        (window as any).announcements_db = initialAnnouncements;

        // Load external logic script on mount, making sure it isn't loaded twice in Dev environment
        const scriptId = "canticle-logic-script";
        if (!document.getElementById(scriptId)) {
            const script = document.createElement("script");
            script.id = scriptId;
            script.src = `/canticle_logic_v2.js`; // Removed cache-buster for performance
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
    }, [initialHymns, initialEcho, initialDevotional, initialDiary, initialAnnouncements]);

    return (
        <div className="landing-body">
            {/* ══ NAV ══ */}
            <div id="scrollBar"></div>
            <div id="parallaxCross">✝</div>
            <nav className="landing-nav">
                <a className="logo" href="#">Canti<span>cle</span></a>
                <div className="nav-tabs">
                    <button className="nav-tab active" onClick={(e) => (window as any).showPage('home', e.currentTarget)}>🏠 Home<div className="dot"></div></button>
                    <button className="nav-tab" onClick={(e) => (window as any).showPage('hymns', e.currentTarget)}>🎵 Hymns<div className="dot"></div></button>
                    <button className="nav-tab" onClick={(e) => (window as any).showPage('diary', e.currentTarget)}>📖 Church Diary<div className="dot"></div></button>
                    <button className="nav-tab" onClick={(e) => (window as any).showPage('echo', e.currentTarget)}>📰 The Echo<div className="dot"></div></button>
                    <button className="nav-tab" onClick={(e) => (window as any).showPage('devo', e.currentTarget)}>🙏 Devotionals<div className="dot"></div></button>
                    <button className="nav-tab" onClick={(e) => (window as any).showPage('subs', e.currentTarget)}>💳 Subscriptions<div className="dot"></div></button>
                </div>
                <div className="nav-right" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    {session ? (
                        <>
                            <span style={{ fontSize: '.75rem', color: 'var(--muted)', marginRight: '8px' }}>
                                Welcome, <span style={{ color: 'var(--gold)' }}>{session.user?.name?.split(' ')[0] || session.user?.email?.split('@')[0]}</span>
                            </span>
                            {session.user?.role?.toLowerCase() !== 'user' && (
                                <button className="nav-join" onClick={() => window.location.href = '/admin'}>Admin</button>
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
                            <line x1="350" y1="0" x2="350" y2="700" stroke="#b8935a" strokeWidth="1" />
                            <line x1="0" y1="233" x2="700" y2="233" stroke="#b8935a" strokeWidth="1" />
                        </svg>
                    </div>
                    <div className="float-icon" style={{ top: '14%', left: '8%', animationDelay: '0s' }}>🎵</div>
                    <div className="float-icon" style={{ top: '22%', right: '9%', animationDelay: '.8s', fontSize: '2rem' }}>✝</div>
                    <div className="float-icon" style={{ top: '65%', left: '5%', animationDelay: '1.4s' }}>📖</div>
                    <div className="float-icon" style={{ top: '70%', right: '7%', animationDelay: '.4s' }}>🙏</div>
                    <div className="float-icon" style={{ top: '38%', left: '3%', animationDelay: '2s', fontSize: '1.2rem' }}>🎶</div>
                    <div className="float-icon" style={{ top: '42%', right: '4%', animationDelay: '1.1s', fontSize: '1.2rem' }}>✨</div>
                    <div className="float-icon" style={{ top: '80%', left: '18%', animationDelay: '.6s', fontSize: '1.4rem' }}>📰</div>
                    <div className="float-icon" style={{ top: '12%', right: '22%', animationDelay: '1.7s', fontSize: '1.4rem' }}>💳</div>

                    <p className="hero-eyebrow" style={{ animation: 'fadeUp .8s .2s ease both', position: 'relative', zIndex: 2 }}>A sacred space for every believer</p>
                    <h1 className="hero-h1" style={{ animation: 'fadeUp .8s .4s ease both', position: 'relative', zIndex: 2 }}>Sing. Listen.<br /><em>Remember.</em></h1>
                    <p className="hero-sub" style={{ maxWidth: '500px', animation: 'fadeUp .8s .6s ease both', position: 'relative', zIndex: 2 }}>
                        Read beloved hymns, keep a personal church diary, stay connected through The Echo, and grow daily with morning devotionals.
                    </p>
                    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center', animation: 'fadeUp .8s .8s ease both', marginTop: '8px', position: 'relative', zIndex: 2 }}>
                        <button onClick={() => (window as any).showPage('hymns', document.querySelectorAll('.nav-tab')[1])} className="btn-primary">Explore Hymns &rarr;</button>
                        <button onClick={() => (window as any).showPage('subs', document.querySelectorAll('.nav-tab')[5])} className="btn-ghost">View Plans</button>
                    </div>
                    <div className="hero-scroll" style={{ animation: 'fadeUp .8s 1.1s ease both' }}>
                        <div className="scroll-line"></div><span>Scroll</span>
                    </div>
                </section>

                {/* VERSE STRIP (Optional, but usually part of the aesthetic) */}
                <div style={{ background: '#1a1510', padding: '28px 48px', textAlign: 'center', overflow: 'hidden' }} className="reveal from-bottom">
                    <p id="verseText" style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(.95rem,2vw,1.15rem)', fontWeight: 300, fontStyle: 'italic', letterSpacing: '.04em', lineHeight: 1.8, color: '#f7f3ec', transition: 'opacity .8s' }}>
                        &ldquo;Sing to the Lord a new song; sing to the Lord, all the earth.&rdquo;
                    </p>
                    <p id="verseRef" style={{ fontSize: '.65rem', letterSpacing: '.2em', textTransform: 'uppercase', color: '#b8935a', marginTop: '8px', fontWeight: 300, transition: 'opacity .8s' }}>
                        Psalm 96:1
                    </p>
                </div>

                {/* MARQUEE TICKER (Optional) */}
                <div style={{ padding: '64px 0', overflow: 'hidden', background: 'var(--warm)', borderBottom: '1px solid rgba(184,147,90,.12)' }} className="reveal from-bottom">
                    <p style={{ fontSize: '.62rem', letterSpacing: '.28em', textTransform: 'uppercase', color: '#b8935a', textAlign: 'center', marginBottom: '32px', fontWeight: 300 }}>
                        From the hymn library
                    </p>
                    <div className="marquee-wrap" style={{ marginBottom: '12px' }}>
                        <div className="marquee-track">
                            <div className="marquee-item">🎵 Amazing Grace</div>
                            <div className="marquee-item">✝ How Great Thou Art</div>
                            <div className="marquee-item">🙏 It Is Well With My Soul</div>
                            <div className="marquee-item">🎶 Be Thou My Vision</div>
                            <div className="marquee-item">🎵 Holy, Holy, Holy</div>
                            <div className="marquee-item">✨ Blessed Assurance</div>
                            <div className="marquee-item">🎵 Great Is Thy Faithfulness</div>
                            <div className="marquee-item">🎶 Be Still, My Soul</div>
                            <div className="marquee-item">✝ Crown Him With Many Crowns</div>
                            <div className="marquee-item">🙏 To God Be The Glory</div>
                        </div>
                    </div>
                </div>

                {/* STICKY SCROLL SECTION - The Core Content */}
                <section className="sticky-section">
                    <div className="sticky-left">
                        <div className="sticky-panel active" data-panel="0">
                            <p className="sticky-label">🎵 Hymns</p>
                            <h2 className="sticky-title">Ancient words,<br /><em>ever new</em></h2>
                            <p className="sticky-body">Hundreds of classic and contemporary hymns, beautifully typeset. Search by theme, scripture or season. Every word carries centuries of faith.</p>
                            <button onClick={(e) => (window as any).showPage('hymns', document.querySelectorAll('.nav-tab')[1])} className="sticky-btn">Browse Hymns &rarr;</button>
                        </div>
                        <div className="sticky-panel" data-panel="1">
                            <p className="sticky-label">📖 Church Diary</p>
                            <h2 className="sticky-title">Your faith,<br /><em>written down</em></h2>
                            <p className="sticky-body">Every time a hymn moves you, write it down. Over time your diary becomes a testimony — a sacred record of how God spoke through music.</p>
                            <button onClick={(e) => (window as any).showPage('diary', document.querySelectorAll('.nav-tab')[2])} className="sticky-btn">Open Diary &rarr;</button>
                        </div>
                        <div className="sticky-panel" data-panel="2">
                            <p className="sticky-label">📰 The Echo</p>
                            <h2 className="sticky-title">Stories that<br /><em>resonate</em></h2>
                            <p className="sticky-body">Testimonies, church news, and community voices. The Echo carries the stories of believers from around the world.</p>
                            <button onClick={(e) => (window as any).showPage('echo', document.querySelectorAll('.nav-tab')[3])} className="sticky-btn">Read The Echo &rarr;</button>
                        </div>
                        <div className="sticky-panel" data-panel="3">
                            <p className="sticky-label">🙏 Devotionals</p>
                            <h2 className="sticky-title">Morning by<br /><em>morning</em></h2>
                            <p className="sticky-body">365 daily devotionals — scripture, reflection and prayer. Start every day grounded in God’s word, with a companion hymn to carry you through.</p>
                            <button onClick={(e) => (window as any).showPage('devo', document.querySelectorAll('.nav-tab')[4])} className="sticky-btn">Today's Devotional &rarr;</button>
                        </div>
                    </div>
                    <div className="sticky-right">
                        <div className="sticky-cards-wrap">
                            <div className="sticky-card active" data-card="0">
                                <div className="sc-icon">🎵</div>
                                <p className="sc-num">{initialHymns.length}+ Hymns</p>
                                <p className="sc-title">{initialHymns[0]?.title || 'Amazing Grace'}</p>
                                <p className="sc-sub">{initialHymns[0]?.author || 'John Newton · 1779'}</p>
                                <div className="sc-bar"><div className="sc-bar-fill"></div></div>
                                <p className="sc-tag">{initialHymns[0]?.tags?.join(' · ') || 'Grace · Faith · Salvation'}</p>
                            </div>
                            <div className="sticky-card" data-card="1">
                                <div className="sc-icon">📖</div>
                                <p className="sc-num">Diary Entry &middot; {initialDiary[0] ? new Date(initialDiary[0].date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Feb 25'}</p>
                                <p className="sc-title">{initialDiary[0]?.title || 'Morning of Quiet Grace'}</p>
                                <p className="sc-sub">{initialDiary[0]?.hymn || 'Great Is Thy Faithfulness'}</p>
                                <p className="sc-body">&ldquo;{initialDiary[0]?.body?.substring(0, 60) || 'The second verse felt like a letter written directly to me...'}...&rdquo;</p>
                                <div style={{ display: 'flex', gap: '6px', marginTop: '16px', flexWrap: 'wrap' }}>
                                    {initialDiary[0]?.theme ? initialDiary[0].theme.split(',').map((t: string) => <span key={t} className="sc-badge">{t.trim()}</span>) : <><span className="sc-badge">Gratitude</span><span className="sc-badge">Faithfulness</span></>}
                                </div>
                            </div>
                            <div className="sticky-card" data-card="2">
                                <div className="sc-icon">📰</div>
                                <p className="sc-num">The Echo &middot; Latest</p>
                                <p className="sc-title">{initialEcho[0]?.title || 'From Doubt to Devotion'}</p>
                                <p className="sc-sub">{initialEcho[0]?.author || 'Sarah M.'} &middot; {initialEcho[0]?.date || 'Feb 22, 2026'}</p>
                                <p className="sc-body">&ldquo;{initialEcho[0]?.excerpt?.substring(0, 60) || 'Then one Sunday morning, a single hymn changed everything…'}...&rdquo;</p>
                                <span className="sc-badge" style={{ marginTop: '16px', display: 'inline-block', textTransform: 'capitalize' }}>{initialEcho[0]?.cat || 'Testimony'}</span>
                            </div>
                            <div className="sticky-card" data-card="3">
                                <div className="sc-icon">🙏</div>
                                <p className="sc-num">Today's Devotional</p>
                                <p className="sc-title">{initialDevotional?.title || 'Still Waters'}</p>
                                <p className="sc-sub">{initialDevotional?.date || 'Feb 25, 2026'}</p>
                                <p className="sc-body">&ldquo;{initialDevotional?.content?.split('### Reflection')[1]?.replace(/[#>\[\]!\n"]/g, ' ')?.substring(0, 75).trim() || 'He leads me beside quiet waters, he refreshes my soul.'}...&rdquo;</p>
                                <span className="sc-badge" style={{ marginTop: '16px', display: 'inline-block' }}>Peace &middot; Rest</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CHURCH ANNOUNCEMENTS IN HOME PAGE */}
                <section style={{ background: 'var(--bg)', padding: '64px 24px', position: 'relative', borderTop: '1px solid rgba(184,147,90,.15)' }} className="reveal from-bottom">
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

                {/* CTA BANNER */}
                <section style={{ background: '#1a1510', padding: '100px 48px', textAlign: 'center', position: 'relative', overflow: 'hidden' }} className="reveal from-bottom">
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                        <span style={{ fontSize: '40vw', color: 'rgba(255,255,255,.015)', fontFamily: "'Cormorant Garamond',serif", lineHeight: 1 }}>✝</span>
                    </div>
                    <p style={{ fontSize: '.65rem', letterSpacing: '.3em', textTransform: 'uppercase', color: '#b8935a', fontWeight: 300, marginBottom: '16px' }}>Begin today</p>
                    <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(2.5rem,5vw,4rem)', fontWeight: 300, color: '#f7f3ec', lineHeight: 1.2, marginBottom: '20px' }}>Your sacred practice<br /><em style={{ fontStyle: 'italic', color: '#b8935a' }}>starts here.</em></h2>
                    <p style={{ fontSize: '.82rem', fontWeight: 300, color: 'rgba(247,243,236,.45)', marginBottom: '44px' }}>Free to join. No commitment required. Just you and the music of faith.</p>
                    <button onClick={() => window.location.href = '/auth/login'} style={{ padding: '14px 40px', background: '#b8935a', color: '#fdfaf5', border: 'none', cursor: 'pointer', fontSize: '.72rem', letterSpacing: '.18em', textTransform: 'uppercase', fontWeight: 300, transition: 'background .3s' }}>Join Free Today</button>
                </section>

                {/* FOOTER */}
                <footer style={{ background: '#1a1510', color: '#f7f3ec', padding: '56px 48px 0', borderTop: '1px solid rgba(255,255,255,.06)' }}>
                    <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '56px', paddingBottom: '48px', borderBottom: '1px solid rgba(255,255,255,.07)' }}>
                        <div>
                            <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.6rem', fontWeight: 300, marginBottom: '14px' }}>Canti<span style={{ color: '#b8935a', fontStyle: 'italic' }}>cle</span></div>
                            <p style={{ fontSize: '.8rem', fontWeight: 300, lineHeight: 1.9, color: 'rgba(247,243,236,.5)', maxWidth: '260px', marginBottom: '28px' }}>A sacred digital space for believers to read hymns, keep a spiritual diary, and grow daily in faith.</p>
                        </div>
                        <div>
                            <p style={{ fontSize: '.6rem', letterSpacing: '.28em', textTransform: 'uppercase', color: '#b8935a', marginBottom: '18px' }}>Explore</p>
                            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '11px' }}>
                                <li><a href="#" onClick={(e) => { e.preventDefault(); (window as any).showPage('hymns', document.querySelectorAll('.nav-tab')[1]); }} style={{ fontSize: '.78rem', fontWeight: 300, color: 'rgba(247,243,236,.5)', textDecoration: 'none' }}>🎵 Hymns</a></li>
                                <li><a href="#" onClick={(e) => { e.preventDefault(); (window as any).showPage('diary', document.querySelectorAll('.nav-tab')[2]); }} style={{ fontSize: '.78rem', fontWeight: 300, color: 'rgba(247,243,236,.5)', textDecoration: 'none' }}>📖 Church Diary</a></li>
                                <li><a href="#" onClick={(e) => { e.preventDefault(); (window as any).showPage('echo', document.querySelectorAll('.nav-tab')[3]); }} style={{ fontSize: '.78rem', fontWeight: 300, color: 'rgba(247,243,236,.5)', textDecoration: 'none' }}>📰 The Echo</a></li>

                            </ul>
                        </div>
                        <div>
                            <p style={{ fontSize: '.6rem', letterSpacing: '.28em', textTransform: 'uppercase', color: '#b8935a', marginBottom: '18px' }}>Contact</p>
                            <p style={{ fontSize: '.78rem', fontWeight: 300, color: 'rgba(247,243,236,.55)', lineHeight: 1.7 }}>hello@canticle.app</p>
                        </div>
                    </div>
                </footer>
            </div>

            {/* ══════════════════════════════════
             PAGE: HYMNS
        ══════════════════════════════════════ */}
            <div className="page" id="page-hymns">
                <section className="hymns-hero">
                    <div className="hymns-hero-bg">
                        <div className="ring"></div><div className="ring"></div><div className="ring"></div><div className="ring"></div>
                    </div>
                    <p className="hero-eyebrow">Ancient words, ever new</p>
                    <h1 className="hero-h1">The Hymn <em>Library</em></h1>
                </section>
                <div className="hymn-search-wrap">
                    <div className="hymn-search">
                        <input type="text" id="hymnSearch" placeholder="Search by title, author or scripture…" onInput={() => (window as any).filterHymns()} />
                        <button>Search</button>
                    </div>
                    <div className="hymn-filters">
                        <button className="filter-btn active" onClick={(e) => (window as any).setFilter(e.currentTarget, 'all')}>All</button>
                        <button className="filter-btn" onClick={(e) => (window as any).setFilter(e.currentTarget, 'praise')}>Praise</button>
                        <button className="filter-btn" onClick={(e) => (window as any).setFilter(e.currentTarget, 'grace')}>Grace</button>
                        <button className="filter-btn" onClick={(e) => (window as any).setFilter(e.currentTarget, 'faith')}>Faith</button>
                        <button className="filter-btn" onClick={(e) => (window as any).setFilter(e.currentTarget, 'comfort')}>Comfort</button>
                        <button className="filter-btn" onClick={(e) => (window as any).setFilter(e.currentTarget, 'advent')}>Advent</button>
                    </div>
                </div>
                <div className="hymns-grid" id="hymnsGrid"></div>
            </div>

            {/* HYMN MODAL */}
            <div className="hymn-modal-bg" id="hymnModal">
                <div className="hymn-modal">
                    <button className="modal-close" onClick={() => (window as any).closeModal()}>✕</button>
                    <p className="modal-eyebrow" id="m-eyebrow"></p>
                    <h2 className="modal-title" id="m-title"></h2>
                    <p className="modal-author" id="m-author"></p>
                    <div className="modal-divider"></div>
                    <div className="modal-lyrics" id="m-lyrics"></div>
                    <div className="modal-player">
                        <p className="player-label">Listen Now</p>
                        <div className="player-wave" id="modalWave"></div>
                        <div className="player-controls">
                            <button className="pc-btn" onClick={(e) => (window as any).togglePlay(e.currentTarget)}>▶ Play</button>
                            <button className="pc-btn pc-save">♡ Save to Diary</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* ══════════════════════════════════
             PAGE: CHURCH DIARY
        ══════════════════════════════════════ */}
            <div className="page" id="page-diary">
                <div className="diary-layout">
                    <aside className="diary-sidebar">
                        <div className="diary-sidebar-head">
                            <h2 className="diary-sidebar-title">My Diary</h2>
                            <button className="new-entry-btn" onClick={() => (window as any).showNewEntry()}>+ New</button>
                        </div>
                        <div className="diary-entry-list" id="diaryList"></div>
                    </aside>
                    <main id="diaryMain">
                        <div className="diary-main" id="diaryMainContent"></div>
                        <div className="new-entry-form" id="newEntryForm">
                            <h2 className="nef-title">New Diary Entry</h2>
                            <button className="nef-cancel" onClick={() => (window as any).cancelNewEntry()}>Cancel</button>
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

            {/* ══════════════════════════════════
             PAGE: SUBSCRIPTIONS
        ══════════════════════════════════════ */}
            <div className="page" id="page-subs">
                <div className="sub-hero">
                    <h1 className="sub-hero-title">Support Canticle</h1>
                    <div className="sub-toggle">
                        <button className="sub-toggle-btn active" onClick={(e) => (window as any).setBilling(e.currentTarget, 'monthly')}>Monthly</button>
                        <button className="sub-toggle-btn" onClick={(e) => (window as any).setBilling(e.currentTarget, 'annual')}>Annual</button>
                    </div>
                    <div className="sub-plans" id="subPlans"></div>

                    {/* Stats Footer Layout requested by user */}
                    <div style={{ marginTop: '80px', paddingTop: '64px', borderTop: '1px solid rgba(184,147,90,0.15)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '32px', textAlign: 'center', opacity: 0.8 }} className="reveal from-bottom">
                        <div>
                            <p style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#b8935a', marginBottom: '8px' }}>Trusted by believers worldwide</p>
                            <p style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '2.5rem', color: 'var(--ink)' }}>12k+</p>
                            <p style={{ fontSize: '0.8rem', color: 'var(--muted)', marginTop: '4px' }}>Active members</p>
                        </div>
                        <div>
                            <p style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '2.5rem', color: 'var(--ink)' }}>{initialHymns.length}+</p>
                            <p style={{ fontSize: '0.8rem', color: 'var(--muted)', marginTop: '4px' }}>Hymns available</p>
                        </div>
                        <div>
                            <p style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '2.5rem', color: 'var(--ink)' }}>365</p>
                            <p style={{ fontSize: '0.8rem', color: 'var(--muted)', marginTop: '4px' }}>Daily devotionals</p>
                        </div>
                        <div>
                            <p style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '2.5rem', color: 'var(--ink)' }}>∞</p>
                            <p style={{ fontSize: '0.8rem', color: 'var(--muted)', marginTop: '4px' }}>Diary entries</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
