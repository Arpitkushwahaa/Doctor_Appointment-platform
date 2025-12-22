-- AlterEnum
ALTER TYPE "AppointmentStatus" ADD VALUE 'TIME_OVER';

-- AlterTable
ALTER TABLE "Appointment" ADD COLUMN     "doctorJoined" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "patientJoined" BOOLEAN NOT NULL DEFAULT false;
