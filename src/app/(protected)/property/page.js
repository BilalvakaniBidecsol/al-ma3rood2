import React from "react";
import PropertiesClient from "./PropertiesClient";

export const metadata = {
  title: "Properties for Sale & Rent in Saudi Arabia | Ma3rood",
  description:
    "Explore the latest properties for sale and rent in Saudi Arabia. Find apartments, villas, offices, and more across major cities with Ma3rood.",
};

const page = () => {

  return (
    <div className="w-full">
      <PropertiesClient />
    </div>
  );
};

export default page;
