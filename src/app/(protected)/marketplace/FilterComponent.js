// "use client";

// import React, { useEffect, useState } from "react";
// import { RiDeleteBin6Line } from "react-icons/ri";
// import { listingsApi } from "@/lib/api/listings";
// import Select from "react-select";
// import { City } from "country-state-city";
// import { toast } from "react-toastify";
// import { useTranslation } from "react-i18next";
// import { useCityStore } from "@/lib/stores/cityStore";
// import { useRouter, useSearchParams } from "next/navigation";

// const FilterComponent = ({ categoryId, onResults }) => {
//   const searchParams = useSearchParams();
//   const router = useRouter();
//   const search = searchParams.get("search");
//   const urlCity = searchParams.get("city");
//   const [newUsed, setNewUsed] = useState("");
//   const [shipping, setShipping] = useState("");
//   const [priceFrom, setPriceFrom] = useState("");
//   const [priceTo, setPriceTo] = useState("");
//   // const [selectedCity, setSelectedCity] = useState("");
//   const [district, setDistrict] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [cities, setCities] = useState([]);
//   const { t } = useTranslation();
//   const {
//  selectedCity, 
//  setSelectedCity, 
// } = useCityStore();


//   useEffect(() => {
//     const defaultCities = City.getCitiesOfCountry("SA");
//       // Remove duplicate cities by name
//   const uniqueCities = defaultCities.filter(
//     (city, index, self) =>
//       index === self.findIndex((c) => c.name === city.name)
//   );

//   setCities(uniqueCities);
//   }, []);

//   // Hardcoded counts from the screenshot for demonstration
//   const counts = {
//     usedAny: 20365,
//     newOnly: 198385,
//     allShipping: 0, // Not provided count for "All" shipping in screenshot
//     freeShipping: 120,
//     pickupAvailable: 28011,
//     allselectedCity: 212984,
//   };

//   const handleFilter = async (params) => {
//     try {
//       const response = await listingsApi.getListings(params);
//       if (onResults) onResults(response.data || response);
//       toast.success("Listings filtered successfully!");
//     } catch (err) {
//       toast.error("Failed to filter listings.");
//     }
//   };

//   return (
//     <div className="w-full bg-white border border-gray-300 rounded-md p-4 shadow-sm">
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-lg font-semibold text-gray800">{t("Filter")}</h2>
//         <button
//           aria-label="Clear all filters"
//           title="Clear all filters"
//           className={`text-gray-500 focus:outline-none ${
//             !newUsed &&
//             !shipping &&
//             !priceFrom &&
//             !priceTo &&
//             !selectedCity &&
//             !district
//               ? "opacity-50"
//               : "hover:text-gray-700 cursor-pointer"
//           }`}
//           disabled={
//             !newUsed &&
//             !shipping &&
//             !priceFrom &&
//             !priceTo &&
//             !selectedCity &&
//             !district
//           }
//           onClick={async () => {
//             if (
//               !newUsed &&
//               !shipping &&
//               !priceFrom &&
//               !priceTo &&
//               !selectedCity &&
//               !district
//             )
//               return;
//             setNewUsed("");
//             setShipping("");
//             setPriceFrom("");
//             setPriceTo("");
//             setSelectedCity("");
//             setDistrict("");
//             const params = {
//               category_id: categoryId,
//               ...(selectedCity ? { city: selectedCity } : {}),
//               ...(search ? { search } : {}),
//             };
//             await handleFilter(params);
//           }}
//         >
//           <RiDeleteBin6Line />
//         </button>
//       </div>

