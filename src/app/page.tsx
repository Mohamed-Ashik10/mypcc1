import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import LandingPageClient from "@/components/LandingPageClient";
import { unstable_cache } from "next/cache";

// ─── Cached DB Queries ────────────────────────────────────────────────────────
// Hymns rarely change — cache for 1 hour (3600s)
const getCachedHymns = unstable_cache(
  async () => prisma.hymn.findMany({ take: 500, orderBy: { number: "asc" } }),
  ["hymns-home"],
  { revalidate: 3600, tags: ["hymns"] }
);

// Echo issues change occasionally — cache for 30 minutes
const getCachedEcho = unstable_cache(
  async () => prisma.theEchoIssue.findMany({ take: 6, orderBy: { issueMonth: "desc" } }),
  ["echo-home"],
  { revalidate: 1800, tags: ["echo"] }
);

// Devotionals change once per day — cache for 1 hour
const getCachedDevotionals = unstable_cache(
  async () =>
    prisma.devotional.findMany({
      where: { date: { lte: new Date() } },
      orderBy: { date: "desc" },
      take: 8,
    }),
  ["devotionals-home"],
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

// ─── Page Component ───────────────────────────────────────────────────────────
export default async function Home() {
  const session = await getServerSession(authOptions);

  let hymns: any[] = [];
  let echoIssues: any[] = [];
  let latestDevotional: any = null;
  let archivedDevotionals: any[] = [];
  let announcements: any[] = [];

  try {
    [hymns, echoIssues, , announcements] = await Promise.all([
      getCachedHymns(),
      getCachedEcho(),
      Promise.resolve(), // placeholder
      getCachedAnnouncements(),
    ]);

    const devotionals = await getCachedDevotionals();
    latestDevotional = devotionals[0] || null;
    archivedDevotionals = devotionals.slice(1);
  } catch (error) {
    console.error("Database connection failed. Serving empty data array fallback.", error);
  }

  // Format data for the client
  const formattedHymns = hymns.map((h: any) => ({
    num: h.number.toString().padStart(3, '0'),
    title: h.title,
    author: h.author || "PCC Library",
    tags: h.tags ? h.tags.split(',').map((t: string) => t.trim()) : ["faith", "praise"],
    lyrics: h.lyrics.split('\n\n').map((part: string) => ({
      type: part.toLowerCase().includes('[refrain]') ? 'refrain' : 'stanza',
      text: part.replace('[REFRAIN]\n', '')
    }))
  }));

  const formattedEcho = echoIssues.map((issue: any) => ({
    cat: issue.category || 'news',
    title: issue.title,
    author: issue.author || "Admin",
    date: new Date(issue.issueMonth).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    excerpt: issue.excerpt || `Latest issue of The Echo for ${new Date(issue.issueMonth).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}.`,
    fullText: issue.fullText || "Download the PDF to read the full story.",
    pdfUrl: issue.pdfUrl,
    coverUrl: issue.coverUrl
  }));

  const formattedDevotional = latestDevotional ? {
    title: latestDevotional.title,
    date: new Date(latestDevotional.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    content: latestDevotional.content,
    author: latestDevotional.author || "PCC Community"
  } : null;

  const formattedArchive = archivedDevotionals.map((d: any) => ({
    title: d.title,
    date: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    content: d.content,
    author: d.author || "PCC Community"
  }));

  return (
    <LandingPageClient
      session={session}
      initialHymns={formattedHymns}
      initialEcho={formattedEcho}
      initialDevotional={formattedDevotional}
      initialArchive={formattedArchive}
      initialDiary={[]}
      initialAnnouncements={announcements}
    />
  );
}
