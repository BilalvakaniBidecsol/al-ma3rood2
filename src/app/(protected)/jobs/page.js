"use client";
import { Search, List } from "lucide-react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import CustomDropdown from "@/components/WebsiteComponents/JobsPageComponents/CustomDropdown";
import TrendingJobs from "@/components/WebsiteComponents/JobsPageComponents/TrendingJobs";
import PopularSearches from "@/components/WebsiteComponents/JobsPageComponents/PopularSearches";
import AboutMa3roodJobs from "@/components/WebsiteComponents/JobsPageComponents/AboutMa3roodJobs";
import MoreOptionsDropdown from "@/components/WebsiteComponents/JobsPageComponents/MoreOptionsDropdown";

const filterDropdowns = [
  {
    label: "Company",
    options: ["All Companies", "Company 1", "Company 2", "Company 3"],
  },
  {
    label: "Location",
    options: [
      "All United States",
      "Auckland",
      "Wellington",
      "Christchurch",
      "Hamilton",
    ],
  },
  {
    label: "Job Type",
    options: [
      "All Job Types",
      "Full Time",
      "Part Time",
      "Contract",
      "Temporary",
    ],
  },
  {
    label: "Pay Type",
    options: ["Annual", "Hourly", "Daily", "Weekly"],
  },
  {
    label: "From",
    options: ["Any", "$30,000", "$40,000", "$50,000", "$60,000", "$70,000"],
  },
  {
    label: "To",
    options: [
      "Any",
      "$50,000",
      "$60,000",
      "$70,000",
      "$80,000",
      "$100,000",
      "$120,000",
    ],
  },
];