//       {/* New & Used */}
//       <fieldset className="mb-6 mt-2">
//         <legend className="block mb-1 text-sm font-medium">
//           {t("New & Used")}
//         </legend>
//         <div className="space-y-2">
//           {/* <label className="flex items-center space-x-2 cursor-pointer">
//             <input
//               type="radio"
//               name="newUsed"
//               value="all"
//               checked={newUsed === "all"}
//               onChange={() => setNewUsed("all")}
//               className="accent-green-600"
//             />
//             <span className="text-gray-700">All</span>
//           </label> */}
//           <label className="flex items-center space-x-2 cursor-pointer">
//             <input
//               type="radio"
//               name="newUsed"
//               value="usedAny"
//               checked={newUsed === "usedAny"}
//               onChange={() => setNewUsed("usedAny")}
//               className="accent-green-600"
//             />
//             <span className="text-gray-700">
//               {/* Used any ({counts.usedAny.toLocaleString()}) */}
//               {t("Used")}
//             </span>
//           </label>
//           <label className="flex items-center space-x-2 cursor-pointer">
//             <input
//               type="radio"
//               name="newUsed"
//               value="newOnly"
//               checked={newUsed === "newOnly"}
//               onChange={() => setNewUsed("newOnly")}
//               className="accent-green-600"
//             />
//             <span className="text-gray-700">
//               {/* New only ({counts.newOnly.toLocaleString()}) */}
//               {t("New")}
//             </span>
//           </label>
//         </div>
//       </fieldset>
//       {cities.length > 0 && (
//       <div className="mt-2 w-full">
//         <label className="block mb-1 text-sm font-medium">{t("City")}</label>
//         <Select
//           name="city"
//           value={
//             cities.find((option) => option.name === selectedCity)
//               ? { value: selectedCity, label: selectedCity }
//               : null
//           }
//           onChange={(selected) => {
//                 const newValue = selected?.value || null;
//     setSelectedCity(newValue);
//     const params = new URLSearchParams(window.location.search);
//     if (!newValue) {
//       params.delete("city");
//     }

//     // Update the URL without full reload
//     router.replace(`${window.location.pathname}?${params.toString()}`);
//           }}
//           options={cities.map((city) => ({
//             value: city.name,
//             label: city.name,
//           }))}
//           placeholder={t("Select a city")}
//           className="text-sm"
//           classNamePrefix="react-select"
//           isClearable
//         />
//       </div> )}
//       {/* Shipping */}
//       {/* <fieldset className="mb-6">
//         <legend className="font-semibold mb-3 text-gray-700">Shipping</legend>
//         <div className="space-y-2">
//           <label className="flex items-center space-x-2 cursor-pointer">
//             <input
//               type="radio"
//               name="shipping"
//               value="all"
//               checked={shipping === "all"}
//               onChange={() => setShipping("all")}
//               className="accent-green-600"
//             />
//             <span className="text-gray-700">All</span>
//           </label>
//           <label className="flex items-center space-x-2 cursor-pointer">
//             <input
//               type="radio"
//               name="shipping"
//               value="freeShipping"
//               checked={shipping === "freeShipping"}
//               onChange={() => setShipping("freeShipping")}
//               className="accent-green-600"
//             />
//             <span className="text-gray-700">
//               Free Shipping ({counts.freeShipping.toLocaleString()})
//             </span>
//           </label>
//           <label className="flex items-center space-x-2 cursor-pointer">
//             <input
//               type="radio"
//               name="shipping"
//               value="pickupAvailable"
//               checked={shipping === "pickupAvailable"}
//               onChange={() => setShipping("pickupAvailable")}
//               className="accent-green-600"
//             />
//             <span className="text-gray-700">
//               Pickup Available ({counts.pickupAvailable.toLocaleString()})
//             </span>
//           </label>
//         </div>
//       </fieldset> */}

//       {/* Pricing */}
//       <fieldset className="mb-6 mt-2">
//         <legend className="block mb-1 text-sm font-medium">
//           {t("Pricing")}
//         </legend>
//         <div className="flex flex-col sm:flex-row sm:space-x-3 space-y-3 sm:space-y-0">
//           <input
//             type="number"
//             placeholder={t("From")}
//             aria-label="Price from"
//             className="w-full border border-gray-300 rounded-md px-2 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
//             value={priceFrom}
//             onChange={(e) => setPriceFrom(e.target.value)}
//             min={0}
//           />
//           <input
//             type="number"
//             placeholder={t("To")}
//             aria-label="Price to"
//             className="w-full border border-gray-300 rounded-md px-2 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
//             value={priceTo}
//             onChange={(e) => setPriceTo(e.target.value)}
//             min={0}
//           />
//         </div>
//         <button
//           type="button"
//           className={`mt-6 w-full bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md py-2 ${
//             !newUsed &&
//             !shipping &&
//             !priceFrom &&
//             !priceTo &&
//             !selectedCity &&
//             !district
//               ? "opacity-60"
//               : "cursor-pointer"
//           } transition`}
//           disabled={
//             loading ||
//             (!newUsed &&
//               !shipping &&
//               !priceFrom &&
//               !priceTo &&
//               !selectedCity &&
//               !district)
//           }
//           onClick={async () => {
//             setLoading(true);
//             try {
//               const params = {
//                 category_id: categoryId,
//                 ...(selectedCity ? { city: selectedCity } : {}),
//                 condition:
//                   newUsed === "usedAny"
//                     ? "used"
//                     : newUsed === "newOnly"
//                     ? "new"
//                     : undefined,
//                 price_from: priceFrom || undefined,
//                 price_to: priceTo || undefined,
//                 ...(search ? { search } : {}),
//                 // Add more params as needed
//               };
//               await handleFilter(params);
//             } catch (err) {
//               // handle error (optional)
//             } finally {
//               setLoading(false);
//             }
//           }}
//         >
//           {loading ? t("Loading...") : t("Show Results")}
//         </button>
//       </fieldset>

