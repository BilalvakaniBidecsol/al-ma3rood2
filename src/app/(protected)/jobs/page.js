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
      {/* Hero Section */}
      <div
        className="w-full h-64 sm:h-72 lg:h-80 rounded-b-[60px] text-white px-4 sm:px-8 py-10 sm:py-12 relative"
        style={{ background: "rgb(23, 95, 72)" }}
      >
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-snug mb-6 sm:mb-8">
            FIND YOUR NEXT JOB IN <br className="hidden sm:block" /> SAUDI ARABIA
          </h1>
        </div>
      </div>

      {/* Filter Card */}
      <div className="max-w-5xl mx-auto -mt-20 relative z-10 px-4">
        <div className="bg-white rounded-lg p-4 sm:p-6 shadow-lg">
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

            {/* The rest of your md/lg layout (shown on sm and up) */}
            <div className="hidden sm:flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-4 w-full">
              <div></div>
              <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 w-full sm:w-auto sm:justify-end">
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
