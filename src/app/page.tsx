import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import LandingPageClient from "@/components/LandingPageClient";
import { unstable_cache } from "next/cache";

// ─── Cached DB Queries ────────────────────────────────────────────────────────
// Hymns rarely change — cache for 1 hour (3600s)
const getCachedHymns = unstable_cache(
  async () => prisma.hymn.findMany({ take: 2000, orderBy: { number: "asc" } }),
  ["hymns-home-v2"],
  { revalidate: 3600, tags: ["hymns-v2"] }
);

// Echo issues — short cache so fullText edits show quickly (5 min)
const getCachedEcho = unstable_cache(
  async () => prisma.theEchoIssue.findMany({ take: 100, orderBy: { issueMonth: "desc" } }),
  ["echo-home-v3"],
  { revalidate: 300, tags: ["echo"] }
);

// Devotionals change once per day — cache for 1 hour
const getCachedDevotionals = unstable_cache(
  async () =>
    prisma.devotional.findMany({
      where: { date: { lte: new Date() } },
      orderBy: { date: "desc" },
      take: 8,
      select: {
        id: true,
        title: true,
        date: true,
        content: true,
        author: true,
        excerpt: true,
        image: true,
        reading: true,
        category: true,
        isFree: true,
        minPlan: true,
      }
    }),
  ["devotionals-home-v2"],
  { revalidate: 3600, tags: ["devotionals"] }
);

// Announcements may change more frequently — cache for 10 minutes
const getCachedAnnouncements = unstable_cache(
  async () =>
    prisma.announcement.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
      take: 3,
    }),
  ["announcements-home"],
  { revalidate: 600, tags: ["announcements"] }
);

// Church Diary entries — cache for 1 hour
const getCachedDiary = unstable_cache(
  async () => prisma.diaryEntry.findMany({ 
    where: { userId: null },
    orderBy: { date: "desc" },
    take: 30 
  }),
  ["diary-home"],
  { revalidate: 3600, tags: ["diary"] }
);

// Testimonials
const getCachedTestimonials = unstable_cache(
  async () =>
    prisma.testimonial.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
      take: 3,
    }),
  ["testimonials-home"],
  { revalidate: 3600, tags: ["testimonials"] }
);

// ─── Page Component ───────────────────────────────────────────────────────────
export default async function Home() {
  const session = await getServerSession(authOptions);

  let hymns: any[] = [];
  let echoIssues: any[] = [];
  let latestDevotional: any = null;
  let archivedDevotionals: any[] = [];
  let announcements: any[] = [];
  let testimonials: any[] = [];
  let churchDiary: any[] = [];

  try {
    [hymns, echoIssues, testimonials, announcements, churchDiary] = await Promise.all([
      getCachedHymns(),
      getCachedEcho(),
      getCachedTestimonials(),
      getCachedAnnouncements(),
      getCachedDiary(),
    ]);

    const devotionals = await getCachedDevotionals();
    latestDevotional = devotionals[0] || null;
    archivedDevotionals = devotionals.slice(1);
  } catch (error) {
    console.error("Database connection failed. Serving empty data array fallback.", error);
  }

  // Format Church Diary Dates safely
  const formattedDiary = churchDiary.map(d => ({
    ...d,
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
        ...e,
        date: e.date ? new Date(e.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'No Date'
      }));
    } catch (err) {
      console.error("Failed to fetch user data", err);
    }
  }

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

  if (targetLimit < Infinity) {
    // We want a varied sample library, but the TOTAL must not exceed targetLimit.
    // So we pick (targetLimit / 5) from each major category.
    const sliceCount = Math.max(10, Math.floor(targetLimit / 5));

    const praise = hymns.filter(h => typeof h.tags === 'string' && h.tags.toLowerCase().includes('praise')).slice(0, sliceCount);
    const grace = hymns.filter(h => typeof h.tags === 'string' && h.tags.toLowerCase().includes('grace')).slice(0, sliceCount);
    const faith = hymns.filter(h => typeof h.tags === 'string' && h.tags.toLowerCase().includes('faith')).slice(0, sliceCount);
    const comfort = hymns.filter(h => typeof h.tags === 'string' && h.tags.toLowerCase().includes('comfort')).slice(0, sliceCount);
    const advent = hymns.filter(h => typeof h.tags === 'string' && h.tags.toLowerCase().includes('advent')).slice(0, sliceCount);
    
    // Combine and sort by number. Make sure to deduplicate since some hymns have multiple tags.
    const combined = [...praise, ...grace, ...faith, ...comfort, ...advent];
    const uniqueMap = new Map();
    combined.forEach(h => uniqueMap.set(h.id, h)); 
    
    // If deduplication caused us to drop below targetLimit slightly, we pad it with the first few hymns
    let finalHymns = Array.from(uniqueMap.values());
    if (finalHymns.length < targetLimit) {
        const remainingNeeded = targetLimit - finalHymns.length;
        const extraHymns = hymns.filter(h => !uniqueMap.has(h.id)).slice(0, remainingNeeded);
        finalHymns = [...finalHymns, ...extraHymns];
    }

    hymns = finalHymns.sort((a, b) => a.number - b.number);
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
    />
  );
}
