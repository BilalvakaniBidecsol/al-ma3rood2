import React, { useState } from 'react'
const tabs = [
  { key: "estimate", label: "Property estimate" },
  { key: "value", label: "Capital value" },
  { key: "trends", label: "Trends" },
];
const tabContent = {
  estimate: (
    <div className="flex flex-col md:flex-row justify-between gap-4">
      <div className="md:w-1/2 pr-4 border-r">
        <h3 className="font-semibold text-sm text-gray-700 mb-2">
          Homes Estimate
        </h3>
        <p className="text-2xl font-bold text-gray-700 mb-2">
          Not yet available
        </p>
        <p className="text-sm text-gray-600 mb-2">
          We don’t currently have enough data for the area to provide a
          confident estimate
        </p>
        <div className="mt-10">
          <a href="#" className="text-[#469BDB] text-sm  mt-10">
            What is the homes Estimate?
          </a>
        </div>
      </div>

      <div className="md:w-1/2 pl-4">
        <h3 className="font-semibold text-sm text-gray-700 mb-2">
          RentEstimate
        </h3>
        <p className="text-2xl font-bold text-gray-700 mb-2">
          Not yet available
        </p>
        <div className="mt-5">
          <h3 className="font-semibold text-sm text-gray-700 mb-2">
            RentEstimate
          </h3>
          <p className="text-2xl font-bold text-gray-700 mb-2">
            Not yet available
          </p>
        </div>
        <a href="#" className="text-[#469BDB] text-sm">
          More About Rent estimate and rental yield
        </a>
      </div>
    </div>
  ),

  value: (
    <div>
      <h3 className="font-semibold text-sm text-gray-700 mb-2">
        Capital Value
      </h3>
      <p className="text-gray-600">Capital value details go here.</p>
    </div>
  ),

  trends: (
    <div>
      <h3 className="font-semibold text-sm text-gray-700 mb-2">Trends</h3>
      <p className="text-gray-600">Trends data goes here.</p>
    </div>
  ),
};

//   {
//     title: "Homes Estimate",
//     status: "Not yet available",
//     description:
//       "We don’t currently have enough data for the area to provide a confident estimate",
//     link: {
//       label: "What is the homes Estimate?",
//       url: "#",
//     },
//   },
//   {
//     title: "RentEstimate",
//     status: "Not yet available",
//     description: "",
//     extra: {
//       title: "RentEstimate",
//       status: "Not yet available",
//     },
//     link: {
//       label: "More About Rent estimate and rental yield",
//       url: "#",
//     },
//   },
// ];
const PropertyInsight = () => {
  const [activeTab, setActiveTab] = useState("estimate");

  return (
<div className="px-2 md:px-16 mt-10">
        <h2 className="text-xl font-semibold mb-4">Property insights</h2>

        <div className="flex space-x-4 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-5 py-2 text-sm font-medium rounded-md transition-all duration-200 cursor-pointer
          ${
            activeTab === tab.key
              ? "bg-[#469BDB] text-white"
              : "bg-gray-200 text-gray-700"
          }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="border rounded-md p-3 w-[750px]">
          {tabContent[activeTab]}
        </div>
      </div> 
       )
}

export default PropertyInsight