"use client";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function ErrorBoundary({
  error,
  reset,
}) {
  useEffect(() => {
    // Log the error to console for debugging
    console.error("Error boundary caught error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
        <AlertTriangle className="h-8 w-8 text-red-600" />
      </div>
      
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        Something went wrong
      </h2>
      
      <p className="text-gray-600 mb-6 max-w-md">
        We encountered an unexpected error. This might be a temporary issue.
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
        >
          Go to homepage
        </Button>
      </div>
    </div>
  );
}
