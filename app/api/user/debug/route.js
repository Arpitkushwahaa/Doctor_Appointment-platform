import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/prisma';

// Force dynamic rendering since we use auth
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user from database
    const user = await db.user.findUnique({
      where: {
        clerkUserId: userId,
      },
      include: {
        transactions: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 5,
        },
      },
    });

    if (!user) {
      return NextResponse.json({ 
        message: 'User not found in database',
        clerkUserId: userId,
        suggestion: 'User needs to be created first'
      });
    }

    return NextResponse.json({ 
      message: 'User found',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        credits: user.credits,
        createdAt: user.createdAt,
        transactions: user.transactions,
      }
    });
  } catch (error) {
    console.error('Error debugging user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
