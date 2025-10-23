"use client";
import { useState, useEffect, useRef } from "react";
import {
  Search,
  Car,
  BikeIcon as Motorbike,
  Caravan,
  Sailboat,
  Wrench,
  ListFilter,
} from "lucide-react";
import CustomDropdown from "@/components/WebsiteComponents/MotorsPageComponents/CustomDropdown";
import MoreOptionsDropdown from "@/components/WebsiteComponents/MotorsPageComponents/MoreOptionsDropdown";
import MoreOptionsButton from "@/components/WebsiteComponents/MotorsPageComponents/MoreOptionsButton";
import NeedHelp from "@/components/WebsiteComponents/MotorsPageComponents/NeedHelp";
import PopularSearches from "@/components/WebsiteComponents/MotorsPageComponents/PopularSearches";
import AboutMa3roodJobs from "@/components/WebsiteComponents/MotorsPageComponents/AboutMa3roodJobs";
 import { ChevronDown } from 'lucide-react';
import Link from "next/link";

const newUsedOptions = ["All Cars", "New", "Used"];

const makeOptions = [
  "Anytime",
  "Toyota",
  "Ford",
  "Honda",
  "Nissan",
  "Mazda",
  "Mercedes-Benz",
  "BMW",
  "Audi",
  "Hyundai",
  "Kia",
];
const modelOptions = [
  "Any Model",
  "Corolla",
  "Hilux",
  "Ranger",
  "Civic",
  "CX-5",
  "C-Class",
  "3 Series",
  "A4",
  "Tucson",
  "Sportage",
];
const locationOptions = [
  "Any Location",
  "Auckland",
  "Wellington",
  "Christchurch",
  "Hamilton",
  "Tauranga",
  "Dunedin",
  "Napier-Hastings",
];

const generateYears = () => {
  const currentYear = new Date().getFullYear();
  const years = ["Any"];
  for (let i = currentYear; i >= 1900; i--) {
    years.push(String(i));
  }
  return years;
};
const yearOptions = generateYears();

const priceOptions = [
  "Any",
  "$5,000",
  "$10,000",
  "$15,000",
  "$20,000",
  "$25,000",
  "$30,000",
  "$35,000",
  "$40,000",
  "$45,000",
  "$50,000",
  "$60,000",
  "$70,000",
  "$80,000",
  "$90,000",
  "$100,000",
  "$120,000",
  "$150,000",
  "$200,000+",
];

const bodyStyleOptions = [
  "Any Body Style",
  "Sedan",
  "SUV",
  "Hatchback",
  "Ute",
  "Van",
  "Coupe",
  "Wagon",
  "Convertible",
  "Minivan",
];
const fuelTypeOptions = [
  "Any Fuel Type",
  "Petrol",
  "Diesel",
  "Electric",
  "Hybrid",
  "LPG",
];

// New options for "More Options" section
const odometerOptions = [
  "Any",
  "10,000 km",
  "20,000 km",
  "50,000 km",
  "100,000 km",
  "150,000 km",
  "200,000 km+",
];
const transmissionOptions = ["Any transmission", "Automatic", "Manual"];
const availabilityOptions = ["Any availability", "In Stock", "Coming Soon"];
const driveOptions = ["2WD or 4WD", "2WD", "4WD"];
const seatsOptions = ["Any", "2", "4", "5", "7", "8+"];
const engineSizeOptions = [
  "Any",
  "1.0L",
  "1.5L",
  "2.0L",
  "2.5L",
  "3.0L",
  "3.5L+",
];
const doorsOptions = ["Any", "2", "3", "4", "5"];
const importHistoryOptions = ["Any import history", "NZ New", "Imported"];
const listingTypeOptions = ["Any listing type", "Private", "Dealer"];
const safetyRatingOptions = [
  "Any safety rating",
  "1 Star",
  "2 Star",
  "3 Star",
  "4 Star",
  "5 Star",
];

const tabs = [
  { key: "cars", name: "Cars", icon: "./car.png" },
  { key: "motorbikes", name: "Motorbikes", icon: "./motorbikes.png" },
  { key: "caravans", name: "Caravans & motorhomes", icon: "./caravans.png" },
  { key: "boats", name: "Boats", icon: "./boats.png" },
  { key: "parts", name: "Car parts & accessories", icon: "./carparts.png" },
  { key: "allcat", name: "All categories", icon: "./categ.png" },
];