//       {/* selectedCity */}
//       {/* <div className="mb-6">
//         <label
//           htmlFor="selectedCity-select"
//           className="block font-semibold mb-2 text-gray-700"
//         >
//           selectedCity
//         </label>
//         <select
//           id="selectedCity-select"
//           value={selectedCity}
//           onChange={(e) => setSelectedCity(e.target.value)}
//           className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
//         >
//           <option value="">All selectedCitys ({counts.allselectedCity.toLocaleString()})</option>
//           <option value="selectedCity1">selectedCity 1</option>
//           <option value="selectedCity2">selectedCity 2</option>
//           <option value="selectedCity3">selectedCity 3</option>
//         </select>
//       </div> */}

//       {/* District */}
//       {/* <div>
//         <label
//           htmlFor="district-select"
//           className="block font-semibold mb-2 text-gray-700"
//         >
//           District
//         </label>
//         <select
//           id="district-select"
//           value={district}
//           onChange={(e) => setDistrict(e.target.value)}
//           className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
//         >
//           <option value="">Select District</option>
//           <option value="district1">District 1</option>
//           <option value="district2">District 2</option>
//           <option value="district3">District 3</option>
//         </select>
//       </div> */}
//     </div>
//   );
// };

// export default FilterComponent;

// "use client";
// import React, { useEffect, useState } from "react";
// import { RiDeleteBin6Line } from "react-icons/ri";
// import { FiChevronDown } from "react-icons/fi";
// import { listingsApi } from "@/lib/api/listings";
// import { City } from "country-state-city";
// import { toast } from "react-toastify";
// import { useTranslation } from "react-i18next";
// import { useCityStore } from "@/lib/stores/cityStore";
// import { useSearchParams } from "next/navigation";

// const FilterComponent = ({ categoryId, onResults }) => {
//   const searchParams = useSearchParams();
//   const search = searchParams.get("search");
//   const [newUsed, setNewUsed] = useState("");
//   const [priceFrom, setPriceFrom] = useState("");
//   const [priceTo, setPriceTo] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [cities, setCities] = useState([]);
//   const [openTab, setOpenTab] = useState(null); // which tab dropdown is open
//   const { t } = useTranslation();
//   const { selectedCity, setSelectedCity } = useCityStore();

//   useEffect(() => {
//     const defaultCities = City.getCitiesOfCountry("SA");
//     const uniqueCities = defaultCities.filter(
//       (city, index, self) =>
//         index === self.findIndex((c) => c.name === city.name)
//     );
//     setCities(uniqueCities);
//   }, []);

//   const handleFilter = async (params) => {
//     try {
//       const response = await listingsApi.getListings(params);
//       if (onResults) onResults(response.data || response);
//       toast.success("Listings filtered successfully!");
//     } catch (err) {
//       toast.error("Failed to filter listings.");
//     }
//   };

//   const clearFilters = async () => {
//     setNewUsed("");
//     setPriceFrom("");
//     setPriceTo("");
//     setSelectedCity("");
//     setOpenTab(null);
//     const params = { category_id: categoryId, ...(search ? { search } : {}) };
//     await handleFilter(params);
//   };

