/**
 * Script to check all appointments and their statuses
 * Run this with: node scripts/check-appointments.js
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkAppointments() {
  try {
    console.log('🔍 Checking all appointments...\n');
    
    const now = new Date();

    // Get all appointments
    const allAppointments = await prisma.appointment.findMany({
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
      orderBy: {
        startTime: 'desc',
      },
    });

    if (allAppointments.length === 0) {
      console.log('📭 No appointments found in database');
      return;
    }

    console.log(`📋 Total appointments: ${allAppointments.length}\n`);

    // Group by status
    const byStatus = {
      SCHEDULED: [],
      COMPLETED: [],
      CANCELLED: [],
      TIME_OVER: [],
    };

    allAppointments.forEach(apt => {
      if (byStatus[apt.status]) {
        byStatus[apt.status].push(apt);
      }
    });

    // Show summary
    console.log('📊 Summary by Status:');
    Object.keys(byStatus).forEach(status => {
      console.log(`  ${status}: ${byStatus[status].length}`);
    });

    console.log('\n📅 Appointment Details:\n');

    allAppointments.forEach((apt, index) => {
      const isPast = new Date(apt.endTime) < now;
      const dateStr = new Date(apt.startTime).toLocaleString();
      const statusEmoji = apt.status === 'COMPLETED' ? '✅' : 
                         apt.status === 'CANCELLED' ? '❌' : 
                         apt.status === 'TIME_OVER' ? '⏰' : 
                         '📅';
      
      console.log(`${index + 1}. ${statusEmoji} ${apt.status}`);
      console.log(`   Date: ${dateStr}`);
      console.log(`   Patient: ${apt.patient.name}`);
      console.log(`   Doctor: Dr. ${apt.doctor.name}`);
      console.log(`   Patient Joined: ${apt.patientJoined ? 'YES ✓' : 'NO ✗'}`);
      console.log(`   Doctor Joined: ${apt.doctorJoined ? 'YES ✓' : 'NO ✗'}`);
      console.log(`   Is Past: ${isPast ? 'YES (ended)' : 'NO (upcoming/current)'}`);
      
      // Suggest action if needed
      if (isPast && apt.status === 'SCHEDULED') {
        console.log(`   ⚠️  NEEDS UPDATE: Should be ${apt.patientJoined ? 'COMPLETED' : 'TIME_OVER'}`);
      }
      console.log('');
    });

    // Find appointments that need updating
    const needsUpdate = allAppointments.filter(apt => {
      const isPast = new Date(apt.endTime) < now;
      return isPast && apt.status === 'SCHEDULED';
    });

    if (needsUpdate.length > 0) {
      console.log(`\n⚠️  ${needsUpdate.length} appointments need status update!`);
      console.log('Run: node scripts/update-past-appointments.js');
    } else {
      console.log('\n✅ All appointments have correct status');
    }

  } catch (error) {
    console.error('❌ Error checking appointments:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
checkAppointments()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
