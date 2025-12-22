import { getPatientAppointments } from "@/actions/patient";
import { updatePastAppointments } from "@/actions/appointments";
import { AppointmentCard } from "@/components/appointment-card";
import { PageHeader } from "@/components/page-header";
import { Calendar, User, Stethoscope } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/actions/onboarding";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Force dynamic rendering since we use auth/headers
export const dynamic = 'force-dynamic';

export default async function AppointmentsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/sign-in");
  }

  // If user hasn't completed onboarding, redirect them
  if (user.role === "UNASSIGNED") {
    redirect("/onboarding");
  }

  // Auto-update past appointments before showing the list
  await updatePastAppointments();

  // For patients, show their appointments
  if (user.role === "PATIENT") {
    const { appointments, error } = await getPatientAppointments();

    return (
      <div className="container mx-auto px-4 py-8">
        <PageHeader
          icon={<Calendar />}
          title="My Appointments"
          backLink="/doctors"
          backLabel="Find Doctors"
        />

        <Card className="border-emerald-900/20">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-white flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-emerald-400" />
              Your Scheduled Appointments
            </CardTitle>
          </CardHeader>
          <CardContent>
            {error ? (
              <div className="text-center py-8">
                <p className="text-red-400">Error: {error}</p>
              </div>
            ) : appointments?.length > 0 ? (
              <div className="space-y-4">
                {appointments.map((appointment) => (
                  <AppointmentCard
                    key={appointment.id}
                    appointment={appointment}
                    userRole="PATIENT"
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <h3 className="text-xl font-medium text-white mb-2">
                  No appointments scheduled
                </h3>
                <p className="text-muted-foreground mb-4">
                  You don&apos;t have any appointments scheduled yet. Browse our
                  doctors and book your first consultation.
                </p>
                <Link href="/doctors">
                  <Button className="bg-emerald-600 hover:bg-emerald-700">
                    Find Doctors
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // For doctors, redirect to doctor dashboard
  if (user.role === "DOCTOR") {
    redirect("/doctor");
  }

  // For admins, redirect to admin dashboard
  if (user.role === "ADMIN") {
    redirect("/admin");
  }

  // Fallback - shouldn't reach here
  return null;
}
