"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { deductCreditsForAppointment } from "@/actions/credits";
import { Vonage } from "@vonage/server-sdk";
import { addDays, addMinutes, format, isBefore, endOfDay } from "date-fns";
import { Auth } from "@vonage/auth";

// Initialize Vonage Video API client
let vonage;
try {
  const privateKey = process.env.VONAGE_PRIVATE_KEY?.replace(/\\n/g, '\n');
  
  if (!process.env.NEXT_PUBLIC_VONAGE_APPLICATION_ID || !privateKey) {
    console.error("Vonage credentials are missing");
  } else {
    const credentials = new Auth({
      applicationId: process.env.NEXT_PUBLIC_VONAGE_APPLICATION_ID,
      privateKey: privateKey,
    });
    const options = {};
    vonage = new Vonage(credentials, options);
  }
} catch (error) {
  console.error("Failed to initialize Vonage client:", error);
}

/**
 * Book a new appointment with a doctor
 */
export async function bookAppointment(formData) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return { success: false, error: "Unauthorized. Please sign in to book an appointment." };
    }

    // Get the patient user
    const patient = await db.user.findUnique({
      where: {
        clerkUserId: userId,
        role: "PATIENT",
      },
    });

    if (!patient) {
      return { success: false, error: "Patient account not found. Please complete onboarding." };
    }

    // Parse form data
    const doctorId = formData.get("doctorId");
    const startTime = new Date(formData.get("startTime"));
    const endTime = new Date(formData.get("endTime"));
    const patientDescription = formData.get("description") || null;

    // Validate input
    if (!doctorId || !startTime || !endTime) {
      return { success: false, error: "Doctor, start time, and end time are required." };
    }

    // Check if the doctor exists and is verified
    const doctor = await db.user.findUnique({
      where: {
        id: doctorId,
        role: "DOCTOR",
        verificationStatus: "VERIFIED",
      },
    });

    if (!doctor) {
      return { success: false, error: "Doctor not found or not verified." };
    }

    // Check if the patient has enough credits (2 credits per appointment)
    if (patient.credits < 2) {
      console.error(`Patient ${patient.id} has insufficient credits: ${patient.credits}`);
      return { success: false, error: `Insufficient credits to book an appointment. You have ${patient.credits} credits, but need 2 credits.` };
    }

    // Check if the requested time slot is available
    const overlappingAppointment = await db.appointment.findFirst({
      where: {
        doctorId: doctorId,
        status: "SCHEDULED",
        OR: [
          {
            // New appointment starts during an existing appointment
            startTime: {
              lte: startTime,
            },
            endTime: {
              gt: startTime,
            },
          },
          {
            // New appointment ends during an existing appointment
            startTime: {
              lt: endTime,
            },
            endTime: {
              gte: endTime,
            },
          },
          {
            // New appointment completely overlaps an existing appointment
            startTime: {
              gte: startTime,
            },
            endTime: {
              lte: endTime,
            },
          },
        ],
      },
    });

    if (overlappingAppointment) {
      return { success: false, error: "This time slot is already booked. Please select another time." };
    }

    // Create a new Vonage Video API session
    let sessionId;
    try {
      sessionId = await createVideoSession();
    } catch (videoError) {
      console.error("Video session creation failed:", videoError);
      return { success: false, error: "Failed to create video session. Please try again later." };
    }

    // Deduct credits from patient and add to doctor
    const { success, error } = await deductCreditsForAppointment(
      patient.id,
      doctor.id
    );

    if (!success) {
      return { success: false, error: error || "Failed to deduct credits. Please try again." };
    }

    // Create the appointment with the video session ID
    const appointment = await db.appointment.create({
      data: {
        patientId: patient.id,
        doctorId: doctor.id,
        startTime,
        endTime,
        patientDescription,
        status: "SCHEDULED",
        videoSessionId: sessionId, // Store the Vonage session ID
      },
    });

    revalidatePath("/appointments");
    return { success: true, appointment: appointment };
  } catch (error) {
    console.error("Failed to book appointment:", error);
    return { 
      success: false, 
      error: error.message || "Failed to book appointment. Please try again later." 
    };
  }
}

/**
 * Generate a Vonage Video API session
 */
async function createVideoSession() {
  try {
    if (!vonage) {
      throw new Error("Vonage client is not initialized. Please check your Vonage credentials.");
    }
    const session = await vonage.video.createSession({ mediaMode: "routed" });
    return session.sessionId;
  } catch (error) {
    console.error("Error creating video session:", error);
    throw new Error("Failed to create video session: " + error.message);
  }
}

/**
 * Generate a token for a video session
 * This will be called when either doctor or patient is about to join the call
 */
