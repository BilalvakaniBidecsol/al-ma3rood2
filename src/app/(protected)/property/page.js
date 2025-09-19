"use client";
import React from "react";
import TabsPage from "./TabsPage";
import Propertylisting from "./Propertylisting";
import LatestNews from "@/components/WebsiteComponents/ReuseableComponenets/LatestNews";
import PopularSearches from "./PopularSearches";
import AboutMa3rood from "./AboutMarood";

const page = () => {
  return (
    <div className="w-full">
      <div className="bg-gray-50">
        <div
          className="w-full rounded-b-[80px] text-white text-left"
          style={{
            background: "rgb(23, 95, 72)",
          }}
        >
          <div className="flex justify-start px-10 pt-4 text-sm font-medium">
            <span className="cursor-pointer hover:underline px-2">Store </span>
            <span className="cursor-pointer hover:underline px-2 border-l">
              Deals
            </span>
            <span className="cursor-pointer hover:underline px-2 border-l">
              Book a Courier
            </span>
          </div>

          <div className="mt-1 border-b  border-white opacity-40 mx-8"></div>

          <div className="py-16 px-10">
            <h1 className="text-3xl md:text-3xl">
              SHOP NEW & USED ITEMS <br /> FOR SALE <br />
              <br />
            </h1>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 -mt-20">
          <TabsPage />
        </div>

        <div className="p-10">
          <Propertylisting />
        </div>
        <div className="px-18 mt-5 ">
          <LatestNews />
          <PopularSearches/>
          <AboutMa3rood/>
        </div>
      </div>
    </div>
  );
};

export default page;