//   return (
//     <div className="w-full bg-white  p-4 space-y-4">
//       {/* Header */}
//       <div className="flex justify-between items-center mb-3">
//         <h2 className="text-lg font-semibold text-gray-800">{t("Filters")}</h2>
//         <button
//           onClick={clearFilters}
//           className={`text-gray-500 hover:text-red-500 ${
//             !newUsed && !selectedCity && !priceFrom && !priceTo
//               ? "opacity-50 cursor-not-allowed"
//               : ""
//           }`}
//           disabled={!newUsed && !selectedCity && !priceFrom && !priceTo}
//         >
//           <RiDeleteBin6Line size={20} />
//         </button>
//       </div>

//       {/* Tabs */}
//       <div className="flex gap-2">
//         {/* Condition Tab */}
//         <button
//           onClick={() => setOpenTab(openTab === "condition" ? null : "condition")}
//           className="flex items-center gap-1 px-3 py-1 border rounded-md text-sm text-gray-700 hover:bg-gray-100"
//         >
//           {newUsed ? (newUsed === "newOnly" ? t("New") : t("Used")) : t("Condition")}
//           <FiChevronDown size={14} />
//         </button>

//         {/* City Tab */}
//         <button
//           onClick={() => setOpenTab(openTab === "city" ? null : "city")}
//           className="flex items-center gap-1 px-3 py-1 border rounded-md text-sm text-gray-700 hover:bg-gray-100"
//         >
//           {selectedCity || t("City")}
//           <FiChevronDown size={14} />
//         </button>

//         {/* Price Tab */}
//         <button
//           onClick={() => setOpenTab(openTab === "price" ? null : "price")}
//           className="flex items-center gap-1 px-3 py-1 border rounded-md text-sm text-gray-700 hover:bg-gray-100"
//         >
//           {priceFrom || priceTo ? `${priceFrom || 0} - ${priceTo || "∞"}` : t("Price")}
//           <FiChevronDown size={14} />
//         </button>
//       </div>

//       {/* Dropdowns */}
//       {openTab === "condition" && (
//         <div className=" mt-2 shadow-sm">
//           <button
//             onClick={() => {
//               setNewUsed("newOnly");
//               setOpenTab(null);
//             }}
//             className="block w-44 border rounded-md text-left px-3 py-2 hover:bg-gray-100 text-sm"
//           >
//             {t("New")}
//           </button>
//           <button
//             onClick={() => {
//               setNewUsed("usedAny");
//               setOpenTab(null);
//             }}
//             className="block w-44 border rounded-md mt-3 text-left px-3 py-2 hover:bg-gray-100 text-sm"
//           >
//             {t("Used")}
//           </button>
//         </div>
//       )}

//       {openTab === "city" && (
//         <div className="border rounded-md mt-2 shadow-sm max-h-48 overflow-y-auto">
//           {cities.map((city) => (
//             <button
//               key={city.name}
//               onClick={() => {
//                 setSelectedCity(city.name);
//                 setOpenTab(null);
//               }}
//               className="block w-full text-left px-3 py-2 hover:bg-gray-100 text-sm"
//             >
//               {city.name}
//             </button>
//           ))}
//         </div>
//       )}

//       {openTab === "price" && (
//         <div className="border rounded-md mt-2 shadow-sm p-3 space-y-2">
//           <input
//             type="number"
//             placeholder={t("From")}
//             value={priceFrom}
//             onChange={(e) => setPriceFrom(e.target.value)}
//             className="w-full px-2 py-1 border rounded-md text-sm"
//           />
//           <input
//             type="number"
//             placeholder={t("To")}
//             value={priceTo}
//             onChange={(e) => setPriceTo(e.target.value)}
//             className="w-full px-2 py-1 border rounded-md text-sm"
//           />
//         </div>
//       )}

//       {/* Show Results */}
//       <button
//         type="button"
//         onClick={async () => {
//           setLoading(true);
//           try {
//             const params = {
//               category_id: categoryId,
//               ...(selectedCity ? { city: selectedCity } : {}),
//               condition:
//                 newUsed === "usedAny"
//                   ? "used"
//                   : newUsed === "newOnly"
//                   ? "new"
//                   : undefined,
//               price_from: priceFrom || undefined,
//               price_to: priceTo || undefined,
//               ...(search ? { search } : {}),
//             };
//                 console.log("📌 Filter Params:", params);  // 👈 yahan console

