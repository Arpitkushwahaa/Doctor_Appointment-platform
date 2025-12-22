import { TabsContent } from "@/components/ui/tabs";
import { PendingDoctors } from "./components/pending-doctors";
import { VerifiedDoctors } from "./components/verified-doctors";
import { PendingPayouts } from "./components/pending-payouts";
import {
  getPendingDoctors,
  getVerifiedDoctors,
  getPendingPayouts,
} from "@/actions/admin";
import { updatePastAppointments } from "@/actions/appointments";
import { protectAdminRoute } from "@/lib/routeProtection";

// Force dynamic rendering since we use auth/headers
export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  // Protect the route - this will redirect unauthorized users
  await protectAdminRoute();

  // Auto-update past appointments
  await updatePastAppointments();

  try {
    // Fetch all data in parallel with error handling
    const [pendingDoctorsData, verifiedDoctorsData, pendingPayoutsData] =
      await Promise.allSettled([
        getPendingDoctors(),
        getVerifiedDoctors(),
        getPendingPayouts(),
      ]);

    // Extract data safely, providing fallbacks for failed requests
    const pendingDoctors = pendingDoctorsData.status === 'fulfilled' ? pendingDoctorsData.value.doctors || [] : [];
    const verifiedDoctors = verifiedDoctorsData.status === 'fulfilled' ? verifiedDoctorsData.value.doctors || [] : [];
    const pendingPayouts = pendingPayoutsData.status === 'fulfilled' ? pendingPayoutsData.value.payouts || [] : [];

    // Extract error messages
    const pendingDoctorsError = pendingDoctorsData.status === 'rejected' ? 'Failed to load pending doctors' : 
      (pendingDoctorsData.status === 'fulfilled' && pendingDoctorsData.value.error) ? pendingDoctorsData.value.error : null;
    const verifiedDoctorsError = verifiedDoctorsData.status === 'rejected' ? 'Failed to load verified doctors' : 
      (verifiedDoctorsData.status === 'fulfilled' && verifiedDoctorsData.value.error) ? verifiedDoctorsData.value.error : null;
    const pendingPayoutsError = pendingPayoutsData.status === 'rejected' ? 'Failed to load pending payouts' : 
      (pendingPayoutsData.status === 'fulfilled' && pendingPayoutsData.value.error) ? pendingPayoutsData.value.error : null;

    return (
      <>
        <TabsContent value="pending" className="border-none p-0">
          <PendingDoctors doctors={pendingDoctors} error={pendingDoctorsError} />
        </TabsContent>

        <TabsContent value="doctors" className="border-none p-0">
          <VerifiedDoctors doctors={verifiedDoctors} error={verifiedDoctorsError} />
        </TabsContent>

        <TabsContent value="payouts" className="border-none p-0">
          <PendingPayouts payouts={pendingPayouts} error={pendingPayoutsError} />
        </TabsContent>
      </>
    );
  } catch (error) {
    console.error("Admin page error:", error);
    // Return a simple error state instead of crashing
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Unable to load admin data. Please try again later.</p>
      </div>
    );
  }
}
