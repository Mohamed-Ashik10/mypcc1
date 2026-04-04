import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { fetchFromBackend } from '@/lib/api';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !(session.user as any).id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).id;
    
    // Attempt backend first, fallback to Prisma
    try {
        const favorites = await fetchFromBackend<any[]>(`/api/public/user-activity/favorites/${userId}`);
        return NextResponse.json(favorites);
    } catch (backendError) {
        console.warn('Backend favorites fetch failed, using Prisma fallback');
        const favorites = await prisma.hymnFavourite.findMany({
            where: { userId },
            select: { hymnId: true }
        });
        return NextResponse.json(favorites.map(f => f.hymnId));
    }

  } catch (error) {
    console.error('Error fetching favorites:', error);
    return NextResponse.json({ error: 'Failed to fetch favorites' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !(session.user as any).id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const { hymnId } = await request.json();

    if (!hymnId) {
      return NextResponse.json({ error: 'Hymn ID is required' }, { status: 400 });
    }

    // Attempt backend first, fallback to Prisma direct toggle
    try {
        const data = await fetchFromBackend<any>("/api/public/user-activity/favorites/toggle", {
            method: "POST",
            body: JSON.stringify({ userId, hymnId })
        });
        return NextResponse.json(data);
    } catch (backendError) {
        console.warn('Backend favorite toggle failed, using Prisma direct toggle');
        
        // Find if it exists
        const existing = await prisma.hymnFavourite.findUnique({
            where: {
                userId_hymnId: { userId, hymnId }
            }
        });

        if (existing) {
            await prisma.hymnFavourite.delete({
                where: {
                    userId_hymnId: { userId, hymnId }
                }
            });
            return NextResponse.json({ message: 'Removed from favorites', active: false });
        } else {
            await prisma.hymnFavourite.create({
                data: {
                    id: `${userId}_${hymnId}`, // Manual ID since schema doesn't have @default(cuid()) on HymnFavourite.id
                    userId,
                    hymnId
                }
            });
            return NextResponse.json({ message: 'Added to favorites', active: true });
        }
    }

  } catch (error: any) {
    console.error('Error toggling favorite:', error);
    return NextResponse.json({ error: error.message || 'Failed to toggle favorite' }, { status: 500 });
  }
}
