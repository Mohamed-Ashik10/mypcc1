import { fetchFromBackend } from "@/lib/api";

// ─── Backend Fetchers ────────────────────────────────────────────────────────
// Using fetchFromBackend with standard revalidation tags

const getHymns = () => 
  fetchFromBackend<any[]>("/api/public/hymns", { revalidate: 3600 });

const getEcho = () => 
  fetchFromBackend<any[]>("/api/public/echo", { revalidate: 300 });

const getDevotionals = () => 
  fetchFromBackend<any[]>("/api/public/devotionals", { revalidate: 3600 });

const getAnnouncements = () => 
  fetchFromBackend<any[]>("/api/public/announcements", { revalidate: 600 });

const getDiary = () => 
  fetchFromBackend<any[]>("/api/public/diary", { revalidate: 3600 });

const getTestimonials = () => 
  fetchFromBackend<any[]>("/api/public/testimonials", { revalidate: 3600 });

const getSettings = () =>
  fetchFromBackend<Record<string, string>>("/api/public/settings", { revalidate: 0 });

// ─── Page Component ───────────────────────────────────────────────────────────
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma"; // Still used for user-specific data for now
import LandingPageClient from "@/components/LandingPageClient";

export default async function Home() {

  const session = await getServerSession(authOptions);

  let hymns: any[] = [];
  let echoIssues: any[] = [];
  let latestDevotional: any = null;
  let archivedDevotionals: any[] = [];
  let announcements: any[] = [];
  let testimonials: any[] = [];
  let churchDiary: any[] = [];
  let appName = "Canticle";
  let logoApp = "/logo.png";
  let footerDesc = "A sacred digital space for believers to read hymns, keep a spiritual diary, and grow daily in faith.";
  let contactEmail = "hello@canticle.app";
  let themePreset = "sacred-red";

  try {
    const [fetchedHymns, fetchedEcho, fetchedTestimonials, fetchedAnnouncements, fetchedDiary, settings] = await Promise.all([
      getHymns(),
      getEcho(),
      getTestimonials(),
      getAnnouncements(),
      getDiary(),
      getSettings()
    ]);

    hymns = fetchedHymns || [];
    echoIssues = fetchedEcho || [];
    testimonials = fetchedTestimonials || [];
    announcements = fetchedAnnouncements || [];
    churchDiary = fetchedDiary || [];

    if (settings) {
      if (settings.app_name) appName = settings.app_name;
      if (settings.logo_app) logoApp = settings.logo_app;
      if (settings.contact_email) contactEmail = settings.contact_email;
      if (settings.footer_desc) footerDesc = settings.footer_desc;
      if (settings.theme_preset) themePreset = settings.theme_preset;
    }

    const devotionals = await getDevotionals().catch(e => {
        console.warn("Devotionals fetch failed during build. Using empty list.");
        return [];
    });
    latestDevotional = devotionals[0] || null;
    archivedDevotionals = devotionals.slice(1);

  } catch (error) {
    console.error("Backend fetch failed. Attempting Direct Database Fallback...", error);
    // FALLBACK: Fetch directly from database if backend is offline
    try {
        const [dbHymns, dbEcho, dbTestimonials, dbAnnouncements, dbDiary, dbSettings] = await Promise.all([
            prisma.hymn.findMany({ orderBy: { number: 'asc' } }),
            prisma.theEchoIssue.findMany({ orderBy: { issueMonth: 'desc' } }),
            prisma.testimonial.findMany({ where: { isActive: true } }),
            prisma.announcement.findMany({ where: { isActive: true } }),
            prisma.diaryEntry.findMany({ where: { userId: null }, orderBy: { date: 'desc' } }),
            prisma.appSetting.findMany()
        ]);
        
        hymns = dbHymns;
        echoIssues = dbEcho;
        testimonials = dbTestimonials;
        announcements = dbAnnouncements;
        churchDiary = dbDiary;
        
        const settingsMap: Record<string, string> = {};
        dbSettings.forEach(s => settingsMap[s.key] = s.value);
        if (settingsMap.app_name) appName = settingsMap.app_name;
        if (settingsMap.logo_app) logoApp = settingsMap.logo_app;
        if (settingsMap.contact_email) contactEmail = settingsMap.contact_email;
        if (settingsMap.footer_desc) footerDesc = settingsMap.footer_desc;
        if (settingsMap.theme_preset) themePreset = settingsMap.theme_preset;

        const dbDevotionals = await prisma.devotional.findMany({ orderBy: { date: 'desc' } });
        latestDevotional = dbDevotionals[0] || null;
        archivedDevotionals = dbDevotionals.slice(1);
    } catch (dbError) {
        console.error("Critical: Direct Database fallback also failed.", dbError);
    }
  }

  // Format Church Diary Dates safely
  const formattedDiary = churchDiary.map(d => ({
    id: d.id,
    title: d.title,
    body: d.body,
    author: d.author,
    hymn: d.hymn,
    category: d.category,
    date: d.date ? new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'No Date'
  }));

  let hasActiveSubscription = false;
  let subscriptionType: string | null = null;
  let formattedFavorites: string[] = [];

  let userDiary: any[] = [];
  const userId = (session?.user as any)?.id;
  if (userId) {
    try {
      const [userSub, userFavs, personalEntries] = await Promise.all([
        prisma.subscription.findFirst({ where: { userId, status: "ACTIVE" } }),
        prisma.hymnFavourite.findMany({ where: { userId }, select: { hymnId: true } }),
        prisma.diaryEntry.findMany({ where: { userId }, orderBy: { date: "desc" } }),
      ]);

      hasActiveSubscription = !!userSub;
      if (userSub) subscriptionType = userSub.type;
      formattedFavorites = userFavs.map(f => f.hymnId);

      userDiary = personalEntries.map(e => ({
        id: e.id,
        title: e.title,
        body: e.body,
        hymn: e.hymn,
        date: e.date ? new Date(e.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'No Date'
      }));
    } catch (err) {
      console.error("Failed to fetch user data", err);
    }
  }

  // MISSION CRITICAL: Map Database Echo Issues to Logic Script expectations
  const mappedEcho = echoIssues.map(a => ({
    id: a.id,
    cat: (a.category || 'news').toLowerCase(), // Labeled 'cat', Lowercased for UI filter matching
    title: a.title,
    author: a.author || 'PCC Admin',
    date: a.issueMonth ? new Date(a.issueMonth).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'No Date',
    excerpt: a.excerpt || 'Read the latest issue of The Echo.',
    fullText: a.fullText || '',
    coverUrl: a.coverUrl,
    pdfUrl: a.pdfUrl,
    isFeatured: a.isFeatured,
    images: a.images
  }));

  // Format Hymns to ensure 'num' exists (legacy compat)
  const mappedHymns = hymns.map(h => ({
    ...h,
    num: (h.number || '').toString().padStart(3, '0') // Logic script expects 'num'
  }));

  // Enforce Paywall / Tier Limits
  // SEEKER = Basic, PILGRIM = Moderate, SHEPHERD = Advanced
  let targetLimit = 50; // Normal User limit

  if (hasActiveSubscription) {
    if (subscriptionType === 'SEEKER') {
      targetLimit = 200;
    } else if (subscriptionType === 'PILGRIM') {
      targetLimit = 400;
    } else if (subscriptionType === 'SHEPHERD') {
      targetLimit = Infinity; // Give them all hymns
    }
  }

  // MISSION CRITICAL: Master Privilege - Admins bypass all gating
  const isMasterAccount = ['ADMIN', 'SUPER_ADMIN'].includes((session?.user as any)?.role?.toUpperCase() || "");
  if (isMasterAccount) {
    targetLimit = Infinity;
    subscriptionType = subscriptionType || 'SHEPHERD'; // For UI badges
  }

  if (targetLimit < Infinity) {
    // We want a varied sample library, but the TOTAL must not exceed targetLimit.
    const sliceCount = Math.max(10, Math.floor(targetLimit / 5));

    const praise = hymns.filter(h => typeof h.tags === 'string' && h.tags.toLowerCase().includes('praise')).slice(0, sliceCount);
    const grace = hymns.filter(h => typeof h.tags === 'string' && h.tags.toLowerCase().includes('grace')).slice(0, sliceCount);
    const faith = hymns.filter(h => typeof h.tags === 'string' && h.tags.toLowerCase().includes('faith')).slice(0, sliceCount);
    const comfort = hymns.filter(h => typeof h.tags === 'string' && h.tags.toLowerCase().includes('comfort')).slice(0, sliceCount);
    const advent = hymns.filter(h => typeof h.tags === 'string' && h.tags.toLowerCase().includes('advent')).slice(0, sliceCount);
    
    const combined = [...praise, ...grace, ...faith, ...comfort, ...advent];
    const uniqueMap = new Map();
    combined.forEach(h => uniqueMap.set(h.id, h)); 
    
    let finalHymns = Array.from(uniqueMap.values());
    if (finalHymns.length < targetLimit) {
        const remainingNeeded = targetLimit - finalHymns.length;
        const extraHymns = hymns.filter(h => !uniqueMap.has(h.id)).slice(0, remainingNeeded);
        finalHymns = [...finalHymns, ...extraHymns];
    }

    hymns = finalHymns.sort((a, b) => a.number - b.number);

    // --- ENHANCED CONTENT GATING (HEAVIER FREE SAMPLES) ---
    // Hierarchical access check (Shepherd > Pilgrim > Seeker > Free)
    const isShepherd = subscriptionType === 'SHEPHERD';
    const isPilgrim = ['PILGRIM', 'SHEPHERD'].includes(subscriptionType || "");
    const isSeeker = ['SEEKER', 'PILGRIM', 'SHEPHERD'].includes(subscriptionType || "");

    // 1. The Echo Gating: Hierarchical access
    if (!isShepherd) {
      const limit = isPilgrim ? 20 : (isSeeker ? 10 : 5);
      if (echoIssues.length > limit) {
        echoIssues = echoIssues.slice(0, limit);
      }
    }

    // 2. Devotional Grid Gating: Hierarchical access
    if (!isShepherd) {
      const limit = isPilgrim ? 50 : (isSeeker ? 20 : 10);
      if (archivedDevotionals.length > limit) {
        archivedDevotionals = archivedDevotionals.slice(0, limit);
      }
    }
  }

  // Format data for the client
  const formattedHymns = (hymns || []).map((h: any, index: number) => {
    if (!h) return null;
    const num = typeof h.number === 'number' ? h.number.toString().padStart(3, '0') : 
                (typeof h.num === 'string' ? h.num : '000');
    
    const lyricsArr = typeof h.lyrics === 'string' ? h.lyrics.split(/\n\s*\n/).filter(Boolean).map((part: string) => ({
      type: /\[refrain\]/i.test(part) ? 'refrain' : 'stanza',
      text: part.replace(/\[REFRAIN\]\n?/i, '').trim()
    })) : (Array.isArray(h.lyrics) ? h.lyrics : []);

    const tagsArr = h.tags ? (typeof h.tags === 'string' ? h.tags.split(',').map((t: string) => t.trim()) : h.tags) : ["faith", "praise"];
    const searchContent = [num, h.title, h.author, ...tagsArr, ...lyricsArr.map((l: any) => l.text)].join(' ').toLowerCase();

    return {
      id: h.id || `h-${Math.random()}`,
      num: num,
      title: h.title || "Untitled Hymn",
      author: h.author || "PCC Library",
      tags: tagsArr,
      lyrics: lyricsArr,
      searchContent: searchContent
    };
  }).filter(Boolean);

  const formattedEcho = echoIssues.map((issue: any) => {
    const d = issue.issueMonth ? new Date(issue.issueMonth) : null;
    const isValid = d && !isNaN(d.getTime());
    return {
      id: issue.id || null,
      cat: issue.category || 'news',
      title: issue.title || "Untitled Issue",
      author: issue.author || "Admin",
      date: isValid ? d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Unknown Date',
      excerpt: issue.excerpt || (isValid ? `Latest issue of The Echo for ${d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}.` : "Latest issue of The Echo."),
      fullText: issue.fullText || null,
      pdfUrl: issue.pdfUrl || "#",
      coverUrl: issue.coverUrl || null,
      images: issue.images || [],
      isFeatured: issue.isFeatured ?? false
    };
  });

  const formattedDevotional = latestDevotional ? {
    id: latestDevotional.id,
    title: latestDevotional.title,
    date: new Date(latestDevotional.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    content: latestDevotional.content,
    author: latestDevotional.author || "PCC Community",
    excerpt: latestDevotional.excerpt,
    image: latestDevotional.image,
    reading: latestDevotional.reading,
    category: latestDevotional.category,
    isFree: latestDevotional.isFree,
    minPlan: latestDevotional.minPlan
  } : null;

  const formattedArchive = archivedDevotionals.map((d: any) => ({
    id: d.id,
    title: d.title,
    date: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    content: d.content,
    author: d.author || "PCC Community",
    excerpt: d.excerpt,
    image: d.image,
    reading: d.reading,
    category: d.category,
    isFree: d.isFree,
    minPlan: d.minPlan
  }));

  return (
    <LandingPageClient
      session={session}
      appName={appName}
      logoApp={logoApp}
      footerDesc={footerDesc}
      contactEmail={contactEmail}
      initialHymns={formattedHymns}
      initialEcho={formattedEcho}
      initialDevotional={formattedDevotional}
      initialArchive={formattedArchive}
      initialDiary={formattedDiary}
      initialUserDiary={userDiary}
      initialAnnouncements={announcements}
      initialTestimonials={testimonials}
      initialFavorites={formattedFavorites}
      isPaywallActive={targetLimit < Infinity}
      subscriptionType={subscriptionType}
      themePreset={themePreset}
    />
  );
}