//             await handleFilter(params);
//           } finally {
//             setLoading(false);
//           }
//         }}
//         disabled={
//           loading || (!newUsed && !selectedCity && !priceFrom && !priceTo)
//         }
//         className="w-full bg-green-600 text-white py-2 rounded-md font-semibold hover:bg-green-700 disabled:opacity-50 mt-2"
//       >
//         {loading ? t("Loading...") : t("Show Results")}
//       </button>
//     </div>
//   );
// };

// export default FilterComponent;
// ui chnaged

"use client";
import React, { useEffect, useState } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FiChevronDown } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import { listingsApi } from "@/lib/api/listings";
import { City } from "country-state-city";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { useCityStore } from "@/lib/stores/cityStore";
import { useSearchParams } from "next/navigation";

const FilterComponent = ({ categoryId, onResults }) => {
  const searchParams = useSearchParams();
  const search = searchParams.get("search");
  const [newUsed, setNewUsed] = useState("");
  const [priceFrom, setPriceFrom] = useState("");
  const [priceTo, setPriceTo] = useState("");
  const [loading, setLoading] = useState(false);
  const [cities, setCities] = useState([]);
  const [openTab, setOpenTab] = useState(null); // which tab dropdown is open
  const { t } = useTranslation();
  const { selectedCity, setSelectedCity } = useCityStore();
    const conditions = [
    { key: "brand_new_unused", label: "Brand New / Unused – never opened or used." },
    { key: "like_new", label: "Like New – opened but looks and works like new." },
    { key: "gently_used_excellent_condition", label: "Gently Used / Excellent Condition – minor signs of use." },
    { key: "good_condition", label: "Good Condition – visible wear but fully functional." },
    { key: "fair_condition", label: "Fair Condition – heavily used but still works." },
    { key: "for_parts_or_not_working", label: "For Parts or Not Working – damaged or needs repair." },
  ];

  useEffect(() => {
    const defaultCities = City.getCitiesOfCountry("SA");
    const uniqueCities = defaultCities.filter(
      (city, index, self) =>
        index === self.findIndex((c) => c.name === city.name)
    );
    setCities(uniqueCities);
  }, []);

  const handleFilter = async (params) => {
    try {
      const response = await listingsApi.getListingsByFilter(params);
      if (onResults) onResults(response.data || response);
      toast.success("Listings filtered successfully!");
    } catch (err) {
      toast.error("Failed to filter listings.");
    }
  };

  const clearFilters = async () => {
    setNewUsed("");
    setPriceFrom("");
    setPriceTo("");
    setSelectedCity("");
    setOpenTab(null);
    const params = { category_id: categoryId, ...(search ? { search } : {}) };
    await handleFilter(params);
  };

  const removeFilter = (type) => {
    if (type === "condition") setNewUsed("");
    if (type === "city") setSelectedCity("");
    if (type === "price") {
      setPriceFrom("");
      setPriceTo("");
    }
  };

  return (
    <div className="w-full bg-white p-4 space-y-4">
      {/* Header with Active Filters & Clear All */}
      <div className="flex justify-between items-center mb-3">
        {/* Active Filters */}
        <div className="flex flex-wrap gap-2">
         {newUsed && (
  <span className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-full text-sm">
    {
      // find the matching label from conditions array by key
      conditions.find((item) => item.key === newUsed)?.label.split("–")[0] ||
      t("Condition")
    }
    <IoClose
      className="cursor-pointer"
      onClick={() => removeFilter("condition")}
    />
  </span>
)}

          {selectedCity && (
            <span className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-full text-sm">
              {selectedCity}
              <IoClose
                className="cursor-pointer"
                onClick={() => removeFilter("city")}
              />
            </span>
          )}
          {(priceFrom || priceTo) && (
            <span className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-full text-sm">
              {priceFrom || 0} - {priceTo || "∞"}
              <IoClose
                className="cursor-pointer"
                onClick={() => removeFilter("price")}
              />
            </span>
          )}
        </div>

        {/* Clear All Button (Right Side) */}
        <button
          onClick={clearFilters}
          className={`flex items-center gap-1 text-gray-500 hover:text-red-500 ${
            !newUsed && !selectedCity && !priceFrom && !priceTo
              ? "opacity-50 cursor-not-allowed"
              : ""
          }`}
          disabled={!newUsed && !selectedCity && !priceFrom && !priceTo}
        >
          <RiDeleteBin6Line size={18} />
          {t("Clear All")}
        </button>
      </div>

     

{/* Tabs + Show Results in Same Row */}
{/* Tabs + Show Results in Same Row */}
{/*  */}
{/* Tabs + Show Results in Same Row */}
<div className="flex gap-2 flex-wrap items-center">
  {/* Condition Tab */}
  <button
    type="button"
    onClick={() => setOpenTab(openTab === "condition" ? null : "condition")}
    className={`flex items-center gap-1 px-4 py-1.5 rounded-full text-sm font-medium transition 
      ${openTab === "condition"
        ? "bg-green-100 text-green-700 border border-green-400"
        : "bg-gray-50 border text-gray-700 hover:bg-green-50"}`}
  >
    {newUsed
      ? conditions.find((item) => item.key === newUsed)?.label.split("–")[0]
      : t("Condition")}
    <FiChevronDown size={14} />
  </button>



  {/* City Tab */}
  <button
    onClick={() => setOpenTab(openTab === "city" ? null : "city")}
    className={`flex items-center gap-1 px-4 py-1.5 rounded-full text-sm font-medium transition 
    ${openTab === "city" ? "bg-green-100 text-green-700 border border-green-400" : "bg-gray-50 border text-gray-700 hover:bg-green-50"}`}
  >
    {selectedCity || t("City")}
    <FiChevronDown size={14} />
  </button>

  {/* Price Tab */}
  <button
    onClick={() => setOpenTab(openTab === "price" ? null : "price")}
    className={`flex items-center gap-1 px-4 py-1.5 rounded-full text-sm font-medium transition 
    ${openTab === "price" ? "bg-green-100 text-green-700 border border-green-400" : "bg-gray-50 border text-gray-700 hover:bg-green-50"}`}
  >
    {priceFrom || priceTo ? `${priceFrom || 0} - ${priceTo || "∞"}` : t("Price")}
    <FiChevronDown size={14} />
  </button>

  {/* Show Results Button */}
  {/* Show Results Button */}
<button
  type="button"
  onClick={async () => {
    setLoading(true);
    const params = {
      category_id: categoryId,
      ...(newUsed ? { condition: newUsed } : {}),
      ...(selectedCity ? { city: selectedCity } : {}),
      ...(priceFrom ? { min_price: priceFrom } : {}),
      ...(priceTo ? { max_price: priceTo } : {}),
      ...(search ? { search } : {}),
    };
    await handleFilter(params);
    setLoading(false);
  }}
  disabled={loading || (!newUsed && !selectedCity && !priceFrom && !priceTo)}
  className="px-4 py-1.5 rounded-full bg-green-600 text-white text-sm font-semibold shadow-sm hover:bg-green-700 disabled:opacity-50 transition"
>
  {loading ? t("Loading...") : t("Show Results")}
</button>

</div>

{/* Dropdowns */}
  {openTab === "condition" && (
    <div className="absolute z-10 mt-2 w-1/3 bg-white border border-gray-200 rounded-lg shadow-md p-3">
      <div className="space-y-2 grid grid-cols-1 md:grid-cols-2">
        {conditions.map((item) => (
          <label
            key={item.key}
            className="flex items-start gap-2 cursor-pointer p-2 rounded hover:bg-green-50 transition"
          >
            <input
              type="radio"
              value={item.key}
               onClick={() => {
          setNewUsed(item.key);
          setOpenTab(null);
        }}
              checked={newUsed === item.key}
              onChange={() => {
                setValue("newUsed", item.key);
                setOpenTab(null); // close dropdown after select
              }}
              className="mt-1"
            />
            <span className="text-sm text-gray-700">{t(item.label)}</span>
          </label>
        ))}
      </div>
    </div>
  )}

{openTab === "city" && (
  <div className="mt-2 w-44 bg-white border rounded-lg shadow-lg max-h-40 overflow-y-auto animate-fade-in">
    {cities.map((city) => (
      <button
        key={city.name}
        onClick={() => {
          setSelectedCity(city.name);
          setOpenTab(null);
        }}
        className="block w-full text-left px-3 py-2 rounded-md text-sm hover:bg-green-50 hover:text-green-700 transition"
      >
        {city.name}
      </button>
    ))}
  </div>
)}

{openTab === "price" && (
  <div className="mt-2 w-52 bg-white border rounded-lg shadow-lg p-3 space-y-2 animate-fade-in">
    <input
      type="number"
      placeholder={t("From")}
      value={priceFrom}
      onChange={(e) => setPriceFrom(e.target.value)}
      className="w-full px-2 py-1 border rounded-md text-sm focus:ring-1 focus:ring-green-500 outline-none"
    />
    <input
      type="number"
      placeholder={t("To")}
      value={priceTo}
      onChange={(e) => setPriceTo(e.target.value)}
      className="w-full px-2 py-1 border rounded-md text-sm focus:ring-1 focus:ring-green-500 outline-none"
    />
  </div>
)}



      {/* Dropdowns */}
      {/* {openTab === "condition" && (
        <div className="mt-2 shadow-sm">
          <button
            onClick={() => {
              setNewUsed("newOnly");
              setOpenTab(null);
            }}
            className="block w-44 border rounded-md text-left px-3 py-2 hover:bg-gray-100 text-sm"
          >
            {t("New")}
          </button>
          <button
            onClick={() => {
              setNewUsed("usedAny");
              setOpenTab(null);
            }}
            className="block w-44 border rounded-md mt-2 text-left px-3 py-2 hover:bg-gray-100 text-sm"
          >
            {t("Used")}
          </button>
        </div>
      )}

      {openTab === "city" && (
        <div className="border rounded-md mt-2 shadow-sm max-h-48 overflow-y-auto">
          {cities.map((city) => (
            <button
              key={city.name}
              onClick={() => {
                setSelectedCity(city.name);
                setOpenTab(null);
              }}
              className="block w-full text-left px-3 py-2 hover:bg-gray-100 text-sm"
            >
              {city.name}
            </button>
          ))}
        </div>
      )}

      {openTab === "price" && (
        <div className="border rounded-md mt-2 shadow-sm p-3 space-y-2">
          <input
            type="number"
            placeholder={t("From")}
            value={priceFrom}
            onChange={(e) => setPriceFrom(e.target.value)}
            className="w-full px-2 py-1 border rounded-md text-sm"
          />
          <input
            type="number"
            placeholder={t("To")}
            value={priceTo}
            onChange={(e) => setPriceTo(e.target.value)}
            className="w-full px-2 py-1 border rounded-md text-sm"
          />
        </div>
      )} */}
{/* Dropdowns */}
{/* {openTab === "condition" && (
  <div className="mt-2 w-36 bg-white border rounded-lg shadow-lg p-1">
    <button
      onClick={() => {
        setNewUsed("newOnly");
        setOpenTab(null);
      }}
      className="block w-full text-left px-3 py-2 rounded-md text-sm hover:bg-green-50 transition"
    >
      {t("New")}
    </button>
    <button
      onClick={() => {
        setNewUsed("usedAny");
        setOpenTab(null);
      }}
      className="block w-full text-left px-3 py-2 rounded-md text-sm hover:bg-green-50 transition"
    >
      {t("Used")}
    </button>
  </div>
)}

{openTab === "city" && (
  <div className="mt-2 w-44 bg-white border rounded-lg shadow-lg max-h-40 overflow-y-auto">
    {cities.map((city) => (
      <button
        key={city.name}
        onClick={() => {
          setSelectedCity(city.name);
          setOpenTab(null);
        }}
        className="block w-full text-left px-3 py-2 text-sm hover:bg-green-50 transition border-b last:border-0"
      >
        {city.name}
      </button>
    ))}
  </div>
)}

{openTab === "price" && (
  <div className="mt-2 w-48 bg-white border rounded-lg shadow-lg p-3 space-y-2">
    <input
      type="number"
      placeholder={t("From")}
      value={priceFrom}
      onChange={(e) => setPriceFrom(e.target.value)}
      className="w-full px-2 py-1 border rounded-md text-sm focus:ring-1 focus:ring-green-500 outline-none"
    />
    <input
      type="number"
      placeholder={t("To")}
      value={priceTo}
      onChange={(e) => setPriceTo(e.target.value)}
      className="w-full px-2 py-1 border rounded-md text-sm focus:ring-1 focus:ring-green-500 outline-none"
    />
  </div>
)} */}


    
    </div>
  );
};

export default FilterComponent;
