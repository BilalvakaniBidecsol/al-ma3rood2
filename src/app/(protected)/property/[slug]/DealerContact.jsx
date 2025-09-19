import React from "react";
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaStar } from "react-icons/fa";

const dealerInfo = {
  name: "Capital City Motors",
  address: "434 High Street, Lower Hutt, Lower Hutt",
  locationMap: "https://maps.google.com/maps?q=434%20High%20Street,%20Lower%20Hutt&z=14&output=embed",
};

const actions = [
  {
    label: "Email the Dealer",
    icon: <FaEnvelope />,
    bg: "bg-gray-300",
    text: "text-gray-800",
    hover: "hover:bg-gray-400",
  },
  {
    label: "Contact Details",
    icon: <FaPhoneAlt />,
    bg: "bg-green-500",
    text: "text-white",
    hover: "hover:bg-green-600",
  },
];

const DealerContact = () => {
  return (
    <div className="px-16 mx-auto p-4 font-sans text-gray-900">
      <h2 className="font-bold text-lg mb-4">Dealer Contact</h2>

      <div className="mb-8 flex flex-col md:flex-row md:space-x-6">
        {/* Left: Map */}
        <div className="md:w-1/2">
          <h3 className="text-sm text-gray-600 mb-2">View Location</h3>
          <div className="w-[600px] h-44  rounded-md overflow-hidden">
            <iframe
              src={dealerInfo.locationMap}
              title="Dealer Location Map"
              className="w-full h-full border-0"
              loading="lazy"
            ></iframe>
          </div>
        </div>

        {/* Right: Info */}
        <div className="md:w-1/2 mt-4  -ml-4 md:mt-0">
          <div className="flex items-center space-x-2 mb-2 text-gray-600 text-sm">
            <FaMapMarkerAlt className="text-gray-600" />
            <span>Location</span>
          </div>
          <div className="text-gray-700 text-sm mb-4 mt-6">
            <p className="font-semibold">{dealerInfo.name}</p>
            <p>{dealerInfo.address}</p>
          </div>

          <div className="space-y-3 max-w-sm mt-7">
            {actions.map((action, idx) => (
              <button
                key={idx}
                type="button"
                className={`w-full py-2 rounded-full text-sm font-semibold flex items-center justify-center space-x-2 transition ${action.bg} ${action.text} ${action.hover}`}
              >
                {action.icon}
                <span>{action.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Advertisement section */}
      <div className="flex justify-center mt-10">
  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 w-full max-w-md relative">
    <p className="text-gray-400 text-xs mb-2">Advertisement</p>

    {/* Share Heading and underline */}
    <h4 className="text-sm font-semibold mb-2">Share this listing</h4>
    <hr className="mb-3 border-t border-gray-300" />

    {/* Listing Info */}
    <p className="text-xs text-gray-600">Listing #5332893850 • 100 Views</p>
    <p className="text-xs text-yellow-500 flex items-center mt-1">
      <FaStar className="mr-1" />
      Community Watch
    </p>

    {/* Button: bottom-right corner */}
    <div className="flex justify-end mt-6">
      <button
        type="button"
        className="px-3 py-1 text-xs bg-red-600 rounded text-white hover:bg-red-700 transition"
      >
        Support this listing
      </button>
    </div>
  </div>
</div>

    </div>
  );
};

export default DealerContact;
