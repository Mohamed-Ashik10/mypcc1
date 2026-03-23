import { revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';

export async function GET() {
  (revalidateTag as any)('devotionals');
  return NextResponse.json({ revalidated: true, now: Date.now() });
}
