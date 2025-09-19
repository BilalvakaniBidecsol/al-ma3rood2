"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

const JobApplicationModal = ({ isOpen, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    return () => document.body.classList.remove("overflow-hidden");
  }, [isOpen]);
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/10 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-xl max-h-[80vh] overflow-y-auto scroll-smooth custom-scroll p-4 sm:p-6">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-6">
          <h2 className="text-xl font-semibold text-gray-900">
            What is your ideal next role?
          </h2>
          <button
            onClick={onClose}
            className="text-[#175f48] hover:text-green-600 p-1"
          >
            <X className="w-5 h-5 " />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="bg-gray-200 rounded-full h-2 mb-2">
              <div
                className="bg-[#175f48] h-2 rounded-full"
                style={{ width: "80%" }}
              ></div>
            </div>
            <p className="text-sm text-gray-600">1 step remaining</p>
          </div>

          {/* Missing Details Notice */}
          <div className="mb-6">
            <p className="text-sm text-gray-600 mb-2">
              You have missing details in your job profile
            </p>
            <p className="text-xs text-gray-500">
              Fill in these missing details to ensure your job profile stands
              out.
            </p>
          </div>

          {/* Form Fields */}
          <form className="space-y-6">
            {/* Ideal Next Role */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                What's your ideal next role?
              </label>
              <div className="flex items-center ">
                <input
                  type="radio"
                  id="openToAll"
                  name="rolePreference"
                  className="mr-2 accent-[#175f48]"
                  defaultChecked
                />
                <label htmlFor="openToAll" className="text-sm text-gray-700">
                  I am open to all role titles
                </label>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                We'll broaden your job recommendations
              </p>
            </div>

            {/* Preferred Role Titles */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred role titles
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g Carpenter"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-gray-50 placeholder-gray-500"
                />
                <button
                  type="button"
                  className="bg-[#175f48] hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Preferred Industry */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred industry
              </label>
              <div className="flex gap-2">
                <select className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-gray-50 transition duration-150 ease-in-out">
                  <option value="">Select industry</option>
                  <option value="construction">Construction</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="technology">Technology</option>
                  <option value="education">Education</option>
                </select>
                <button
                  type="button"
                  className="bg-[#175f48] hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm"
                >
                  +
                </button>
              </div>
            </div>

            {/* Preferred Locations */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred locations
              </label>
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Region
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-gray-50 transition duration-150 ease-in-out">
                    <option value="">Select region</option>
                    <option value="auckland">Auckland</option>
                    <option value="wellington">Wellington</option>
                    <option value="christchurch">Christchurch</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    District
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-gray-50 transition duration-150 ease-in-out">
                    <option value="">Select district</option>
                    <option value="central">Central</option>
                    <option value="north">North</option>
                    <option value="south">South</option>
                  </select>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-700 mb-2">
                  Select up to 3 preferred job locations
                </p>
                <input
                  type="text"
                  placeholder="Purangi"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-gray-50 placeholder-gray-500"
                />
              </div>
            </div>

            {/* Work Eligibility */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Are you eligible to work in New Zealand?
              </label>
              <p className="text-sm text-gray-600 mb-3">
                I am a New Zealand citizen, resident or hold a valid work visa.
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  className="bg-[#175f48] hover:bg-green-500 text-white px-6 py-2 rounded-md text-sm"
                  
                >
                  Yes
                </button>
                <button
                  type="button"
                  className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-2 rounded-md text-sm"
                >
                  No
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="sr-only peer"
                  
                />
                <div className="w-7 h-4 bg-gray-200 rounded-full peer peer-checked:bg-[#175f48] transition-colors duration-200 ease-in-out"></div>
                <div className="absolute left-[2px] top-[2px] w-3 h-3 bg-white rounded-full shadow-sm transform peer-checked:translate-x-3 transition-transform duration-200 ease-in-out"></div>
              </label>
              <span className="text-sm text-gray-700">
                Notify me about new jobs like this
              </span>
            </div>

            {/* Apply Button */}
            <button
              type="submit"
              className="w-full bg-[#175f48] hover:bg-green-450 text-white py-3 rounded-md font-medium"
            >
              Apply
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default JobApplicationModal;
