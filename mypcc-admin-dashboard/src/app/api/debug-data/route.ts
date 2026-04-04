import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const [hymnCount, diaryCount, echoCount, devoCount, settingsCount] = await Promise.all([
      prisma.hymn.count(),
      prisma.diaryEntry.count({ where: { userId: null } }),
      prisma.theEchoIssue.count(),
      prisma.devotional.count(),
      prisma.appSetting.count(),
    ]);

    // Also test a sample fetch
    const sampleHymn = await prisma.hymn.findFirst({ select: { id: true, title: true, number: true } });
    const sampleDiary = await prisma.diaryEntry.findFirst({ where: { userId: null }, select: { id: true, title: true } });
    const sampleEcho = await prisma.theEchoIssue.findFirst({ select: { id: true, title: true } });

    return NextResponse.json({
      status: "OK",
      timestamp: new Date().toISOString(),
      counts: {
        hymns: hymnCount,
        diary: diaryCount,
        echo: echoCount,
        devotionals: devoCount,
        settings: settingsCount,
      },
      samples: {
        hymn: sampleHymn,
        diary: sampleDiary,
        echo: sampleEcho,
      },
      env: {
        hasDbUrl: !!process.env.DATABASE_URL,
        hasBackendUrl: !!process.env.NEXT_PUBLIC_BACKEND_URL,
        isVercel: !!process.env.VERCEL,
        backendUrl: process.env.NEXT_PUBLIC_BACKEND_URL || "(not set)",
      }
    });
  } catch (error: any) {
    return NextResponse.json({
      status: "ERROR",
      error: error.message,
      stack: error.stack?.split('\n').slice(0, 5),
    }, { status: 500 });
  }
}
