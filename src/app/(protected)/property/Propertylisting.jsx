import React from "react";
import { FaBed, FaBath } from "react-icons/fa";
const properties = [
  {
    id: 1,
    title: "Grand Oak Residence",
    location: "1234 Oak Lane, Lexington Heights, Wellington",
    bedrooms: "4 bedrooms",
    area: "5,025 Sq. Ft.",
    bathrooms: "5 bathroom",
    description:
      "Stay ahead with industry news, smart property tips, and design inspiration crafted to guide you at every step of your real estate journey",
    image:
      "https://www.mashvisor.com/blog/wp-content/uploads/2018/04/bigstock-Row-Of-New-Suburban-Homes-55511546.jpg",
  },
  {
    id: 2,
    title: "Grand Oak Residence",
    location: "1234 Oak Lane, Lexington Heights, Wellington",
    bedrooms: "4 bedrooms",
    area: "5,025 Sq. Ft.",
    bathrooms: "5 bathroom",
    description:
      "Stay ahead with industry news, smart property tips, and design inspiration crafted to guide you at every step of your real estate journey",
    image:
      "https://www.mashvisor.com/blog/wp-content/uploads/2018/04/bigstock-Row-Of-New-Suburban-Homes-55511546.jpg",
  },
  {
    id: 3,
    title: "Grand Oak Residence",
    location: "1234 Oak Lane, Lexington Heights, Wellington",
    bedrooms: "4 bedrooms",
    area: "5,025 Sq. Ft.",
    bathrooms: "5 bathroom",
    description:
      "Stay ahead with industry news, smart property tips, and design inspiration crafted to guide you at every step of your real estate journey",

    image:
      "https://www.mashvisor.com/blog/wp-content/uploads/2018/04/bigstock-Row-Of-New-Suburban-Homes-55511546.jpg",
  },
  {
    id: 4,
    title: "Grand Oak Residence",
    location: "1234 Oak Lane, Lexington Heights, Wellington",
    bedrooms: "4 bedrooms",
    area: "6,025 Sq. Ft.",
    bathrooms: "5 bathroom",
    description:
      "Stay ahead with industry news, smart property tips, and design inspiration crafted to guide you at every step of your real estate journey",

    image:
      "https://www.mashvisor.com/blog/wp-content/uploads/2018/04/bigstock-Row-Of-New-Suburban-Homes-55511546.jpg",
  },
];

const Propertylisting = () => {
  return (
    <div>
      {" "}
      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold border-b-2 border-black inline-block">
            Property listings in your Watchlist
          </h2>
          <button className="bg-green-500 text-white px-6 py-2 rounded">
            View All
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {properties.map((property) => (
            <div
              key={property.id}
              className="relative rounded-lg overflow-visible"
            >
              <img
                src={property.image}
                alt={property.title}
                className="w-[500px] h-96 object-cover"
              />

              <div className="absolute left-2 right-2 -bottom-10 mx-auto bg-[#469BDB] text-white p-2 shadow-lg z-14 ">
                <h3 className="text-sm font-semibold">{property.title}</h3>
                <p className="text-xs">{property.location}</p>
                <div className="flex justify-between text-[11px]  flex-wrap gap-y-5 mt-5">
                  <div className="flex items-center gap-1">
                    <FaBed /> {property.bedrooms}
                  </div>
                  <div className="flex items-center gap-1">
                    <FaBed />
                    {property.area}
                  </div>
                  <div className="flex items-center gap-1">
                    <FaBath /> {property.bathrooms}
                  </div>
                  <div className="-mt-4 text-[10px]">
                    {property.description}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Propertylisting;
