"use client";

import { useState } from "react";
import JobApplicationModal from "./modals/job-application-modal";
import ShareListingModal from "./modals/share-listing-modal"; // ✅ make sure this path is correct

export default function JobDescriptionAndSidebar() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false); // ✅ new state

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const listingId = "5332893850";
  const views = 100;

  const descriptionItems = [
    "Permanent, full–time position",
    "Excellent staff benefits",
    "Flexible work environment",
    "Work from home options available",
  ];

  const otherDuties = [
    "Lead various internal audits in FBNZ including audits around our Information Security Management System (ISMS) in alignment with ISO27001",
    "Provide support in risk management processes across all departments",
    "Develop internal control frameworks aligned with business objectives",
    "Assist with vendor and third-party security risk assessments",
    "Coordinate with external auditors and regulatory bodies",
    "Report audit findings and suggest actionable improvements",
  ];

  const applicationButtons = [
    { text: "Apply Now", color: "bg-[#175f48] hover:bg-green-600" },
    { text: "Remove", color: "bg-orange-500 hover:bg-orange-600" },
    { text: "Already applied?", color: "bg-gray-600 hover:bg-gray-700" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 text-gray-800">
      {/* Top Section: Description + Sidebar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        <div className="md:col-span-2">
          <h3 className="text-xl font-semibold mb-4">Description</h3>
          <ul className="space-y-3">
            {descriptionItems.map((item, index) => (
              <li key={index} className="flex items-start text-gray-700">
                <span className="w-2 h-2 mt-2 mr-3 bg-gray-500 rounded-full"></span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Sidebar */}
        <div className="bg-gray-100 rounded-xl p-5 relative flex flex-col justify-between min-h-[220px]">
          <div>
            <p className="text-sm text-gray-400 mb-1">Advertisement</p>
            <button
              onClick={() => setShowShareModal(true)} // ✅ open modal
              className="hover:text-gray-700 text-sm font-semibold border-b pb-1 mb-3 text-gray-900"
            >
              Share this listing
            </button>
            <p className="text-sm text-gray-700 mb-1">
              <span className="text-gray-500">Listing #{listingId}</span> •{" "}
              {views} Views
            </p>
            <p className="text-sm text-gray-600 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="#facc15"
                className="w-5 h-5 mr-1"
              >
                <path
                  fillRule="evenodd"
                  d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
                  clipRule="evenodd"
                />
              </svg>
              Community Watch
            </p>
          </div>
          <div className="self-end mt-4">
            <button className="bg-red-500 hover:bg-red-600 text-white text-sm px-4 py-2 rounded-md flex items-center space-x-1">
              <span>Report this listing</span>
            </button>
          </div>
        </div>
      </div>

      {/* Middle Text and Duties */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
        <div className="p-4 text-gray-700">
          <p>
            At FUJIFILM Business Innovation New Zealand (FBNZ), helping Kiwis
            work smarter isn’t just what we do—it’s who we are...
          </p>
          <h5 className="mt-5 text-lg font-medium">About the role</h5>
          <p className="mt-4">
            We are seeking a proactive and detail-oriented Internal Audit and
            Risk Specialist...
          </p>
          <ul className="list-disc pl-5 space-y-2 mt-6">
            {otherDuties.map((duty, index) => (
              <li key={index} className="text-sm">
                {duty}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Application Details at Bottom */}
      <div className="mt-12 bg-white p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Application details
        </h2>
        <p className="text-lg text-gray-700 mb-6">
          Apply online for this role or contact Mohammed Zoaheb for more info
        </p>
        <div className="flex flex-wrap gap-4 mb-4">
          {applicationButtons.slice(0, 2).map((btn, idx) => (
            <button
              key={idx}
              onClick={btn.text === "Apply Now" ? handleOpenModal : () => {}}
              className={`${btn.color} text-white font-medium py-2 px-4 rounded-md shadow-sm`}
            >
              {btn.text}
            </button>
          ))}
        </div>
        <div>
          <button
            className={`${applicationButtons[2].color} text-white font-medium py-2 px-4 rounded-md shadow-sm`}
          >
            {applicationButtons[2].text}
          </button>
        </div>
      </div>

      {/* ✅ Modals at bottom */}
      <JobApplicationModal isOpen={isModalOpen} onClose={handleCloseModal} />
      <ShareListingModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
      />
    </div>
  );
}