export async function generateVideoToken(formData) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return { success: false, error: "Unauthorized. Please sign in." };
    }

    const user = await db.user.findUnique({
      where: {
        clerkUserId: userId,
      },
    });

    if (!user) {
      return { success: false, error: "User not found." };
    }

    const appointmentId = formData.get("appointmentId");

    if (!appointmentId) {
      return { success: false, error: "Appointment ID is required." };
    }

    // Find the appointment and verify the user is part of it
    const appointment = await db.appointment.findUnique({
      where: {
        id: appointmentId,
      },
    });

    if (!appointment) {
      return { success: false, error: "Appointment not found." };
    }

    // Verify the user is either the doctor or the patient for this appointment
    if (appointment.doctorId !== user.id && appointment.patientId !== user.id) {
      return { success: false, error: "You are not authorized to join this call." };
    }

    // Verify the appointment is scheduled
    if (appointment.status !== "SCHEDULED") {
      return { success: false, error: "This appointment is not currently scheduled." };
    }

    // Verify the appointment is within a valid time range (e.g., starting 5 minutes before scheduled time)
    const now = new Date();
    const appointmentTime = new Date(appointment.startTime);
    const timeDifference = (appointmentTime - now) / (1000 * 60); // difference in minutes

    if (timeDifference > 30) {
      return { 
        success: false, 
        error: "The call will be available 30 minutes before the scheduled time." 
      };
    }

    // Generate a token for the video session
    // Token expires 2 hours after the appointment start time
    const appointmentEndTime = new Date(appointment.endTime);
    const expirationTime =
      Math.floor(appointmentEndTime.getTime() / 1000) + 60 * 60; // 1 hour after end time

    // Use user's name and role as connection data
    const connectionData = JSON.stringify({
      name: user.name,
      role: user.role,
      userId: user.id,
    });

    // Generate the token with appropriate role and expiration
    const token = vonage.video.generateClientToken(appointment.videoSessionId, {
      role: "publisher", // Both doctor and patient can publish streams
      expireTime: expirationTime,
      data: connectionData,
    });

    // Update the appointment with the token
    await db.appointment.update({
      where: {
        id: appointmentId,
      },
      data: {
        videoSessionToken: token,
      },
    });

    return {
      success: true,
      videoSessionId: appointment.videoSessionId,
      token: token,
    };
  } catch (error) {
    console.error("Failed to generate video token:", error);
    return { 
      success: false, 
      error: error.message || "Failed to generate video token. Please try again." 
    };
  }
}

/**
 * Get doctor by ID
 */
export async function getDoctorById(doctorId) {
  try {
    const doctor = await db.user.findUnique({
      where: {
        id: doctorId,
        role: "DOCTOR",
        verificationStatus: "VERIFIED",
      },
    });

    if (!doctor) {
      return { success: false, error: "Doctor not found or not verified." };
    }

    return { success: true, doctor };
  } catch (error) {
    console.error("Failed to fetch doctor:", error);
    return { 
      success: false, 
      error: error.message || "Failed to fetch doctor details." 
    };
  }
}

/**
 * Get available time slots for booking for the next 4 days
 */
export async function getAvailableTimeSlots(doctorId) {
  try {
    // Validate doctor existence and verification
    const doctor = await db.user.findUnique({
      where: {
        id: doctorId,
        role: "DOCTOR",
        verificationStatus: "VERIFIED",
      },
    });

    if (!doctor) {
      throw new Error("Doctor not found or not verified");
    }

    // Fetch a single availability record
    const availability = await db.availability.findFirst({
      where: {
        doctorId: doctor.id,
        status: "AVAILABLE",
      },
    });

    if (!availability) {
      throw new Error("No availability set by doctor");
    }

    // Get the next 4 days
    const now = new Date();
    const days = [now, addDays(now, 1), addDays(now, 2), addDays(now, 3)];

    // Fetch existing appointments for the doctor over the next 4 days
    const lastDay = endOfDay(days[3]);
    const existingAppointments = await db.appointment.findMany({
      where: {
        doctorId: doctor.id,
        status: "SCHEDULED",
        startTime: {
          lte: lastDay,
        },
      },
    });

    const availableSlotsByDay = {};

    // For each of the next 4 days, generate available slots
    for (const day of days) {
      const dayString = format(day, "yyyy-MM-dd");
      availableSlotsByDay[dayString] = [];

      // Create a copy of the availability start/end times for this day
      const availabilityStart = new Date(availability.startTime);
      const availabilityEnd = new Date(availability.endTime);

      // Set the day to the current day we're processing
      availabilityStart.setFullYear(
        day.getFullYear(),
        day.getMonth(),
        day.getDate()
      );
      availabilityEnd.setFullYear(
        day.getFullYear(),
        day.getMonth(),
        day.getDate()
      );

      let current = new Date(availabilityStart);
      const end = new Date(availabilityEnd);

      while (
        isBefore(addMinutes(current, 30), end) ||
        +addMinutes(current, 30) === +end
      ) {
        const next = addMinutes(current, 30);

        // Skip past slots
        if (isBefore(current, now)) {
          current = next;
          continue;
        }

        const overlaps = existingAppointments.some((appointment) => {
          const aStart = new Date(appointment.startTime);
          const aEnd = new Date(appointment.endTime);

          return (
            (current >= aStart && current < aEnd) ||
            (next > aStart && next <= aEnd) ||
            (current <= aStart && next >= aEnd)
          );
        });

        if (!overlaps) {
          availableSlotsByDay[dayString].push({
            startTime: current.toISOString(),
            endTime: next.toISOString(),
            formatted: `${format(current, "h:mm a")} - ${format(
              next,
              "h:mm a"
            )}`,
            day: format(current, "EEEE, MMMM d"),
          });
        }

        current = next;
      }
    }

    // Convert to array of slots grouped by day for easier consumption by the UI
    const result = Object.entries(availableSlotsByDay).map(([date, slots]) => ({
      date,
      displayDate:
        slots.length > 0
          ? slots[0].day
          : format(new Date(date), "EEEE, MMMM d"),
      slots,
    }));

    return { days: result };
  } catch (error) {
    console.error("Failed to fetch available slots:", error);
    throw new Error("Failed to fetch available time slots: " + error.message);
  }
}

