import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import LandingPageClient from "@/components/LandingPageClient";

export default async function Home() {
  const session = await getServerSession(authOptions);

  let hymns: any[] = [];
  let echoIssues: any[] = [];
  let latestDevotional: any = null;
  let diaryEntries: any[] = [];
  let announcements: any[] = [];

  try {
    // Fetch real data from the database sequentially to prevent Prisma connection pool deadlocks in Dev mode
    hymns = await prisma.hymn.findMany({
      take: 30,
      orderBy: { number: "asc" },
    });

    echoIssues = await prisma.theEchoIssue.findMany({
      take: 6,
      orderBy: { issueMonth: "desc" },
    });

    latestDevotional = await prisma.devotional.findFirst({
      orderBy: { date: "desc" },
    });

    diaryEntries = await prisma.diaryEntry.findMany({
      take: 3,
      orderBy: { date: "desc" },
    });

    announcements = await prisma.announcement.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
      take: 3,
    });
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
    date: issue.issueMonth.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    excerpt: issue.excerpt || `Latest issue of The Echo for ${issue.issueMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}.`,
    fullText: issue.fullText || "Download the PDF to read the full story.",
    pdfUrl: issue.pdfUrl,
    coverUrl: issue.coverUrl
  }));

  const formattedDevotional = latestDevotional ? {
    title: latestDevotional.title,
    date: latestDevotional.date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    content: latestDevotional.content,
    author: latestDevotional.author || "PCC Community"
  } : null;

  return (
    <LandingPageClient
      session={session}
      initialHymns={formattedHymns}
      initialEcho={formattedEcho}
      initialDevotional={formattedDevotional}
      initialDiary={diaryEntries}
      initialAnnouncements={announcements}
    />
  );
}
