import { currentUser } from "@clerk/nextjs/server";
import { db } from "./prisma";

export const checkUser = async () => {
  const clerkUser = await currentUser();

  if (!clerkUser) {
    return null;
  }

  try {
    // Use findFirst with select to reduce data transfer
    const loggedInUser = await db.user.findUnique({
      where: {
        clerkUserId: clerkUser.id,
      },
      select: {
        id: true,
        clerkUserId: true,
        name: true,
        imageUrl: true,
        email: true,
        role: true,
        verificationStatus: true,
        credits: true,
        createdAt: true,
        transactions: {
          where: {
            type: "CREDIT_PURCHASE",
            // Only get transactions from current month
            createdAt: {
              gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
            },
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
        },
      },
    });

    if (loggedInUser) {
      return loggedInUser;
    }

    const name = `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim();

    const newUser = await db.user.create({
      data: {
        clerkUserId: clerkUser.id,
        name: name || 'User',
        imageUrl: clerkUser.imageUrl,
        email: clerkUser.emailAddresses[0]?.emailAddress || '',
        credits: 2, // Explicitly set initial credits for new users
        transactions: {
          create: {
            type: "CREDIT_PURCHASE",
            packageId: "free_user",
            amount: 2, // Give them 2 credits initially
          },
        },
      },
    });

    return newUser;
  } catch (error) {
    console.error("checkUser error:", error);
    return null;
  }
};
