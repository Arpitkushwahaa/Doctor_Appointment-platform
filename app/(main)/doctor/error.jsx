"use client";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

export default function DoctorError({
  error,
  reset,
}) {
  useEffect(() => {
    // Log the error to console for debugging
    console.error("Doctor dashboard error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
        <AlertTriangle className="h-8 w-8 text-red-600" />
      </div>
      
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        Doctor Dashboard Error
      </h2>
      
      <p className="text-gray-600 mb-6 max-w-md">
        We encountered an error while loading the doctor dashboard. This might be due to account verification issues or a temporary problem.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          onClick={reset}
          className="flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Try again
        </Button>
        
        <Button
          variant="outline"
          onClick={() => window.location.href = "/"}
          className="flex items-center gap-2"
        >
          <Home className="h-4 w-4" />
          Go to homepage
        </Button>
      </div>
    </div>
  );
}
