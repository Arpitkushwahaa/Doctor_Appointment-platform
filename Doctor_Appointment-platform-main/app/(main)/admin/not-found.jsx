import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShieldX, Home, ArrowLeft } from "lucide-react";

export default function AdminNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
        <ShieldX className="h-8 w-8 text-red-600" />
      </div>
      
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        Access Denied
      </h2>
      
      <p className="text-gray-600 mb-6 max-w-md">
        You don't have permission to access the admin dashboard. This area is restricted to administrators only.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
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
