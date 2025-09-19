"use client";
import { useState } from "react";
import Sale from "./Sale";

export default function TabsPage() {
  const tabs = [
    { key: "sale", name: "For Sale", icon: "./house.png" },
    { key: "rent", name: "For Rent", icon: "./rent.png" },
    { key: "flatmates", name: "Flatmates", icon: "./flat.png" },
    { key: "retirement", name: "Retirement Villages", icon: "./villages.png" },
    { key: "agent", name: "Find an ss", icon: "./agent.png" },
  ];

  const [activeTab, setActiveTab] = useState("sale");

  const renderTabContent = () => {
    return (
      tabContentMap[activeTab] || (
        <div className="p-6 text-sm text-gray-500">No content available</div>
      )
    );
  };

  const tabContentMap = {
    sale: <Sale />,

    rent: (
      <div className="p-6 text-gray-600 text-sm">
        🏠 Browse rentals in your area
      </div>
    ),
    flatmates: (
      <div className="p-6 text-gray-600 text-sm">🏠 Find or list flatmates</div>
    ),
    retirement: (
      <div className="p-6 text-gray-600 text-sm">
        🏠 Discover retirement village options
      </div>
    ),
    agent: (
      <div className="p-6 text-gray-600 text-sm">
        👤 Find a trusted local agent
      </div>
    ),
  };

  return (
    <div className="flex justify-center">
      <div className="w-[1100px]  bg-white rounded-2xl shadow-sm">
        <div className="border-b px-1 pt-1">
          <div className="flex rounded-t overflow-hidden">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 text-sm font-medium py-2 px-5 text-center border-r border-gray-300 last:border-r-0
        ${activeTab === tab.key ? "" : "text-gray-600 hover:bg-gray-100"}`}
              >
                <div className="flex items-center justify-center gap-2">
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

          <div className="mt-1 border-t border-gray-300" />
        </div>

        <div className="px-6 py-4">
          <h2 className="text-3xl font-semibold text-gray-800  leading-snug">
            Search New Zealand&apos;s largest range of houses <br></br> and
            properties for sale
          </h2>
        </div>

        {renderTabContent()}
      </div>
    </div>
  );
}
