import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Stethoscope, Home, ArrowLeft, UserCheck } from "lucide-react";

export default function DoctorNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
        <Stethoscope className="h-8 w-8 text-blue-600" />
      </div>
      
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        Doctor Access Required
      </h2>
      
      <p className="text-gray-600 mb-6 max-w-md">
        This area is restricted to verified doctors only. If you're a doctor, please complete your verification process first.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          asChild
          className="flex items-center gap-2"
        >
          <Link href="/onboarding">
            <UserCheck className="h-4 w-4" />
            Complete Profile
          </Link>
        </Button>
        
        <Button
          variant="outline"
          asChild
          className="flex items-center gap-2"
        >
          <Link href="/">
            <Home className="h-4 w-4" />
            Go to homepage
          </Link>
        </Button>
        
        <Button
          variant="outline"
          asChild
          className="flex items-center gap-2"
        >
          <Link href="javascript:history.back()">
            <ArrowLeft className="h-4 w-4" />
            Go back
          </Link>
        </Button>
      </div>
    </div>
  );
}
