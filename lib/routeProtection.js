import { redirect } from "next/navigation";
import { getCurrentUser } from "@/actions/onboarding";

/**
 * Protects routes based on user role
 * @param {string} requiredRole - The role required to access the route
 * @param {string} redirectPath - Where to redirect unauthorized users
 */
export async function protectRoute(requiredRole, redirectPath = "/") {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect("/sign-in");
  }
  
  if (user.role !== requiredRole) {
    redirect(redirectPath);
  }
  
  return user;
}

/**
 * Protects admin routes
 */
export async function protectAdminRoute() {
  return await protectRoute("ADMIN", "/");
}

/**
 * Protects doctor routes
 */
export async function protectDoctorRoute() {
  const user = await protectRoute("DOCTOR", "/onboarding");
  
  // Additional check for doctor verification
  if (user.verificationStatus !== "VERIFIED") {
    redirect("/doctor/verification");
  }
  
  return user;
}

/**
 * Protects patient routes
 */
export async function protectPatientRoute() {
  return await protectRoute("PATIENT", "/onboarding");
}

/**
 * Checks if user has completed onboarding
 */
export async function requireOnboardingComplete() {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect("/sign-in");
  }
  
  if (user.role === "UNASSIGNED") {
    redirect("/onboarding");
  }
  
  return user;
}
