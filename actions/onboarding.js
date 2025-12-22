"use server";

import { db } from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

/**
 * Sets the user's role and related information
 */
export async function setUserRole(formData) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  // Find user in our database
  let user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  // If user doesn't exist, create them first
  if (!user) {
    try {
      console.log("User not found, creating new user...");
      
      // Get user info from Clerk using currentUser
      const clerkUser = await currentUser();
      if (!clerkUser) {
        console.error("Failed to get currentUser from Clerk, using fallback...");
        
        // Fallback: create user with minimal data
        user = await db.user.create({
          data: {
            clerkUserId: userId,
            name: 'New User',
            email: '', // Will be updated later
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
        
        console.log("Created user with fallback data:", user.id);
      } else {
        console.log("Got Clerk user:", {
          id: clerkUser.id,
          firstName: clerkUser.firstName,
          lastName: clerkUser.lastName,
          email: clerkUser.emailAddresses[0]?.emailAddress
        });

        const name = `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim();
        
        // Create new user with initial credits
        user = await db.user.create({
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
        
        console.log("Successfully created new user:", user.id);
      }
    } catch (error) {
      console.error("Failed to create user:", error);
      throw new Error(`Failed to create user account: ${error.message}`);
    }
  }

  const role = formData.get("role");

  if (!role || !["PATIENT", "DOCTOR"].includes(role)) {
    throw new Error("Invalid role selection");
  }

  try {
    // For patient role - simple update
    if (role === "PATIENT") {
      await db.user.update({
        where: {
          clerkUserId: userId,
        },
        data: {
          role: "PATIENT",
        },
      });

      revalidatePath("/");
      return { success: true, redirect: "/doctors" };
    }

    // For doctor role - need additional information
    if (role === "DOCTOR") {
      const specialty = formData.get("specialty");
      const experience = parseInt(formData.get("experience"), 10);
      const credentialUrl = formData.get("credentialUrl");
      const description = formData.get("description");

      // Validate inputs
      if (!specialty || !experience || !credentialUrl || !description) {
        throw new Error("All fields are required");
      }

      await db.user.update({
        where: {
          clerkUserId: userId,
        },
        data: {
          role: "DOCTOR",
          specialty,
          experience,
          credentialUrl,
          description,
          verificationStatus: "PENDING",
        },
      });

      revalidatePath("/");
      return { success: true, redirect: "/doctor/verification" };
    }
  } catch (error) {
    console.error("Failed to set user role:", error);
    throw new Error(`Failed to update user profile: ${error.message}`);
  }
}

/**
 * Gets the current user's complete profile information
 */
export async function getCurrentUser() {
  const { userId } = await auth();
  console.log("DEBUG: getCurrentUser - Clerk User ID:", userId); // Log Clerk User ID

  if (!userId) {
    return null;
  }

  try {
    let user = await db.user.findUnique({
      where: {
        clerkUserId: userId,
      },
    });
    
    // If user doesn't exist, create them
    if (!user) {
      try {
        const clerkUser = await currentUser();
        if (!clerkUser) {
          return null;
        }

        const name = `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim();
        
        user = await db.user.create({
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
        
        console.log("Created new user in getCurrentUser:", user.id);
      } catch (error) {
        console.error("Failed to create user in getCurrentUser:", error);
        return null;
      }
    }
    
    console.log("DEBUG: getCurrentUser - User from DB:", JSON.stringify(user, null, 2)); // Log user object
    return user;
  } catch (error) {
    console.error("getCurrentUser error:", error);
    return null;
  }
}
