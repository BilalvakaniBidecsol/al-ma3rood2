"use client";
import { FaBed, FaRulerCombined, FaDoorOpen } from "react-icons/fa";

import { useState } from "react";
import MapSchoolList from "./MapSchoolList";
import Cards from "./Cards";
import DealerContact from "./DealerContact";
import Payment from "./Payment";
import PropertyInsight from "./PropertyInsight";
const propertyInfo = [
  {
    image: "/ruler.png",
    title: "Property Type",
    description: "Modern Family Apartments",
  },
  {
    image: "/propertyid.png",
    title: "Property ID",
    description: "#hfW631",
  },
  {
    image: "/unit.png",
    title: "Unit Types",
    description: "520 – 2,150 Sq. Ft.",
  },
  {
    image: "/smoke.png",
    title: "Smoke Alarm",
    description: "smoke alaram : yes",
  },
];
const myCards1 = [
  {
    title: "Open home times",
    subtitle: "No times scheduled",
    description: "",
    buttonText: "Request a viewing",
  },
  {
    title: "Property Files",
    subtitle: "Discover more about this property.",
    description: "Request the files from nocity.",
    buttonText: "Request property files",
  },
]
const myCards = [
  {
    title: "Open home times",
    subtitle: "No times scheduled",
    description: "",
    buttonText: "Request a viewing",
  },
  {
    title: "Property Files",
    subtitle: "Discover more about this property.",
    description: "Request the files from nocity.",
    buttonText: "Request property files",
  },
  {
    title: "Contact Agent",
    subtitle: "Get in touch today.",
    description: "Find out more information easily.",
    buttonText: "Contact now",
  },
];



const page = () => {
  return (
    <>
      <div className="p-12">
        {/* Breadcrumb with slashes */}
        <div className="text-sm text-gray-500 mb-4">
          Home / <span className="text-green-500">Property</span> /{" "}
          <span className="text-black font-semibold">Property Detail</span>
        </div>

        {/* Main content layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Large Left Box */}
          <div className="md:col-span-2 bg-gray-300 h-[250px] md:h-[400px] rounded"></div>

          {/* Two Small Right Boxes */}
          <div className="flex flex-col gap-4">
            <div className="bg-gray-300 h-[150px] md:h-[190px] rounded"></div>
            <div className="bg-gray-300 h-[150px] md:h-[190px] rounded"></div>
          </div>
        </div>

        {/* Dots below (carousel-style dots) */}
        <div className="flex justify-center mt-6 space-x-2">
          <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
          <span className="w-2 h-2 bg-gray-300 rounded-full"></span>
          <span className="w-2 h-2 bg-gray-300 rounded-full"></span>
        </div>
      </div>
      <div className="p-4 px-14 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Prefab homes – Warm, Affordable, Strong
          </h1>
          <p className="text-sm font-semibold">
            City Centre, Palmerston North, Manawatu / Whanganui
          </p>
          <p className="text-3xl font-semibold mt-7">Asking price $432,000</p>

          {/* Icons row */}
          <div className="flex flex-wrap gap-4 text-sm mt-4">
            <div className="flex items-center gap-2 px-3 py-1 bg-[#FAFAFA] text-green-500 rounded-[5px]">
              <FaBed />
              <span>4 bedrooms</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-[#FAFAFA] text-green-500 rounded-[5px]">
              <FaRulerCombined />
              <span>3295 Sq. Ft.</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-[#FAFAFA] text-green-500 rounded-[5px]">
              <FaDoorOpen />
              <span>1 bath room</span>
            </div>
          </div>
        </div>

        {/* Info Boxes */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center mt-6">
          {propertyInfo.map((item, index) => (
            <div key={index} className="p-4">
              <img
                src={item.image}
                alt={item.title}
                className="w-28 h-28 mx-auto"
              />
              <p className="mt-2 font-semibold text-xl">{item.title}</p>
              <p className="text-sm text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>

        <div className="text-sm text-gray-700 leading-relaxed space-y-2 mt-4">
          <p>$312,000 inc gst! For a 95m2 3 bed 2 bath prefab home.</p>
          <p>
            Price is for a brand new 95m2 Transportable home built in our
            Feilding yard.
          </p>
          <p>
            QuickBuild Homes produce NZ’s most affordable, warmest, and
            strongest new homes!
          </p>
          <p className="text-gray-400">
            Looking for a smart, fast, and affordable housing solution?
          </p>
          <p className="text-gray-400">
            QBH transportable homes are built tough, fully insulated, and
            designed well in excess of building code!
          </p>
          <p className="text-green-500 font-semibold cursor-pointer">
            Show More ↓
          </p>
        </div>
      </div>
      <Cards cards={myCards1}/>
      <PropertyInsight/>
      <Payment/>
      <MapSchoolList />
      <div>
      <h1 className="text-2xl font-bold text-center mt-10">Before you buy</h1>
      <Cards cards={myCards} />
    </div>
    <DealerContact/>
    </>
  );
};

export default page;
