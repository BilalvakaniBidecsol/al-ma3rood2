"use client";
import React, { useState } from "react";
import { ChevronDown, X, Menu } from "lucide-react";
import Link from "next/link";
import JobOverview from "@/components/WebsiteComponents/JobDetailPageComponent/JobOverview";
import JobDescriptionAndSidebar from "@/components/WebsiteComponents/JobDetailPageComponent/JobDescriptionAndSidebar";
import TrendingJobs from "@/components/WebsiteComponents/JobsPageComponents/TrendingJobs";
import { useEffect, useRef } from "react";

const Page = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  return (
    <div className="bg-white min-h-screen relative">
      {/* Header */}
      <div className="border-b border-gray-800 text-black relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center py-2 md:py-1 text-sm">
          {/* Left section - Desktop */}
          <div className="hidden sm:flex items-center space-x-6">
            <div className="relative group flex items-center cursor-pointer">
              <span className="hover:text-blue-500 flex items-center">
                Browse Jobs
              </span>
              <ChevronDown className="w-4 h-4 ml-1" />
              <div className="absolute top-full left-0 mt-2 w-48 rounded-md shadow-lg hidden group-hover:block bg-gray-100 z-10">
                <Link
                  href="/jobs/full-time"
                  className="block px-4 py-2 text-sm text-black hover:bg-gray-200"
                >
                  Full-Time
                </Link>
                <Link
                  href="/jobs/part-time"
                  className="block px-4 py-2 text-sm text-black hover:bg-gray-200"
                >
                  Part-Time
                </Link>
              </div>
            </div>

            <Link href="/job-profile" className="hover:text-blue-500">
              Job Profile
            </Link>
            <Link href="/career-advice" className="hover:text-blue-500">
              Career Advice
            </Link>
            <Link href="/salary-guide" className="hover:text-blue-500">
              Salary Guide
            </Link>
          </div>

          {/* Right section - Desktop */}
          <div className="hidden sm:flex items-center space-x-6">
            <Link href="/advertise" className="hover:text-blue-500">
              Job Smart advertisers site
            </Link>
            <Link href="/recruitment-advice" className="hover:text-blue-500">
              Advertisers Advice
            </Link>
            <Link href="/list-a-job" className="hover:text-blue-500">
              List a Job
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="sm:hidden relative">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="flex items-center gap-1 text-sm font-medium text-black"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <>
                  Explore Jobs
                  <ChevronDown className="w-4 h-4" />
                </>
              )}
            </button>
            {/* Mobile Dropdown Box (positioned properly) */}
            <div
              ref={menuRef}
              className={`absolute top-full left-0 mt-3 w-[90vw] max-w-sm bg-white shadow-md border border-gray-200 rounded-md p-4 z-40 transition-all duration-300 ease-in-out transform ${
                isMobileMenuOpen
                  ? "opacity-100 scale-100"
                  : "opacity-0 scale-95 pointer-events-none"
              }`}
            >
              <div>
                <div
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex justify-between items-center cursor-pointer font-medium"
                >
                  Browse Jobs
                  <ChevronDown className="w-4 h-4" />
                </div>
                {isDropdownOpen && (
                  <div className="mt-2 space-y-1 pl-3 text-sm">
                    <Link
                      href="/jobs/full-time"
                      className="block hover:text-blue-500"
                    >
                      Full-Time
                    </Link>
                    <Link
                      href="/jobs/part-time"
                      className="block hover:text-blue-500"
                    >
                      Part-Time
                    </Link>
                  </div>
                )}
              </div>
              <div className="mt-4 space-y-2 text-sm">
                <Link href="/job-profile" className="block hover:text-blue-500">
                  Job Profile
                </Link>
                <Link
                  href="/career-advice"
                  className="block hover:text-blue-500"
                >
                  Career Advice
                </Link>
                <Link
                  href="/salary-guide"
                  className="block hover:text-blue-500"
                >
                  Salary Guide
                </Link>
                <hr className="my-2" />
                <Link href="/advertise" className="block hover:text-blue-500">
                  Job Smart advertisers site
                </Link>
                <Link
                  href="/recruitment-advice"
                  className="block hover:text-blue-500"
                >
                  Advertisers Advice
                </Link>
                <Link href="/list-a-job" className="block hover:text-blue-500">
                  List a Job
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Breadcrumb Navigation */}
      <nav className="bg-white mt-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/" className="text-gray-900 hover:text-blue-500">
              Home
            </Link>
            <span>|</span>
            <Link
              href="/jobs"
              className="text-gray-900 hover:text-blue-500 bg-gray-100 px-4 py-1 rounded"
            >
              Jobs
            </Link>
            <span>|</span>
            <Link
              href="/job-detail"
              className="text-gray-900 hover:text-blue-500 bg-gray-100 px-4 py-1 rounded"
            >
              Job Detail
            </Link>
          </div>
        </div>
      </nav>

      {/* Page Content */}
      <div className="mt-8">
        <JobOverview />
      </div>
      <div className="mt-10">
        <JobDescriptionAndSidebar />
      </div>
      <div className="mt-10">
        <TrendingJobs />
      </div>
    </div>
  );
};

export default Page;
