import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { getDoctorAppointments, getDoctorAvailability } from "@/actions/doctor";
import { updatePastAppointments } from "@/actions/appointments";
import { AvailabilitySettings } from "./_components/availability-settings";
import { protectDoctorRoute } from "@/lib/routeProtection";
import { Calendar, Clock, DollarSign } from "lucide-react";
import DoctorAppointmentsList from "./_components/appointments-list";
import { getDoctorEarnings, getDoctorPayouts } from "@/actions/payout";
import { DoctorEarnings } from "./_components/doctor-earnings";

// Force dynamic rendering since we use auth/headers
export const dynamic = 'force-dynamic';

export default async function DoctorDashboardPage() {
  // Protect the route - this will redirect unauthorized users and unverified doctors
  await protectDoctorRoute();

  // Auto-update past appointments before loading the dashboard
  await updatePastAppointments();

  try {
    // Only fetch doctor data if user is verified as a doctor
    const [appointmentsData, availabilityData, earningsData, payoutsData] =
      await Promise.allSettled([
        getDoctorAppointments(),
        getDoctorAvailability(),
        getDoctorEarnings(),
        getDoctorPayouts(),
      ]);

    // Extract data safely with fallbacks
    const appointments = appointmentsData.status === 'fulfilled' ? appointmentsData.value.appointments || [] : [];
    const availability = availabilityData.status === 'fulfilled' ? availabilityData.value.slots || [] : [];
    const earnings = earningsData.status === 'fulfilled' ? earningsData.value.earnings || {} : {};
    const payouts = payoutsData.status === 'fulfilled' ? payoutsData.value.payouts || [] : [];

    // Extract error messages
    const appointmentsError = appointmentsData.status === 'rejected' ? 'Failed to load appointments' : 
      (appointmentsData.status === 'fulfilled' && appointmentsData.value.error) ? appointmentsData.value.error : null;
    const availabilityError = availabilityData.status === 'rejected' ? 'Failed to load availability' : 
      (availabilityData.status === 'fulfilled' && availabilityData.value.error) ? availabilityData.value.error : null;
    const earningsError = earningsData.status === 'rejected' ? 'Failed to load earnings' : 
      (earningsData.status === 'fulfilled' && earningsData.value.error) ? earningsData.value.error : null;
    const payoutsError = payoutsData.status === 'rejected' ? 'Failed to load payouts' : 
      (payoutsData.status === 'fulfilled' && payoutsData.value.error) ? payoutsData.value.error : null;

    return (
      <Tabs
        defaultValue="earnings"
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        <TabsList className="md:col-span-1 bg-muted/30 border h-14 md:h-40 flex sm:flex-row md:flex-col w-full p-2 md:p-1 rounded-md md:space-y-2 sm:space-x-2 md:space-x-0">
          <TabsTrigger
            value="earnings"
            className="flex-1 md:flex md:items-center md:justify-start md:px-4 md:py-3 w-full"
          >
            <DollarSign className="h-4 w-4 mr-2 hidden md:inline" />
            <span>Earnings</span>
          </TabsTrigger>
          <TabsTrigger
            value="appointments"
            className="flex-1 md:flex md:items-center md:justify-start md:px-4 md:py-3 w-full"
          >
            <Calendar className="h-4 w-4 mr-2 hidden md:inline" />
            <span>Appointments</span>
          </TabsTrigger>
          <TabsTrigger
            value="availability"
            className="flex-1 md:flex md:items-center md:justify-start md:px-4 md:py-3 w-full"
          >
            <Clock className="h-4 w-4 mr-2 hidden md:inline" />
            <span>Availability</span>
          </TabsTrigger>
        </TabsList>
        <div className="md:col-span-3">
                  <TabsContent value="appointments" className="border-none p-0">
          <DoctorAppointmentsList
            appointments={appointments}
            error={appointmentsError}
          />
        </TabsContent>
        <TabsContent value="availability" className="border-none p-0">
          <AvailabilitySettings slots={availability} error={availabilityError} />
        </TabsContent>
        <TabsContent value="earnings" className="border-none p-0">
          <DoctorEarnings
            earnings={earnings}
            payouts={payouts}
            error={earningsError}
          />
        </TabsContent>
        </div>
      </Tabs>
    );
  } catch (error) {
    console.error("Doctor dashboard error:", error);
    // Return error state instead of crashing
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Unable to load doctor dashboard. Please try again later.</p>
      </div>
    );
  }
}