const filtersByCategory = {
  cars: {
    make: makeOptions,
    model: modelOptions,
    fuelType: fuelTypeOptions,
    bodyStyle: bodyStyleOptions,
    year: yearOptions,
    price: priceOptions,
  },
  motorbikes: {
    make: ["Any", "Harley-Davidson", "Yamaha", "Kawasaki"],
    model: ["Any", "Ninja", "MT-07", "Rebel"],
    fuelType: ["Any", "Petrol", "Electric"],
    year: yearOptions,
    price: priceOptions,
  },
  boats: {
    make: ["Any", "Bayliner", "Sea Ray", "Yamaha Boats"],
    model: ["Any", "185 Bowrider", "SPX 190"],
    fuelType: ["Any", "Petrol", "Diesel"],
    year: yearOptions,
    price: priceOptions,
  },
  caravans: {
    make: ["Any", "Jayco", "Bailey", "Swift"],
    length: ["Any length", "Under 5m", "5-7m", "Over 7m"],
    berths: ["Any", "2", "4", "6", "8+"],
    layout: ["Any layout", "Rear lounge", "Bunk beds", "Island bed"],
    price: priceOptions,
    location: locationOptions,
    selfContained: true,
  },
};

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
  const [activeTab, setActiveTab] = useState("cars");
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("cars");

  

  const toggleMoreOptions = () => {
    setShowMoreOptions(!showMoreOptions);
  };

  return (
    <div className="bg-white min-h-screen">
       <div className="text-black relative z-20 bg-green-500">
       {/* Header */}
            <div className="border-b border-gray-100 text-white relative z-20">
              <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 flex justify-between items-center py-1 md:py-1 text-sm">
                {/* Left section - Desktop */}
                <div className="hidden sm:flex items-center space-x-6">
                  <div className="relative group flex items-center cursor-pointer">
                    <span className="hover:text-blue-500 flex items-center">
                      Browse Motors
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
      
                  <Link href="/reviews-&-advice" className="hover:text-blue-500">
                    Reviews & Advice
                  </Link>
                  <Link href="/dealer-directory" className="hover:text-blue-500">
                    Dealer Directory
                  </Link>
                  <Link href="/value-my-car" className="hover:text-blue-500">
                    Value my Car
                  </Link>
                  <Link href='/find-a-mechanic'>
                  Find a Mechanic
                  </Link>
                  <Link href='/new-car-showroom'>
                  New Car showroom
                  </Link>
                </div>
      
                {/* Right section - Desktop */}
                <div className="hidden sm:flex items-center space-x-6">
                  <Link href="/sell-my-vehicle" className="hover:text-blue-500">
                    Sell my Vehicle
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
                        Browse Motors
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
                </div>
      {/* Hero Section */}
      <div
        className="w-full h-64 sm:h-72 lg:h-80 rounded-b-[60px] text-white px-4 sm:px-8 py-10 sm:py-12 relative flex items-center"
        style={{ background: "rgb(23, 95, 72)" }}
      >
        <div className="max-w-6xl mx-auto w-full">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-snug mb-6 sm:mb-8">
            SHOP NEW & USED ITEMS <br /> FOR SALE
          </h1>
        </div>
      </div>
      {/* Filter Card with Blended Tabs */}
      <div className="max-w-5xl mx-auto -mt-20 relative z-10 px-4">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Tabs section - blended with hero color */}
          <div className="bg-white rounded-lg  overflow-hidden">
            {/* Tabs section - flush with top of card */}
            <div className="flex border-b border-gray-200">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex-1 text-sm font-medium h-10 px-4 text-center w-auto
          ${
            activeTab === tab.key
              ? "bg-white text-[#175f48]"
              : "bg-gray-50 text-gray-600 hover:bg-gray-100"
          } border-r border-gray-200 last:border-r-0`}
                >
                  <div className="flex items-center justify-center gap-2 h-full">
                    {tab.icon && (
                      <img
                        src={tab.icon}
                        alt={tab.name}
                        className="w-5 h-5 object-contain"
                      />
                    )}
                    <span>{tab.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="px-6 py-4">
            <h2 className="text-3xl font-semibold text-gray-800  leading-snug">
              {tabs.find((tab) => tab.key === activeTab)?.name} for sale 
            </h2>
          </div>

          {/* Main Filter Content */}
          <div className="p-4 sm:p-6">
            {/* Initial Filter Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
              {/* Special filter for all categories (outside filtersByCategory) */}
              {activeTab === "cars" && (
                <CustomDropdown label="New & Used" options={newUsedOptions} />
              )}

              {filtersByCategory[activeTab] &&
                Object.entries(filtersByCategory[activeTab]).map(
                  ([filterKey, options]) => {
                    if (typeof options === "boolean") {
                      return (
                        <div
                          key={filterKey}
                          className="flex items-center gap-2 pt-2"
                        >
                          <input
                            type="checkbox"
                            id={filterKey}
                            className="h-4 w-4"
                          />
                          <label
                            htmlFor={filterKey}
                            className="text-sm text-gray-600 capitalize"
                          >
                            {filterKey.replace(/([A-Z])/g, " $1")}
                          </label>
                        </div>
                      );
                    }

                    return (
                      <CustomDropdown
                        key={filterKey}
                        label={
                          filterKey.charAt(0).toUpperCase() + filterKey.slice(1)
                        }
                        options={options}
                      />
                    );
                  }
                )}
            </div>

            {/* More Options Section (conditionally rendered) - now appears after initial filters */}
            {activeTab === "cars" && showMoreOptions && (
              <div
                id="more-filters-section"
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6 transition-all duration-300 ease-in-out"
              >
                <div className="flex gap-2">
                  <CustomDropdown
                    label="Kilometers"
                    options={odometerOptions}
                    initialValue="Any"
                  />
                  <div className="flex items-end pb-2 text-gray-500">-</div>
                  <CustomDropdown
                    label=""
                    options={odometerOptions}
                    initialValue="Any"
                  />
                </div>
                <CustomDropdown
                  label="Transmission"
                  options={transmissionOptions}
                />
                <CustomDropdown
                  label="Availability"
                  options={availabilityOptions}
                />
                <CustomDropdown label="2WD or 4WD" options={driveOptions} />

                <div className="flex gap-2">
                  <CustomDropdown
                    label="Seats"
                    options={seatsOptions}
                    initialValue="Any"
                  />
                  <div className="flex items-end pb-2 text-gray-500">-</div>
                  <CustomDropdown
                    label=""
                    options={seatsOptions}
                    initialValue="Any"
                  />
                </div>
                <div className="flex gap-2">
                  <CustomDropdown
                    label="Engine Size"
                    options={engineSizeOptions}
                    initialValue="Any"
                  />
                  <div className="flex items-end pb-2 text-gray-500">-</div>
                  <CustomDropdown
                    label=""
                    options={engineSizeOptions}
                    initialValue="Any"
                  />
                </div>
                <div className="flex gap-2">
                  <CustomDropdown
                    label="Number of doors"
                    options={doorsOptions}
                    initialValue="Any"
                  />
                  <div className="flex items-end pb-2 text-gray-500">-</div>
                  <CustomDropdown
                    label=""
                    options={doorsOptions}
                    initialValue="Any"
                  />
                </div>
                <CustomDropdown
                  label="Import history"
                  options={importHistoryOptions}
                />

                <CustomDropdown
                  label="Listing type"
                  options={listingTypeOptions}
                />
                <CustomDropdown
                  label="Safety rating"
                  options={safetyRatingOptions}
                />
              </div>
            )}

            {/* Keywords Input + Buttons (per category) */}
            {/* ✅ TOP Search Box + Button for all except cars */}
            {["motorbikes", "caravans", "boats", "parts"].includes(
              activeTab
            ) && (
              <div className="mb-6">
                <label className="block text-sm font-semibold text-[#444] mb-2">
                  Keywords
                </label>

                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search using keywords"
                      className="w-full pl-10 pr-4 py-2 rounded-md bg-[#FAFAFA] text-sm text-gray-700 focus:outline-none transition"
                    />
                  </div>

                  {/* ✅ Show button for all non-car tabs now */}
                  <Link href="/motors/search" className="w-full sm:w-auto bg-[#175f48] hover:bg-green-700 text-white px-6 py-2 rounded-md transition-colors text-center">
                    Search
                  </Link>
                </div>
              </div>
            )}

            {/* ✅ BOTTOM Search Box for cars */}
            {activeTab === "cars" && (
              <div className="mb-6">
                <label className="block text-sm font-semibold text-[#444] mb-2">
                  Keywords
                </label>
                <div
                  className={`relative ${
                    showMoreOptions ? "w-full" : "w-full sm:w-[300px]"
                  }`}
                >
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search using keywords"
                    className="pl-10 pr-4 py-2 w-full rounded-md bg-[#FAFAFA] text-sm text-gray-700 focus:outline-none transition"
                  />
                </div>
              </div>
            )}

            {/* Bottom Button (Only for Cars) */}
            {activeTab === "cars" && (
              <div className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-end gap-4">
                <MoreOptionsButton
                  onClick={toggleMoreOptions}
                  isExpanded={showMoreOptions}
                />
                <Link href="/motors/search" className="w-full sm:w-auto bg-[#175f48] hover:bg-green-700 text-white px-6 py-2 rounded-md transition-colors text-center">
                  View listings
                </Link>
              </div>
            )}

            {activeTab === "allcat" && (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-6">
    {/* Column 1 - Cars */}
    <div>
      <h3 className="text-lg font-semibold mb-3 text-[#175f48]">Cars</h3>
      <div className="space-y-2">
        {[
          "Used cars",
          "Electric cars",
          "New cars",
          "Classic cars",
          "Specialist cars",
          "Parts & accessories",
          "Car stereos",
          "Wrecked cars",
        ].map((item, index) => (
          <Link
            key={index}
            href={`/motors/cars/${item.toLowerCase().replace(/\s+/g, "-")}`}
            className="block text-sm text-gray-700 hover:underline"
          >
            {item}
          </Link>
        ))}
      </div>
    </div>

    {/* Column 2 - Motorbikes + Caravans */}
    <div>
      <h3 className="text-lg font-semibold mb-3 text-[#175f48]">Motorbikes</h3>
      <div className="space-y-2 mb-4">
        {["Motorbikes", "Motorbike parts", "Helmets & gear"].map((item, index) => (
          <Link
            key={index}
            href={`/motors/motorbikes/${item.toLowerCase().replace(/\s+/g, "-")}`}
            className="block text-sm text-gray-700 hover:underline"
          >
            {item}
          </Link>
        ))}
      </div>

      <h3 className="text-lg font-semibold mb-3 text-[#175f48]">Caravans & motorhomes</h3>
      <div className="space-y-2">
        {["Caravans", "Motorhomes", "Parts & accessories"].map((item, index) => (
          <Link
            key={index}
            href={`/motors/caravans/${item.toLowerCase().replace(/\s+/g, "-")}`}
            className="block text-sm text-gray-700 hover:underline"
          >
            {item}
          </Link>
        ))}
      </div>
    </div>

    {/* Column 3 - Boats */}
    <div>
      <h3 className="text-lg font-semibold mb-3 text-[#175f48]">Boats & marine</h3>
      <div className="space-y-2">
        {[
          "Motorboats",
          "Yachts",
          "Parts & accessories",
          "Dinghies & rowboats",
          "Jetskis",
          "Marina berths",
        ].map((item, index) => (
          <Link
            key={index}
            href={`/motors/boats/${item.toLowerCase().replace(/\s+/g, "-")}`}
            className="block text-sm text-gray-700 hover:underline"
          >
            {item}
          </Link>
        ))}
      </div>
    </div>

    {/* Column 4 - Other */}
    <div>
      <h3 className="text-lg font-semibold mb-3 text-[#175f48]">Other</h3>
      <div className="space-y-2">
        {[
          "Aircraft",
          "Buses",
          "Diggers & excavators",
          "Horse floats",
          "Trailers",
          "Trucks",
          "Tractors",
          "Automotive services",
        ].map((item, index) => (
          <Link
            key={index}
            href={`/motors/other/${item.toLowerCase().replace(/\s+/g, "-")}`}
            className="block text-sm text-gray-700 hover:underline"
          >
            {item}
          </Link>
        ))}
      </div>
    </div>
  </div>
)}
          </div>
        </div>
      </div>
      <NeedHelp />

      <PopularSearches />

      <AboutMa3roodJobs jobs={false}/>
    </div>
  );
};

export default Page;