const page = () => {
  return (
    <div className="bg-white min-h-screen">
      {/* Navigation Bar */}
      <div
        className="border-b border-gray-200 px-4 py-2"
        style={{
          background: "rgb(23, 95, 72)",
        }}
      >
        {/* Mobile Navigation */}
        <div className="sm:hidden max-w-7xl mx-auto text-white text-sm px-4 py-2">
          <details className="bg-blue-400 rounded-md overflow-hidden">
            <summary className="cursor-pointer py-2 px-4 font-semibold select-none"></summary>

            <div className="flex flex-col gap-2 p-4">
              <div className="relative group flex items-center cursor-pointer">
                <span className="hover:text-blue-100 transition-colors">
                  Browse Jobs
                </span>
                <ChevronDown className="w-3 h-3 ml-1" />
                <div className="absolute top-full left-0 mt-2 w-48 rounded-md shadow-lg hidden group-hover:block hover:block bg-white z-10">
                  <Link
                    href="/jobs/full-time"
                    className="block px-4 py-2 text-sm text-black hover:bg-gray-100"
                  >
                    Full-Time
                  </Link>
                  <Link
                    href="/jobs/part-time"
                    className="block px-4 py-2 text-sm text-black hover:bg-gray-100"
                  >
                    Part-Time
                  </Link>
                </div>
              </div>
              <Link href="/job-profile" className="hover:text-blue-100">
                Job Profile
              </Link>
              <Link href="/career-advice" className="hover:text-blue-100">
                Career Advice
              </Link>
              <Link href="/salary-guide" className="hover:text-blue-100">
                Salary Guide
              </Link>

              <hr className="border-blue-400 my-2" />

              <Link href="/advertise" className="hover:text-blue-100">
                Job Smart Advertisers Site
              </Link>
              <Link href="/recruitment-advice" className="hover:text-blue-100">
                Advertisers Advice
              </Link>
              <Link href="/list-a-job" className="hover:text-blue-100">
                List a Job
              </Link>
            </div>
          </details>
        </div>

        <div className="hidden sm:flex max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center text-xs text-white space-y-2 sm:space-y-0 sm:h-5 lg:h-2 md:h-3">
          <div className="flex flex-wrap justify-center sm:justify-start items-center gap-4 sm:gap-6">
            <div className="relative group flex items-center cursor-pointer">
              <span className="hover:text-blue-100 transition-colors">
                Browse Jobs
              </span>
              <ChevronDown className="w-3 h-3 ml-1" />
              <div className="absolute top-full left-0 mt-2 w-48 rounded-md shadow-lg hidden group-hover:block hover:block bg-white z-10">
                <Link
                  href="/jobs/full-time"
                  className="block px-4 py-2 text-sm text-black hover:bg-gray-100"
                >
                  Full-Time
                </Link>
                <Link
                  href="/jobs/part-time"
                  className="block px-4 py-2 text-sm text-black hover:bg-gray-100"
                >
                  Part-Time
                </Link>
              </div>
            </div>
            <Link
              href="/job-profile"
              className="hover:text-blue-100 transition-colors"
            >
              Job Profile
            </Link>
            <Link
              href="/career-advice"
              className="hover:text-blue-100 transition-colors"
            >
              Career advice
            </Link>
            <Link
              href="/salary-guide"
              className="hover:text-blue-100 transition-colors"
            >
              Salary Guide
            </Link>
          </div>

          <div className="flex flex-wrap justify-center sm:justify-end items-center gap-4 sm:gap-6">
            <Link
              href="/advertise"
              className="hover:text-blue-100 transition-colors"
            >
              Job Smart advertisers site
            </Link>
            <Link
              href="/recruitment-advice"
              className="hover:text-blue-100 transition-colors"
            >
              Advertisers advice
            </Link>
            <Link
              href="/list-a-job"
              className="hover:text-blue-100 transition-colors"
            >
              List a Job
            </Link>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div
        className="w-full h-64 sm:h-72 lg:h-80 rounded-b-[60px] text-white px-4 sm:px-8 py-10 sm:py-12 relative"
        style={{ background: "rgb(23, 95, 72)" }}
      >
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-snug mb-6 sm:mb-8">
            FIND YOUR NEXT JOB IN <br className="hidden sm:block" /> NEW ZEALAND
          </h1>
        </div>
      </div>

      {/* Filter Card */}
      <div className="max-w-5xl mx-auto -mt-20 relative z-10 px-4">
        <div className="bg-white rounded-lg p-4 sm:p-6">
          {/* Top Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-6">
            <button className="w-full sm:w-auto bg-[#175f48] hover:bg-blue-600 text-white px-6 py-2 rounded-md flex items-center justify-center">
              <Search className="w-4 h-4 mr-2" /> Search for jobs
            </button>
            <button className="w-full sm:w-auto border border-gray-300 bg-transparent px-6 py-2 rounded-md flex items-center justify-center hover:bg-gray-50">
              <List className="w-4 h-4 mr-2" /> Browse Job Categories
            </button>
          </div>

          {/* Filter Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="block text-sm font-semibold text-[#444] mb-2">
                Keywords
              </label>
              <input
                type="text"
                placeholder="e.g. Nurse"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-[#FAFAFA] text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>

            {filterDropdowns.map(({ label, options }, index) => (
              <CustomDropdown key={index} label={label} options={options} />
            ))}
          </div>

          {/* Actions */}
          <div className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex justify-between items-center w-full mb-2 sm:hidden">
              {/* Clear refinements - left */}
              <button
                onClick={() => console.log("Clear refinements clicked")}
                className="text-blue-500 hover:text-blue-600 text-sm"
              >
                Clear refinements
              </button>

              {/* More Options - right */}
              <div>
                <MoreOptionsDropdown />
              </div>
            </div>

            {/* The rest of your md/lg layout (shown on sm and up) */}
            <div className="hidden sm:flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-4 w-full">
              {/* LEFT: Clear refinements */}
              <div className="text-sm text-[#175f48] hover:text-blue-600">
                <button
                  onClick={() => console.log("Clear refinements clicked")}
                >
                  Clear refinements
                </button>
              </div>

              {/* RIGHT: More Options + Search Button */}
              <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 w-full sm:w-auto sm:justify-end">
                <div>
                  <MoreOptionsDropdown />
                </div>

                <button className="w-full sm:w-auto bg-[#175f48] hover:bg-blue-600 text-white px-6 py-2 rounded-md">
                  Search Jobs
                </button>
              </div>
            </div>

            {/* Search Jobs Button for mobile (below everything) */}
            <div className="sm:hidden mt-2">
              <button className="w-full bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md">
                Search Jobs
              </button>
            </div>
          </div>
        </div>
      </div>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <TrendingJobs />
      </section>
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <PopularSearches />
      </section>
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 mb-20">
        <AboutMa3roodJobs />
      </section>
    </div>
  );
};

export default page;
