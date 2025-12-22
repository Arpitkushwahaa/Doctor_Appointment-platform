/**
 * One-time script to update all past appointments
 * Run this with: node scripts/update-past-appointments.js
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function updateAllPastAppointments() {
  try {
    console.log('🔍 Checking for past appointments...');
    
    const now = new Date();

    // Find all SCHEDULED appointments where end time has passed
    const pastAppointments = await prisma.appointment.findMany({
      where: {
        status: "SCHEDULED",
        endTime: {
          lt: now,
        },
      },
      include: {
        patient: {
          select: {
            name: true,
          },
        },
        doctor: {
          select: {
            name: true,
          },
        },
      },
    });

    if (pastAppointments.length === 0) {
      console.log('✅ No past appointments to update');
      return;
    }

    console.log(`📋 Found ${pastAppointments.length} past appointments to update`);

    // Update each past appointment based on whether patient joined
    let completedCount = 0;
    let timeOverCount = 0;

    for (const appointment of pastAppointments) {
      const finalStatus = appointment.patientJoined ? "COMPLETED" : "TIME_OVER";
      
      await prisma.appointment.update({
        where: {
          id: appointment.id,
        },
        data: {
          status: finalStatus,
        },
      });

      if (finalStatus === "COMPLETED") {
        completedCount++;
      } else {
        timeOverCount++;
      }

      console.log(`  ✓ Appointment on ${appointment.startTime.toLocaleDateString()} - ${appointment.patient.name} with Dr. ${appointment.doctor.name} → ${finalStatus}`);
    }

    console.log('\n📊 Summary:');
    console.log(`  ✅ ${completedCount} appointments marked as COMPLETED`);
    console.log(`  ⏰ ${timeOverCount} appointments marked as TIME_OVER`);
    console.log(`  📝 Total updated: ${pastAppointments.length}`);
    console.log('\n🎉 Done!');

  } catch (error) {
    console.error('❌ Error updating past appointments:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
updateAllPastAppointments()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
