"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Button } from "./ui/button";
import {
  Calendar,
  CreditCard,
  ShieldCheck,
  Stethoscope,
  User,
  Menu,
  X,
  Info,
  Phone,
  Search,
  DollarSign,
} from "lucide-react";
import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from "@clerk/nextjs";
import { Badge } from "./ui/badge";
import Image from "next/image";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user: clerkUser } = useUser();
  const [dbUser, setDbUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Only fetch user data if we have a Clerk user
    if (!clerkUser) {
      setIsLoading(false);
      return;
    }

    // Fetch user data when component mounts
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/user/current', {
          cache: 'force-cache', // Use cached response when available
        });
        if (response.ok) {
          const userData = await response.json();
          setDbUser(userData);
        }
      } catch (error) {
        console.error('Failed to fetch user:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [clerkUser?.id]); // Only re-fetch if user ID changes

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(prev => !prev);
  }, []);

  return (
    <header className="fixed top-0 w-full border-b bg-background/80 backdrop-blur-md z-10 supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 cursor-pointer">
          <Image
            src="/logo-single.png"
            alt="Medimeet Logo"
            width={200}
            height={60}
            className="h-10 w-auto object-contain"
          />
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center space-x-4">
          <Link 
            href="/about" 
            className="group relative px-4 py-2 text-sm font-medium text-muted-foreground hover:text-white transition-all duration-300 rounded-lg hover:bg-emerald-900/20 border border-transparent hover:border-emerald-700/30"
          >
            <div className="flex items-center gap-2">
              <Info className="h-4 w-4 text-emerald-400 group-hover:scale-110 transition-transform duration-300" />
              About Us
            </div>
            <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-emerald-400 group-hover:w-full transition-all duration-300"></div>
          </Link>
          
          <Link 
            href="/contact" 
            className="group relative px-4 py-2 text-sm font-medium text-muted-foreground hover:text-white transition-all duration-300 rounded-lg hover:bg-emerald-900/20 border border-transparent hover:border-emerald-700/30"
          >
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-emerald-400 group-hover:scale-110 transition-transform duration-300" />
              Contact
            </div>
            <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-emerald-400 group-hover:w-full transition-all duration-300"></div>
          </Link>
          
          <Link 
            href="/doctors" 
            className="group relative px-4 py-2 text-sm font-medium text-muted-foreground hover:text-white transition-all duration-300 rounded-lg hover:bg-emerald-900/20 border border-transparent hover:border-emerald-700/30"
          >
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-emerald-400 group-hover:scale-110 transition-transform duration-300" />
              Find Doctors
            </div>
            <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-emerald-400 group-hover:w-full transition-all duration-300"></div>
          </Link>
          
          <Link 
            href="/appointments" 
            className="group relative px-4 py-2 text-sm font-medium text-muted-foreground hover:text-white transition-all duration-300 rounded-lg hover:bg-emerald-900/20 border border-transparent hover:border-emerald-700/30"
          >
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-emerald-400 group-hover:scale-110 transition-transform duration-300" />
              My Appointments
            </div>
            <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-emerald-400 group-hover:w-full transition-all duration-300"></div>
          </Link>
          
          <Link 
            href="/pricing" 
            className="group relative px-4 py-2 text-sm font-medium text-muted-foreground hover:text-white transition-all duration-300 rounded-lg hover:bg-emerald-900/20 border border-transparent hover:border-emerald-700/30"
          >
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-emerald-400 group-hover:scale-110 transition-transform duration-300" />
              Pricing
            </div>
            <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-emerald-400 group-hover:w-full transition-all duration-300"></div>
          </Link>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          <SignedIn>
            {/* Role-based navigation - only show appropriate buttons */}
            <div className="hidden md:block">
              {!isLoading && (
                <>
                  {/* Admin Links - only show to admins */}
                  {dbUser?.role === "ADMIN" && (
                    <Link href="/admin">
                      <Button
                        variant="outline"
                        className="inline-flex items-center gap-2"
                      >
                        <ShieldCheck className="h-4 w-4" />
                        Admin Dashboard
                      </Button>
                    </Link>
                  )}

                  {/* Doctor Links - only show to verified doctors */}
                  {dbUser?.role === "DOCTOR" && dbUser?.verificationStatus === "VERIFIED" && (
                    <Link href="/doctor">
                      <Button
                        variant="outline"
                        className="inline-flex items-center gap-2"
                      >
                        <Stethoscope className="h-4 w-4" />
                        Doctor Dashboard
                      </Button>
                    </Link>
                  )}

                  {/* Patient Links - only show to patients */}
                  {dbUser?.role === "PATIENT" && (
                    <Link href="/appointments">
                      <Button
                        variant="outline"
                        className="inline-flex items-center gap-2"
                      >
                        <Calendar className="h-4 w-4" />
                        My Appointments
                      </Button>
                    </Link>
                  )}

                  {/* Unassigned Role - only show to unassigned users */}
                  {dbUser?.role === "UNASSIGNED" && (
                    <Link href="/onboarding">
                      <Button
                        variant="outline"
                        className="inline-flex items-center gap-2"
                      >
                        <User className="h-4 w-4" />
                        Complete Profile
                      </Button>
                    </Link>
                  )}

                  {/* Doctor verification pending - show to unverified doctors */}
                  {dbUser?.role === "DOCTOR" && dbUser?.verificationStatus === "PENDING" && (
                    <Link href="/doctor/verification">
                      <Button
                        variant="outline"
                        className="inline-flex items-center gap-2"
                      >
                        <ShieldCheck className="h-4 w-4" />
                        Verification Pending
                      </Button>
                    </Link>
                  )}
                </>
              )}
            </div>
          </SignedIn>

          {/* Credits Display for Patients */}
          <SignedIn>
            {!isLoading && dbUser?.role === "PATIENT" && (
              <div className="hidden md:block">
                <Badge
                  variant="outline"
                  className="h-9 bg-emerald-900/20 border-emerald-700/30 px-3 py-1 flex items-center gap-2"
                >
                  <CreditCard className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-medium">{dbUser.credits || 0} Credits</span>
                </Badge>
              </div>
            )}
          </SignedIn>

          {/* Credits/Pricing Badge */}
          <div className="hidden md:block">
            <Link href="/pricing">
              <Badge
                variant="outline"
                className="h-9 bg-emerald-900/20 border-emerald-700/30 px-3 py-1 flex items-center gap-2"
              >
                <CreditCard className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-emerald-400">Pricing</span>
              </Badge>
            </Link>
          </div>

          <SignedOut>
            <SignInButton>
              <Button variant="secondary">Sign In</Button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10",
                  userButtonPopoverCard: "shadow-xl",
                  userPreviewMainIdentifier: "font-semibold",
                },
              }}
              afterSignOutUrl="/"
            />
          </SignedIn>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={toggleMobileMenu}
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </nav>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-card border-t border-emerald-800/20 shadow-lg">
          <div className="container mx-auto px-4 py-4">
            {/* Navigation Links */}
            <div className="space-y-3 mb-6">
              <Link 
                href="/about" 
                className="group flex items-center gap-3 px-4 py-3 text-muted-foreground hover:text-white transition-all duration-300 rounded-lg hover:bg-emerald-900/20 border border-transparent hover:border-emerald-700/30"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="w-2 h-2 bg-emerald-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="font-medium">About Us</span>
              </Link>
              <Link 
                href="/contact" 
                className="group flex items-center gap-3 px-4 py-3 text-muted-foreground hover:text-white transition-all duration-300 rounded-lg hover:bg-emerald-900/20 border border-transparent hover:border-emerald-700/30"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="w-2 h-2 bg-emerald-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="font-medium">Contact</span>
              </Link>
              <Link 
                href="/doctors" 
                className="group flex items-center gap-3 px-4 py-3 text-muted-foreground hover:text-white transition-all duration-300 rounded-lg hover:bg-emerald-900/20 border border-transparent hover:border-emerald-700/30"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="w-2 h-2 bg-emerald-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="font-medium">Find Doctors</span>
              </Link>
              <Link 
                href="/appointments" 
                className="group flex items-center gap-3 px-4 py-3 text-muted-foreground hover:text-white transition-all duration-300 rounded-lg hover:bg-emerald-900/20 border border-transparent hover:border-emerald-700/30"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="w-2 h-2 bg-emerald-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="font-medium">My Appointments</span>
              </Link>
              <Link 
                href="/pricing" 
                className="group flex items-center gap-3 px-4 py-3 text-muted-foreground hover:text-white transition-all duration-300 rounded-lg hover:bg-emerald-900/20 border border-transparent hover:border-emerald-700/30"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="w-2 h-2 bg-emerald-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="font-medium">Pricing</span>
              </Link>
            </div>

            {/* User Actions */}
            <SignedIn>
              <div className="space-y-3 mb-6">
                {/* Role-based navigation - only show appropriate buttons */}
                {!isLoading && (
                  <>
                    {/* Admin Links - only show to admins */}
                    {dbUser?.role === "ADMIN" && (
                      <Link href="/admin">
                        <Button
                          variant="outline"
                          className="w-full justify-start"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <ShieldCheck className="h-4 w-4 mr-2" />
                          Admin Dashboard
                        </Button>
                      </Link>
                    )}

                    {/* Doctor Links - only show to verified doctors */}
                    {dbUser?.role === "DOCTOR" && dbUser?.verificationStatus === "VERIFIED" && (
                      <Link href="/doctor">
                        <Button
                          variant="outline"
                          className="w-full justify-start"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <Stethoscope className="h-4 w-4 mr-2" />
                          Doctor Dashboard
                        </Button>
                      </Link>
                    )}

                    {/* Patient Links - only show to patients */}
                    {dbUser?.role === "PATIENT" && (
                      <Link href="/appointments">
                        <Button
                          variant="outline"
                          className="w-full justify-start"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <Calendar className="h-4 w-4 mr-2" />
                          My Appointments
                        </Button>
                      </Link>
                    )}

                    {/* Unassigned Role - only show to unassigned users */}
                    {dbUser?.role === "UNASSIGNED" && (
                      <Link href="/onboarding">
                        <Button
                          variant="outline"
                          className="w-full justify-start"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <User className="h-4 w-4 mr-2" />
                          Complete Profile
                        </Button>
                      </Link>
                    )}

                    {/* Doctor verification pending - show to unverified doctors */}
                    {dbUser?.role === "DOCTOR" && dbUser?.verificationStatus === "PENDING" && (
                      <Link href="/doctor/verification">
                        <Button
                          variant="outline"
                          className="w-full justify-start"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <ShieldCheck className="h-4 w-4 mr-2" />
                          Verification Pending
                        </Button>
                      </Link>
                    )}
                  </>
                )}
              </div>
            </SignedIn>

            {/* Credits Display for Patients - Mobile */}
            <SignedIn>
              {!isLoading && dbUser?.role === "PATIENT" && (
                <div className="mb-4">
                  <Badge
                    variant="outline"
                    className="w-full h-12 bg-emerald-900/20 border-emerald-700/30 px-3 py-3 flex items-center justify-center gap-2"
                  >
                    <CreditCard className="h-4 w-4 text-emerald-400" />
                    <span className="text-emerald-400 font-medium">{dbUser.credits || 0} Credits Available</span>
                  </Badge>
                </div>
              )}
            </SignedIn>

            {/* Credits/Pricing Badge */}
            <div className="mb-6">
              <Link href="/pricing">
                <Badge
                  variant="outline"
                  className="w-full h-12 bg-emerald-900/20 border-emerald-700/30 px-3 py-3 flex items-center justify-center gap-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <CreditCard className="h-4 w-4 text-emerald-400" />
                  <span className="text-emerald-400">View Pricing</span>
                </Badge>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}