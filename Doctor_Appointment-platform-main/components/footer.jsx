import Link from "next/link";
import React from "react";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-gray-100 dark:bg-gray-800 border-t">
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col items-center text-center">
          <Link href="/">
            <Image
              src="/logo.png"
              alt="Medimeet Logo"
              width={150}
              height={40}
              className="h-8 w-auto object-contain"
            />
          </Link>
          <p className="max-w-md mx-auto mt-4 text-gray-500 dark:text-gray-400">
            Connecting patients with the best doctors, anytime, anywhere.
          </p>
          <div className="flex flex-col mt-4 sm:flex-row sm:items-center sm:justify-center">
            <Link href="/doctors" className="px-4 text-sm text-gray-700 transition-colors duration-300 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400">
                Find a Doctor
            </Link>
            <Link href="/about" className="mt-2 sm:mt-0 sm:mx-4 px-4 text-sm text-gray-700 transition-colors duration-300 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400">
                About Us
            </Link>
            <Link href="/contact" className="mt-2 sm:mt-0 px-4 text-sm text-gray-700 transition-colors duration-300 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400">
                Contact
            </Link>
          </div>
        </div>
        <hr className="my-6 border-gray-200 dark:border-gray-700" />
        <div className="flex flex-col items-center sm:flex-row sm:justify-between">
          <p className="text-sm text-gray-500 dark:text-gray-300">
            © {new Date().getFullYear()} Medimeet. All Rights Reserved.
          </p>
          <div className="flex mt-3 -mx-2 sm:mt-0">
            <a href="#" className="mx-2 text-sm text-gray-500 transition-colors duration-300 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-300" aria-label="Reddit">
              Privacy Policy
            </a>
            <a href="#" className="mx-2 text-sm text-gray-500 transition-colors duration-300 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-300" aria-label="Reddit">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
} 