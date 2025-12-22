import { NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';

// Force dynamic rendering since we use auth
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { userId } = await auth();
    const clerkUser = await currentUser();
    
    return NextResponse.json({ 
      message: 'Test endpoint working',
      userId: userId,
      clerkUser: clerkUser ? {
        id: clerkUser.id,
        firstName: clerkUser.firstName,
        lastName: clerkUser.lastName,
        email: clerkUser.emailAddresses[0]?.emailAddress
      } : null,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Test endpoint error:', error);
    return NextResponse.json({ error: 'Test failed', message: error.message }, { status: 500 });
  }
}
