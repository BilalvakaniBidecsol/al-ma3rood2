"use client";
import React, { useEffect, useMemo, useState } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FiChevronDown } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import { listingsApi } from "@/lib/api/listings";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { useLocationStore } from "@/lib/stores/locationStore";
import { useSearchParams } from "next/navigation";

const FilterComponent = ({ categoryId, onResults }) => {
  const searchParams = useSearchParams();
  const search = searchParams.get("search");
  const [newUsed, setNewUsed] = useState("");
  const [priceFrom, setPriceFrom] = useState("");
  const [priceTo, setPriceTo] = useState("");
  const [loading, setLoading] = useState(false);
  const [openTab, setOpenTab] = useState(null);
  const { t } = useTranslation();

  // Location Store
  const {
    locations,
    getAllLocations,
    selectedRegion,
    selectedGovernorate,
    setSelectedRegion,
    setSelectedGovernorate,
  } = useLocationStore();

  useEffect(() => {
    getAllLocations();
  }, [getAllLocations]);

  const country = locations.find((c) => c.id == 1);
  const regions = country?.regions || [];

  const governorates = useMemo(() => {
    if (!selectedRegion || !selectedRegion.name) return [];
    const region = regions.find((r) => r.name === selectedRegion.name);
    return region?.governorates || [];
  }, [regions, selectedRegion]);

  const conditions = [
    { key: "brand_new_unused", label: "Brand New / Unused – never opened or used." },
    { key: "like_new", label: "Like New – opened but looks and works like new." },
    { key: "gently_used_excellent_condition", label: "Gently Used / Excellent Condition – minor signs of use." },
    { key: "good_condition", label: "Good Condition – visible wear but fully functional." },
    { key: "fair_condition", label: "Fair Condition – heavily used but still works." },
    { key: "for_parts_or_not_working", label: "For Parts or Not Working – damaged or needs repair." },
  ];

  const handleFilter = async (params) => {
    try {
      const response = await listingsApi.getListingsByFilter(params);
      if (onResults) onResults(response.data || response);
      toast.success("Listings filtered successfully!");
    } catch {
      toast.error("Failed to filter listings.");
    }
  };

  const clearFilters = async () => {
    setNewUsed("");
    setPriceFrom("");
    setPriceTo("");
    setSelectedRegion(null);
    setSelectedGovernorate(null);
    setOpenTab(null);

    const params = { category_id: categoryId, ...(search ? { search } : {}) };
    await handleFilter(params);
  };

  // const removeFilter = (type) => {
  //   if (type === "condition") setNewUsed("");
  //   if (type === "region") setSelectedRegion(null);
  //   if (type === "governorate") setSelectedGovernorate(null);
  //   if (type === "price") {
  //     setPriceFrom("");
  //     setPriceTo("");
  //   }
  // };
  const removeFilter = async (type) => {
  let updatedFilters = {
    category_id: categoryId,
    ...(newUsed ? { condition: newUsed } : {}),
    ...(selectedRegion ? { region_id: selectedRegion.id } : {}),
    ...(selectedGovernorate ? { governorate_id: selectedGovernorate.id } : {}),
    ...(priceFrom ? { min_price: priceFrom } : {}),
    ...(priceTo ? { max_price: priceTo } : {}),
    ...(search ? { search } : {}),
  };

  if (type === "condition") {
    setNewUsed("");
    delete updatedFilters.condition;
  }
  if (type === "region") {
    setSelectedRegion(null);
    setSelectedGovernorate(null);
    delete updatedFilters.region_id;
    delete updatedFilters.governorate_id;
  }
  if (type === "governorate") {
    setSelectedGovernorate(null);
    delete updatedFilters.governorate_id;
  }
  if (type === "price") {
    setPriceFrom("");
    setPriceTo("");
    delete updatedFilters.min_price;
    delete updatedFilters.max_price;
  }

  await handleFilter(updatedFilters);
};


  return (
    <div className="w-full bg-white px-4 space-y4">
      {/* Header with Active Filters & Clear All */}
      <div className="flex justify-between items-start mb-2 max-w-xl">
        <div className="flex flex-wrap gap-2">
          {newUsed && (
            <span className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-full text-sm">
              {conditions.find((item) => item.key === newUsed)?.label.split("–")[0] || t("Condition")}
              <IoClose className="cursor-pointer" onClick={() => removeFilter("condition")} />
            </span>
          )}

          {selectedRegion && (
            <span className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-full text-sm">
              {selectedRegion.name}
              <IoClose className="cursor-pointer" onClick={() => removeFilter("region")} />
            </span>
          )}

          {selectedGovernorate && (
            <span className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-full text-sm">
              {selectedGovernorate.name}
              <IoClose className="cursor-pointer" onClick={() => removeFilter("governorate")} />
            </span>
          )}

          {(priceFrom || priceTo) && (
            <span className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-full text-sm">
              {priceFrom || 0} - {priceTo || "∞"}
              <IoClose className="cursor-pointer" onClick={() => removeFilter("price")} />
            </span>
          )}
        </div>


      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2 flex-wrap items-center">
        {/* Condition */}
        <button
          type="button"
          onClick={() => setOpenTab(openTab === "condition" ? null : "condition")}
          className={`flex items-center gap-1 px-4 py-1.5 rounded-full text-sm font-medium transition ${
            openTab === "condition"
              ? "bg-green-100 text-green-700 border border-green-400"
              : "bg-gray-50 border text-gray-700 hover:bg-green-50"
          }`}
        >
          {newUsed
            ? conditions.find((item) => item.key === newUsed)?.label.split("–")[0]
            : t("Condition")}
          <FiChevronDown size={14} />
        </button>

        {/* Region */}
        <button
          onClick={() => setOpenTab(openTab === "region" ? null : "region")}
          className={`flex items-center gap-1 px-4 py-1.5 rounded-full text-sm font-medium transition ${
            openTab === "region"
              ? "bg-green-100 text-green-700 border border-green-400"
              : "bg-gray-50 border text-gray-700 hover:bg-green-50"
          }`}
        >
          {selectedRegion ? selectedRegion.name : t("Region")}
          <FiChevronDown size={14} />
        </button>

        {/* Governorate */}
        <button
          onClick={() => setOpenTab(openTab === "governorate" ? null : "governorate")}
          disabled={!selectedRegion}
          className={`flex items-center gap-1 px-4 py-1.5 rounded-full text-sm font-medium transition ${
            !selectedRegion
              ? "bg-gray-100 cursor-not-allowed text-gray-400"
              : openTab === "governorate"
              ? "bg-green-100 text-green-700 border border-green-400"
              : "bg-gray-50 border text-gray-700 hover:bg-green-50"
          }`}
        >
          {selectedGovernorate ? selectedGovernorate.name : t("Governorate")}
          <FiChevronDown size={14} />
        </button>

        {/* Price */}
        <button
          onClick={() => setOpenTab(openTab === "price" ? null : "price")}
          className={`flex items-center gap-1 px-4 py-1.5 rounded-full text-sm font-medium transition ${
            openTab === "price"
              ? "bg-green-100 text-green-700 border border-green-400"
              : "bg-gray-50 border text-gray-700 hover:bg-green-50"
          }`}
        >
          {priceFrom || priceTo ? `${priceFrom || 0} - ${priceTo || "∞"}` : t("Price")}
          <FiChevronDown size={14} />
        </button>

        {/* Show Results */}
        <button
          type="button"
          onClick={async () => {
            setLoading(true);
            const params = {
              category_id: categoryId,
              ...(newUsed ? { condition: newUsed } : {}),
              ...(selectedRegion ? { region_id: selectedRegion.id } : {}),
              ...(selectedGovernorate ? { governorate_id: selectedGovernorate.id } : {}),
              ...(priceFrom ? { min_price: priceFrom } : {}),
              ...(priceTo ? { max_price: priceTo } : {}),
              ...(search ? { search } : {}),
            };
            await handleFilter(params);
            setLoading(false);
          }}
          disabled={
            loading ||
            (!newUsed && !selectedRegion && !selectedGovernorate && !priceFrom && !priceTo)
          }
          className="px-4 py-1.5 rounded-full bg-green-600 text-white text-sm font-semibold shadow-sm hover:bg-green-700 disabled:opacity-50 transition"
        >
          {loading ? t("Loading...") : t("Show Results")}
        </button>
{/* Clear All */}
                {(newUsed || selectedRegion || selectedGovernorate || priceFrom || priceTo) && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full text-sm text-gray-500 border border-red-400 hover:text-red-500 min-w-20"
          >
            <RiDeleteBin6Line size={18} />
            {t("Clear All")}
          </button>
        )}
      </div>

      {/* Dropdowns */}
      {openTab === "condition" && (
        <div className="absolute z-10 mt-2 w-80 md:w-1/3 bg-white border border-gray-200 rounded-lg shadow-md p-3">
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
                  className="mt-1"
                />
                <span className="text-sm text-gray-700">{t(item.label)}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Region Dropdown */}
      {openTab === "region" && (
        <div className="mt-2 w-44 bg-white border rounded-lg shadow-lg max-h-40 overflow-y-auto animate-fade-in">
          {regions.map((region) => (
            <button
              key={region.id}
              onClick={() => {
                setSelectedRegion({ id: region.id, name: region.name });
                setSelectedGovernorate(null);
                setOpenTab(null);
              }}
              className="block w-full text-left px-3 py-2 rounded-md text-sm hover:bg-green-50 hover:text-green-700 transition"
            >
              {region.name}
            </button>
          ))}
        </div>
      )}

      {/* Governorate Dropdown */}
      {openTab === "governorate" && (
        <div className="mt-2 w-44 bg-white border rounded-lg shadow-lg max-h-40 overflow-y-auto animate-fade-in">
          {governorates.map((gov) => (
            <button
              key={gov.id}
              onClick={() => {
                setSelectedGovernorate({ id: gov.id, name: gov.name });
                setOpenTab(null);
              }}
              className="block w-full text-left px-3 py-2 rounded-md text-sm hover:bg-green-50 hover:text-green-700 transition"
            >
              {gov.name}
            </button>
          ))}
        </div>
      )}

      {/* Price Dropdown */}
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
    </div>
  );
};

export default FilterComponent;
