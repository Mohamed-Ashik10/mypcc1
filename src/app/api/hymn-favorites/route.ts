import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !(session.user as any).id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).id;

    // Fetch all favorites for the user along with the hymn data if needed
    const favorites = await prisma.hymnFavourite.findMany({
      where: { userId },
      include: {
        hymn: true
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(favorites);

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

    // Check if the favorite already exists
    const existingFav = await prisma.hymnFavourite.findUnique({
      where: {
        userId_hymnId: {
          userId,
          hymnId
        }
      }
    });

    if (existingFav) {
      // Toggle off (remove)
      await prisma.hymnFavourite.delete({
        where: { id: existingFav.id }
      });
      return NextResponse.json({ message: 'Removed from favorites', action: 'removed' });
    } else {
      // Toggle on (add)
      // Note: hymnFavourite requires an explicitly generated ID according to the schema in some setups,
      // but if we look at schema.prisma it has id String @id (no @default(cuid()) ?? wait let me check)
      // Generate a manual ID string to ensure no crypto availability issues
      const newId = 'fav_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
      await prisma.hymnFavourite.create({
        data: {
          id: newId,
          userId,
          hymnId
        }
      });
      return NextResponse.json({ message: 'Added to favorites', action: 'added' }, { status: 201 });
    }

  } catch (error) {
    console.error('Error toggling favorite:', error);
    return NextResponse.json({ error: 'Failed to toggle favorite' }, { status: 500 });
  }
}