/**
 * Mark when a user joins the video call
 */
export async function markUserJoinedCall(formData) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return { success: false, error: "Unauthorized. Please sign in." };
    }

    const user = await db.user.findUnique({
      where: {
        clerkUserId: userId,
      },
    });

    if (!user) {
      return { success: false, error: "User not found." };
    }

    const appointmentId = formData.get("appointmentId");

    if (!appointmentId) {
      return { success: false, error: "Appointment ID is required." };
    }

    // Find the appointment
    const appointment = await db.appointment.findUnique({
      where: {
        id: appointmentId,
      },
    });

    if (!appointment) {
      return { success: false, error: "Appointment not found." };
    }

    // Verify the user is part of this appointment
    if (appointment.doctorId !== user.id && appointment.patientId !== user.id) {
      return { success: false, error: "You are not authorized for this appointment." };
    }

    // Update the appropriate field based on user role
    const updateData = {};
    if (user.role === "PATIENT") {
      updateData.patientJoined = true;
    } else if (user.role === "DOCTOR") {
      updateData.doctorJoined = true;
    }

    await db.appointment.update({
      where: {
        id: appointmentId,
      },
      data: updateData,
    });

    revalidatePath("/appointments");
    revalidatePath("/doctor");
    return { success: true };
  } catch (error) {
    console.error("Failed to mark user as joined:", error);
    return { 
      success: false, 
      error: error.message || "Failed to update join status." 
    };
  }
}

/**
 * Mark appointment as completed or time over based on patient join status
 */
export async function finalizeAppointmentStatus(formData) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return { success: false, error: "Unauthorized. Please sign in." };
    }

    const user = await db.user.findUnique({
      where: {
        clerkUserId: userId,
      },
    });

    if (!user) {
      return { success: false, error: "User not found." };
    }

    const appointmentId = formData.get("appointmentId");
    const patientJoined = formData.get("patientJoined") === "true";

    if (!appointmentId) {
      return { success: false, error: "Appointment ID is required." };
    }

    // Find the appointment
    const appointment = await db.appointment.findUnique({
      where: {
        id: appointmentId,
      },
    });

    if (!appointment) {
      return { success: false, error: "Appointment not found." };
    }

    // Verify the user is the doctor for this appointment
    if (appointment.doctorId !== user.id) {
      return { success: false, error: "Only the doctor can finalize appointment status." };
    }

    // Check if appointment is scheduled
    if (appointment.status !== "SCHEDULED") {
      return { success: false, error: "Appointment is not in scheduled status." };
    }

    // Determine the final status based on whether patient joined
    const finalStatus = patientJoined ? "COMPLETED" : "TIME_OVER";

    await db.appointment.update({
      where: {
        id: appointmentId,
      },
      data: {
        status: finalStatus,
      },
    });

    revalidatePath("/appointments");
    revalidatePath("/doctor");
    
    return { 
      success: true, 
      status: finalStatus,
      message: patientJoined 
        ? "Appointment marked as completed" 
        : "Appointment marked as time over (patient didn't join)"
    };
  } catch (error) {
    console.error("Failed to finalize appointment status:", error);
    return { 
      success: false, 
      error: error.message || "Failed to finalize appointment." 
    };
  }
}

/**
 * Automatically update past appointments that are still SCHEDULED
 * This should be called when loading appointment lists
 */
export async function updatePastAppointments() {
  try {
    const now = new Date();

    // Find all SCHEDULED appointments where end time has passed
    const pastAppointments = await db.appointment.findMany({
      where: {
        status: "SCHEDULED",
        endTime: {
          lt: now, // Less than current time (in the past)
        },
      },
    });

    if (pastAppointments.length === 0) {
      return { success: true, updated: 0 };
    }

    // Update each past appointment based on whether patient joined
    const updatePromises = pastAppointments.map((appointment) => {
      const finalStatus = appointment.patientJoined ? "COMPLETED" : "TIME_OVER";
      
      return db.appointment.update({
        where: {
          id: appointment.id,
        },
        data: {
          status: finalStatus,
        },
      });
    });

    await Promise.all(updatePromises);

    console.log(`Auto-updated ${pastAppointments.length} past appointments`);

    return { success: true, updated: pastAppointments.length };
  } catch (error) {
    console.error("Failed to update past appointments:", error);
    // Don't throw error - this is a background task
    return { success: false, error: error.message };
  }
}


