"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

const CREDIT_VALUE = 10; // $10 per credit total
const PLATFORM_FEE_PER_CREDIT = 2; // $2 platform fee
const DOCTOR_EARNINGS_PER_CREDIT = 8; // $8 to doctor

/**
 * Request payout for all remaining credits
 */
export async function requestPayout(formData) {
  const { userId } = await auth();

  if (!userId) {
    return { error: "Unauthorized" };
  }

  try {
    const doctor = await db.user.findUnique({
      where: {
        clerkUserId: userId,
        role: "DOCTOR",
      },
    });

    if (!doctor) {
      return { error: "Doctor not found" };
    }

    if (doctor.verificationStatus !== "VERIFIED") {
      return { error: "Doctor account not yet verified" };
    }

    const paypalEmail = formData.get("paypalEmail");

    if (!paypalEmail) {
      return { error: "PayPal email is required" };
    }

    // Check if doctor has any pending payout requests
    const existingPendingPayout = await db.payout.findFirst({
      where: {
        doctorId: doctor.id,
        status: "PROCESSING",
      },
    });

    if (existingPendingPayout) {
      return { error: "You already have a pending payout request. Please wait for it to be processed." };
    }

    // Get doctor's current credit balance
    const creditCount = doctor.credits;

    if (creditCount === 0) {
      return { error: "No credits available for payout" };
    }

    if (creditCount < 1) {
      return { error: "Minimum 1 credit required for payout" };
    }

    const totalAmount = creditCount * CREDIT_VALUE;
    const platformFee = creditCount * PLATFORM_FEE_PER_CREDIT;
    const netAmount = creditCount * DOCTOR_EARNINGS_PER_CREDIT;

    // Create payout request
    const payout = await db.payout.create({
      data: {
        doctorId: doctor.id,
        amount: totalAmount,
        credits: creditCount,
        platformFee,
        netAmount,
        paypalEmail,
        status: "PROCESSING",
      },
    });

    revalidatePath("/doctor");
    return { success: true, payout };
  } catch (error) {
    console.error("Failed to request payout:", error);
    return { error: "Failed to request payout: " + error.message };
  }
}

/**
 * Get doctor's payout history
 */
export async function getDoctorPayouts() {
  const { userId } = await auth();

  if (!userId) {
    return { error: "Unauthorized", payouts: [] };
  }

  try {
    const doctor = await db.user.findUnique({
      where: {
        clerkUserId: userId,
        role: "DOCTOR",
      },
    });

    if (!doctor) {
      return { error: "Doctor not found", payouts: [] };
    }

    if (doctor.verificationStatus !== "VERIFIED") {
      return { error: "Doctor account not yet verified", payouts: [] };
    }

    const payouts = await db.payout.findMany({
      where: {
        doctorId: doctor.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return { payouts };
  } catch (error) {
    console.error("Failed to fetch payouts:", error);
    return { error: "Failed to fetch payouts: " + error.message, payouts: [] };
  }
}

/**
 * Get doctor's earnings summary
 */
export async function getDoctorEarnings() {
  const { userId } = await auth();
  console.log("DEBUG: In getDoctorEarnings, clerkUserId from auth():", userId);

  if (!userId) {
    return { error: "Unauthorized", earnings: {} };
  }

  try {
    const doctor = await db.user.findUnique({
      where: {
        clerkUserId: userId,
        role: "DOCTOR",
      },
    });

    if (!doctor) {
      return { error: "Doctor not found", earnings: {} };
    }

    if (doctor.verificationStatus !== "VERIFIED") {
      return { error: "Doctor account not yet verified", earnings: {} };
    }

    // Get all completed appointments for this doctor
    const completedAppointments = await db.appointment.findMany({
      where: {
        doctorId: doctor.id,
        status: "COMPLETED",
      },
    });

    // Calculate this month's completed appointments
    const currentMonth = new Date();
    currentMonth.setDate(1);
    currentMonth.setHours(0, 0, 0, 0);

    const thisMonthAppointments = completedAppointments.filter(
      (appointment) => new Date(appointment.createdAt) >= currentMonth
    );

    // Use doctor's actual credits from the user model
    const totalEarnings = doctor.credits * DOCTOR_EARNINGS_PER_CREDIT; // $8 per credit to doctor

    // Calculate this month's earnings (2 credits per appointment * $8 per credit)
    const thisMonthEarnings =
      thisMonthAppointments.length * 2 * DOCTOR_EARNINGS_PER_CREDIT;

    // Simple average per month calculation
    const averageEarningsPerMonth =
      totalEarnings > 0
        ? totalEarnings / Math.max(1, new Date().getMonth() + 1)
        : 0;

    // Get current credit balance for payout calculations
    const availableCredits = doctor.credits;
    const availablePayout = availableCredits * DOCTOR_EARNINGS_PER_CREDIT;

    return {
      earnings: {
        totalEarnings,
        thisMonthEarnings,
        completedAppointments: completedAppointments.length,
        averageEarningsPerMonth,
        availableCredits,
        availablePayout,
      },
    };
  } catch (error) {
    console.error("Failed to fetch doctor earnings:", error);
    return { error: "Failed to fetch doctor earnings: " + error.message, earnings: {} };
  }
}
