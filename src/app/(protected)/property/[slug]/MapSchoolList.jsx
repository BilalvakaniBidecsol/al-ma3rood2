import Button from "@/components/WebsiteComponents/ReuseableComponenets/Button";
import React, { useState, useEffect } from "react";

const schoolsData = [
  {
    id: 1,
    name: "Cambridge Primary School",
    address: "12 Downing Street, Cambridge",
    type: ["Primary"],
    distance: 400,
  },
  {
    id: 2,
    name: "Oxford Secondary School",
    address: "75 King Street, Oxford",
    type: ["Secondary"],
    distance: 600,
  },
  {
    id: 3,
    name: "Manchester Intermediate College",
    address: "88 Queen Road, Manchester",
    type: ["Intermediate"],
    distance: 900,
  },
  {
    id: 4,
    name: "London All Grades Academy",
    address: "99 Regent Street, London",
    type: ["Primary", "Secondary", "Intermediate"],
    distance: 750,
  },
];

const Map = ({ onLocationSelect }) => {
  const handleClick = () => {
    onLocationSelect({
      lat: 51.5074,
      lng: -0.1278,
      name: "London, UK",
    });
  };

  return (
    <div className="relative w-full h-96 border border-gray-300 rounded-lg overflow-hidden">
      <iframe
        src="https://maps.google.com/maps?q=London,UK&z=10&output=embed"
        title="UK Map"
        className="w-full h-full border-0"
      ></iframe>
      <button
        onClick={handleClick}
        className="absolute bottom-4 right-4 bg-white text-green-600 px-4 py-1 rounded shadow text-sm hover:bg-green-50"
      >
        Select Location
      </button>
    </div>
  );
};

const filterSchoolsByType = (schools, filter) => {
  const maxDistance = 1000;
  const nearby = schools.filter((s) => s.distance <= maxDistance);
  return filter === "All"
    ? nearby
    : nearby.filter((school) => school.type.includes(filter));
};

const MapSchoolList = () => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [showSchools, setShowSchools] = useState(false);
  const [schoolTypeFilter, setSchoolTypeFilter] = useState("All");
  const [filteredSchools, setFilteredSchools] = useState([]);

  useEffect(() => {
    if (showSchools && selectedLocation) {
      const filtered = filterSchoolsByType(schoolsData, schoolTypeFilter);
      setFilteredSchools(filtered);
    } else {
      setFilteredSchools([]);
    }
  }, [schoolTypeFilter, showSchools, selectedLocation]);

  return (
    <div className=" mx-auto p-4 px-18 font-sans">
      <div className="flex justify-end space-x-3 mb-4">
        <button
          onClick={() => {
            setShowSchools(false);
            setSelectedLocation(null);
            setSchoolTypeFilter("All");
          }}
          className={`px-4 py-2 rounded border ${
            !showSchools
              ? "bg-green-600 text-white border-green-600"
              : "bg-white text-green-600 border-green-600"
          } transition`}
          type="button"
        >
          Location
        </button>
        <button
          onClick={() => {
            if (selectedLocation) {
              setShowSchools(true);
            } else {
              alert("Please select a location on the map first.");
            }
          }}
          className={`px-4 py-2 rounded border ${
            showSchools
              ? "bg-green-600 text-white border-green-600"
              : "bg-white text-green-600 border-green-600"
          } transition`}
          type="button"
        >
          School
        </button>
      </div>

      <Map onLocationSelect={setSelectedLocation} />

      {selectedLocation && (
        <div className="mt-3 text-gray-700 font-medium">
          Selected Location:{" "}
          <span className="font-semibold">{selectedLocation.name}</span>
        </div>
      )}

      {showSchools && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">
            Local Schools
          </h2>

          <div className="flex  border-gray-300 mb-6 space-x-4">
            {["All", "Primary", "Secondary", "Intermediate"].map((type) => (
              <button
                key={type}
                onClick={() => setSchoolTypeFilter(type)}
                className={`px-5 py-2 w-44 text-sm font-medium rounded-md transition-all duration-200 cursor-pointer ${
                  schoolTypeFilter === type
                    ? "bg-[#469BDB] text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          <div className="space-y-6 w-[1000px]">
            {filteredSchools.length > 0 ? (
              filteredSchools.map((school) => (
                <div key={school.id} className="pb-4 border-b border-gray-300">
                  {/* Zone Button */}
                  <div className="mb-2">
                    <button className="text-white px-3 py-1 rounded text-sm bg-[#626262]">
                      UNZONED
                    </button>
                  </div>

                  {/* School Info */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {school.name}
                      </h3>
                      <p className="text-gray-600">{school.address}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        Type:{" "}
                        <span className="font-medium">
                          {school.type.join(", ")}
                        </span>
                      </p>
                    </div>
                    <div className="text-gray-900 font-semibold mt-3 sm:mt-0">
                      {school.distance}m
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-gray-500 italic">
                Sorry, no schools of type "{schoolTypeFilter}" found nearby.
              </div>
            )}
          </div>

          <div className="mt-6 text-gray-500 text-sm">
            <Button title="Show all school  +"/>
            <p className="mt-5">
              While we've done our best to correctly list schools in this
              location, school zone information<br></br> may not be exact, so please
              double check with the school.{" "}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapSchoolList;
