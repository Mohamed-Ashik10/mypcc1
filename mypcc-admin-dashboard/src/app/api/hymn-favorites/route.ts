import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { fetchFromBackend } from '@/lib/api';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !(session.user as any).id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const favorites = await fetchFromBackend<any[]>(`/api/public/user-activity/favorites/${userId}`);
    return NextResponse.json(favorites);

  } catch (error) {
    console.error('Error fetching favorites:', error);
    return NextResponse.json({ error: 'Failed to fetch favorites from backend' }, { status: 500 });
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

    const data = await fetchFromBackend<any>("/api/public/user-activity/favorites/toggle", {
      method: "POST",
      body: JSON.stringify({ userId, hymnId })
    });
    return NextResponse.json(data);

  } catch (error: any) {
    console.error('Error toggling favorite:', error);
    return NextResponse.json({ error: error.message || 'Failed to toggle favorite' }, { status: 500 });
  }
}
