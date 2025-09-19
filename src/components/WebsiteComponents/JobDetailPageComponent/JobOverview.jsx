"use client";

import { MapPin } from "lucide-react";
import { useState } from "react";
import JobApplicationModal from "./modals/job-application-modal";
import ShareListingModal from "./modals/share-listing-modal";

export default function JobOverview(props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);

  const {
    title = "Change Manager",
    company = "Comspek International",
    location = "Huston",
    button1Text = "Remove",
    button2Text = "Apply Now",
    details = [
      { label: "Location", value: "Auckland City, Auckland" },
      { label: "Job type", value: "Full time" },
      { label: "Duration", value: "Permanent" },
      { label: "Company benefits", value: "Southern Cross Health Insurance" },
    ],
  } = props;

  const handleApplyClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-6">
        {/* top row */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-start">
          {/* left side */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
            <div className="flex items-center text-gray-500 text-sm space-x-2">
              <span>{company}</span>
              <span>|</span>
              <div className="flex items-center space-x-1">
                <MapPin className="w-4 h-4" />
                <span>{location}</span>
              </div>
            </div>
          </div>
          {/* right Side buttons */}
          <div className="flex space-x-3 mt-6 md:mt-0">
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-md text-sm">
              {button1Text}
            </button>
            <button
              onClick={handleApplyClick}
              className="bg-[#175f48] hover:bg-blue-600 text-white px-5 py-2 rounded-md text-sm"
            >
              {button2Text}
            </button>
          </div>
        </div>
        {/* job details grid */}
        <div className="mt-20">
          <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {details.map((item, index) => (
              <div key={index} className="border-l-2 pl-4">
                <h4 className="text-base font-semibold text-gray-900">
                  {item.label}
                </h4>
                <p className="text-sm text-gray-500">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Job Application Modal */}
      <JobApplicationModal isOpen={isModalOpen} onClose={handleCloseModal} />
      <ShareListingModal isOpen={showShareModal} onClose={() => setShowShareModal(false)}/>

    </>
  );
}
