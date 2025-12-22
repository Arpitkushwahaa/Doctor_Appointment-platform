import { NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { db } from '@/lib/prisma';

// Force dynamic rendering since we use auth
export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: {
        clerkUserId: userId,
      },
    });

    if (existingUser) {
      return NextResponse.json({ 
        message: 'User already exists', 
        user: existingUser 
      });
    }

    // Get user info from Clerk using currentUser
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return NextResponse.json({ error: 'Failed to get user information' }, { status: 400 });
    }

    const name = `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim();

    // Create new user with initial credits
    const newUser = await db.user.create({
      data: {
        clerkUserId: userId,
        name: name || 'User',
        imageUrl: clerkUser.imageUrl,
        email: clerkUser.emailAddresses[0]?.emailAddress || '',
        credits: 2, // Give new users 2 credits initially
        transactions: {
          create: {
            type: "CREDIT_PURCHASE",
            packageId: "free_user",
            amount: 2, // Initial credits transaction
          },
        },
      },
    });

    return NextResponse.json({ 
      message: 'User created successfully', 
      user: newUser 
    });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
