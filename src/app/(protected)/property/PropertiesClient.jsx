"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import Select from "react-select";
import { Search, BikeIcon as Motorbike } from "lucide-react";
import CustomDropdown from "@/components/WebsiteComponents/MotorsPageComponents/CustomDropdown";
import { categoriesApi } from "@/lib/api/category";
import Link from "next/link";
import propertiesApi, { motorSearchFilters } from "@/lib/api/properties";
import { FaTh, FaThList } from "react-icons/fa";
import MotorListingCard from "@/components/WebsiteComponents/MotorListingCard";
import { useTranslation } from "react-i18next";
import PropertyCard from "./PropertyCard";

const allowedTabs = [
  {
    key: "Commercial Property",
    name: "Commercial Property",
    icon: "./rent.png",
  },
  { key: "New homes", name: "New homes", icon: "./house.png" },
  { key: "Residential", name: "Residential", icon: "./flat.png" },
  {
    key: "Retirement villages",
    name: "Retirement villages",
    icon: "./villages.png",
  },
  { key: "Rural", name: "Rural", icon: "./villages.png" },
  { key: "allcat", name: "All categories", icon: "./categ.png" },
];

function buildCategoryTree(categories) {
  const map = {};
  const roots = [];

  categories.forEach((cat) => {
    map[cat.id] = { ...cat, children: [] };
  });

  categories.forEach((cat) => {
    if (cat.parent_id) {
      map[cat.parent_id]?.children.push(map[cat.id]);
    } else {
      roots.push(map[cat.id]); // top-level (Cars, Motorbikes, etc.)
    }
  });

  return roots;
}

const PropertiesClient = ({
  category,
  initialProducts,
  pagination,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const categoryTree = buildCategoryTree(categories);
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'
  const [sortBy, setSortBy] = useState("price_low");
  const [searchQuery, setSearchQuery] = useState("");
  const [motorListings, setMotorListings] = useState(initialProducts || []);
    const [activeTab, setActiveTab] = useState("");
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("cars");

  const tabs = allowedTabs.filter((allowed) =>
    categories.some((cat) =>
      cat.name.toLowerCase().includes(allowed.name.toLowerCase())
    )
  );
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(
    pagination?.currentPage < pagination?.totalPages
  );
  const [isLoading, setIsLoading] = useState(false);
  const observerRef = useRef(null);
  const firstLoad = useRef(true);

  // Filter states
  const [filters, setFilters] = useState({
    search: "",
    category_id: null,
    price_min: 0,
    price_max: 10000000,
    condition: "",
    land_area: "", // dropdown single field
    parking: "", // dropdown single field
    country: "",
    city: "",
  });

  const { t } = useTranslation();

  const modelsByMake = {
    Toyota: ["Corolla", "Camry", "Yaris"],
    Honda: ["Civic", "Accord", "CR-V"],
    BMW: ["X5", "3 Series", "5 Series"],
    Ford: ["Mustang", "F-150", "Explorer"],
  };

// useEffect(() => {
//   loadMore(true); 
// }, [filters])


const loadMore = useCallback(async () => {
    if (!hasMore || isLoading) return;

    setIsLoading(true);
    try {
      const nextPage = currentPage + 1;
      const payload = {
        ...filters,
        max_price: filters?.price_max,
        min_price: filters?.price_min,
        search: filters?.search,
        // vehicle_type: activeTab !== "allcat" ? activeTab : "",
        sort: sortBy,
        pagination: {
          page: currentPage,
          per_page: 12,
        },
        listing_type: "property",
        pagination: { page: nextPage, per_page: 6 },
        category_id: filters?.category_id,
      };

      console.log("📡 Loading page:", nextPage);
      const response = await propertiesApi.getPropertiesByFilter(payload);

      // ✅ Adjust depending on API structure
      const newData = response || [];
      const totalPages =
        response?.pagination?.last_page ||
        1;

      if (newData.length > 0) {
        setMotorListings((prev) => [...prev, ...newData]);
        setCurrentPage(nextPage);
        setHasMore(nextPage < totalPages);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error("❌ Error loading more:", err);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, hasMore, isLoading, pagination?.totalPages]);

  useEffect(() => {
    const fetchCategories = async () => {
      const listing_type = "property";
      try {
        const { data } = await categoriesApi.getAllCategories(
          null,
          listing_type
        );
        setCategories(data || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobileMenuOpen]);

 // ✅ Intersection Observer (Infinite Scroll)
useEffect(() => {
  if (isLoading || !hasMore) return;

  const observer = new IntersectionObserver(
    (entries) => {
      // Prevent first automatic trigger
      if (firstLoad.current) {
        firstLoad.current = false;
        return;
      }

      if (entries[0].isIntersecting && hasMore && !isLoading) {
        console.log("🔥 Bottom reached → loading more...");
        loadMore(); 
      }
    },
    {
      root: null,
      rootMargin: "300px",
      threshold: 0.1,
    }
  );

  const currentRef = observerRef.current;
  if (currentRef) observer.observe(currentRef);

  return () => {
    if (currentRef) observer.unobserve(currentRef);
  };
}, [hasMore, isLoading, loadMore]);


  // Always include "All categories"
  tabs.push(allowedTabs.find((t) => t.key === "allcat"));

  // Apply sorting before rendering
  const sortedListings = [...motorListings].sort((a, b) => {
    const getPrice = (item) => {
      if (item.allow_offers) {
        return parseFloat(item.start_price) || 0;
      }
      return parseFloat(item.buy_now_price) || 0;
    };

    const getCreatedAt = (item) => new Date(item.created_at).getTime();

    switch (sortBy) {
      case "price_low":
        return getPrice(a) - getPrice(b); // lowest price first
      case "price_high":
        return getPrice(b) - getPrice(a); // highest price first
      case "year_new": // latest created_at
        return getCreatedAt(b) - getCreatedAt(a);
      case "year_old": // oldest created_at
        return getCreatedAt(a) - getCreatedAt(b);
      default:
        return 0; // no sorting
    }
  });

     useEffect(() => {
  console.log("📊 Pagination Info:", pagination);
  console.log("➡️ Has More:", hasMore);
}, [motorListings, sortedListings]);


  const clearFilters = () => {
    setFilters({
      search: "",
    category_id: null,
    price_min: 0,
    price_max: 10000000,
    condition: "",
    land_area: "", 
    parking: "", 
    country: "",
    city: "",
    });
    setActiveTab("");
    setSearchQuery("");
    setCurrentPage(1);
    loadMore();
  };

  // Dropdown options
  const conditionOptions = [
  { value: "", label: "Any Condition" },
  { value: "brand_new", label: "Brand New" },
  { value: "ready_to_move", label: "Ready to Move" },
  { value: "under_construction", label: "Under Construction" },
  { value: "furnished", label: "Furnished" },
  { value: "semi_furnished", label: "Semi-Furnished" },
  { value: "unfurnished", label: "Unfurnished" },
  { value: "recently_renovated", label: "Recently Renovated" },
];

  const priceOptions = [
    { value: "", label: "Select Price" },
    { value: "50000", label: "$50,000" },
    { value: "100000", label: "$100,000" },
    { value: "200000", label: "$200,000" },
    { value: "500000", label: "$500,000+" },
  ];

  const landAreaOptions = [
    { value: "", label: "Select Land Area" },
    { value: "100", label: "100 sqm" },
    { value: "200", label: "200 sqm" },
    { value: "300", label: "300 sqm" },
    { value: "400", label: "400 sqm" },
    { value: "500", label: "500+ sqm" },
  ];

  const parkingOptions = [
    { value: "", label: "Select Parking" },
    { value: "1", label: "1 Slot" },
    { value: "2", label: "2 Slots" },
    { value: "3", label: "3 Slots" },
    { value: "4", label: "4+ Slots" },
  ];

  return (
    <div className="bg-white">

      {/* Hero Section */}
      <div
        className="w-full h-64 sm:h-72 lg:h-80 rounded-b-[60px] text-white px-4 sm:px-8 py-10 sm:py-12 relative flex items-center"
        style={{ background: "rgb(23, 95, 72)" }}
      >
        <div className="max-w-6xl mx-auto w-full">
          <h1
            className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-snug mb-6 sm:mb-8"
            dangerouslySetInnerHTML={{
              __html: t("SHOP NEW & USED ITEMS <br /> FOR SALE"),
            }}
          />
        </div>
      </div>
      
      {/* Filter Card with Blended Tabs */}
      <div className="max-w-5xl mx-auto -mt-20 relative z-10 px-4">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Tabs section - blended with hero color */}
          <div className="bg-white rounded-lg  overflow-hidden">
            {/* Tabs section - flush with top of card */}
            <div className="flex border-b border-gray-200 overflow-x-auto no-scrollbar">
  {tabs.map((tab) => (
    <button
      key={tab.key}
      onClick={() => {
        const selectedCat = categories.find(
          (cat) => cat.name.toLowerCase() === tab.name.toLowerCase()
        );
        setActiveTab(tab.key);
        setFilters({
          ...filters,
          category_id:
            tab.key === "allcat"
              ? null
              : selectedCat
              ? selectedCat.id
              : null,
        });
      }}
      className={`flex-shrink-0 text-sm font-medium h-10 px-4 text-center
      ${
        activeTab === tab.key
          ? "bg-white text-[#175f48]"
          : "bg-gray-50 text-gray-600 hover:bg-gray-100"
      } border-r border-gray-200 last:border-r-0`}
    >
      <div className="flex items-center justify-center gap-2 h-full">
        <img
          src={tab.icon}
          alt={tab.name}
          className="w-5 h-5 object-contain"
        />
        <span className="whitespace-nowrap text-[15.3px]">{tab.name}</span>
      </div>
    </button>
  ))}
</div>

          </div>

          {/* Main Filter Content */}
          <div className="p-4 sm:p-6">
            {/* Initial Filter Grid */}
            {activeTab !== "allcat" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Condition */}
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Condition
                  </label>
                  <Select
                    options={conditionOptions}
                    value={conditionOptions.find(
                      (o) => o.value === filters.condition
                    )}
                    onChange={(selected) =>
                      setFilters({ ...filters, condition: selected.value })
                    }
                  />
                </div>

                {/* Price Range */}
                <div className="z-20">
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Min Price
                  </label>
                  <Select
                    options={priceOptions}
                    value={priceOptions.find(
                      (o) => o.value === filters.price_min
                    )}
                    onChange={(selected) =>
                      setFilters({ ...filters, price_min: selected.value })
                    }
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Max Price
                  </label>
                  <Select
                    options={priceOptions}
                    value={priceOptions.find(
                      (o) => o.value === filters.price_max
                    )}
                    onChange={(selected) =>
                      setFilters({ ...filters, price_max: selected.value })
                    }
                  />
                </div>

                {/* Land Area */}
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Land Area
                  </label>
                  <Select
                    options={landAreaOptions}
                    value={landAreaOptions.find(
                      (o) => o.value === filters.land_area
                    )}
                    onChange={(selected) =>
                      setFilters({ ...filters, land_area: selected.value })
                    }
                  />
                </div>

                {/* Parking */}
                <div className="z-10">
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Parking
                  </label>
                  <Select
                    options={parkingOptions}
                    value={parkingOptions.find(
                      (o) => o.value === filters.parking
                    )}
                    onChange={(selected) =>
                      setFilters({ ...filters, parking: selected.value })
                    }
                  />
                </div>
              </div>
            )}
            {/* ✅ BOTTOM Search Box for cars */}
            {activeTab !== "allcat" && (
              <div className="my-4 pt-10">
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  {t("Keywords")}
                </label>
                <div
                  className={`relative ${
                    showMoreOptions ? "w-full" : "w-full sm:w-[300px]"
                  }`}
                >
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder={t("Search using keywords")}
                    value={filters.search || ""}
                    onChange={(e) =>
                      setFilters({ ...filters, search: e.target.value })
                    }
                    className="pl-10 pr-4 py-2 w-full rounded-sm bg-[#FAFAFA] border border-gray-300  text-sm text-gray-700 focus:outline-none transition"
                  />
                </div>
              </div>
            )}

            {/* Bottom Button (Only for Cars) */}
            {activeTab !== "allcat" && (
              <div className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-end gap-4">
                <button
                  onClick={() => {
                    loadMore();
                  }}
                  type="button"
                  className="w-full cursor-pointer sm:w-auto bg-[#175f48] hover:bg-green-700 text-white px-6 py-2 rounded-md transition-colors text-center"
                >
                  {t("View listings")}
                </button>
              </div>
            )}

            {activeTab === "allcat" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-6">
                {categoryTree.map((parent) => (
                  <div key={parent.id}>
                    {/* ✅ Parent Category */}
                    <h3
                      className={`text-lg font-semibold mb-3 cursor-pointer hover:underline ${
                        filters.category_id === parent.id
                          ? "text-blue-600 underline" // 🔵 Highlight parent differently
                          : "text-[#175f48]"
                      }`}
                      onClick={() => {
                        setFilters({ ...filters, category_id: parent.id });
                      }}
                    >
                      {parent.name}
                    </h3>

                    {/* ✅ Child Categories */}
                    <div className="space-y-2 ml-3">
                      {parent.children.map((child) => (
                        <div
                          key={child.id}
                          onClick={() => {
                            setFilters({ ...filters, category_id: child.id });
                          }}
                          className={`block text-sm cursor-pointer hover:underline ${
                            filters.category_id === child.id
                              ? "text-green-600 font-semibold" // 🟢 Different from parent
                              : "text-gray-700"
                          }`}
                        >
                          {child.name}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-10 px-5 md:px-0 md:mx-10">
        {/* Results header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-4">
          <p className="text-gray-900 text-sm">
            {isLoading ? (
              ""
            ) : (
              <>
                {t("Showing")}{" "}
                <span className="font-semibold">
                  {motorListings.length || 0}
                </span>{" "}
                {t("Results")}
              </>
            )}
          </p>
          <div className="flex items-center gap-3 mt-2 md:mt-0">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 rounded px-2 py-1 text-sm"
            >
              {/* <option value="featured">Sort: Featured First</option> */}
              <option value="price_low">{t("Price: Low to High")}</option>
              <option value="price_high">{t("Price: High to Low")}</option>
              <option value="year_new">{t("Newest First")}</option>
              <option value="year_old">{t("Oldest First")}</option>
              {/* <option value="odometer_low">Mileage: Low to High</option> */}
            </select>
          </div>
        </div>

{/* Property listings */}
<div
  className={`grid gap-6 mb-10 ${
    viewMode === "grid"
      ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
      : "grid-cols-1 md:mx-10"
  }`}
>
  {/* 🟩 Show existing listings */}
  {motorListings.length > 0 &&
    motorListings.map((property) => (
      <PropertyCard
        key={property.id}
        listing={property}
        viewMode={viewMode}
      />
    ))}

  {/* 🟨 Show initial skeletons only if no data yet */}
  {isLoading && currentPage === 1 && motorListings.length === 0 &&
    [...Array(6)].map((_, i) => (
      <div
        key={i}
        className="rounded-lg overflow-hidden shadow-lg animate-pulse bg-gray-100"
      >
        <div className="h-52 bg-gray-300"></div>
        <div className="p-4 space-y-3">
          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
          <div className="h-3 bg-gray-300 rounded w-1/2"></div>
          <div className="flex justify-between mt-4">
            <div className="h-3 bg-gray-300 rounded w-1/4"></div>
            <div className="h-3 bg-gray-300 rounded w-1/4"></div>
          </div>
        </div>
      </div>
    ))}

  {/* 🟦 Append skeletons below old data while loading next page */}
  {isLoading && currentPage > 1 && (
    [...Array(3)].map((_, i) => (
      <div
        key={`loader-${i}`}
        className="rounded-lg overflow-hidden shadow-lg animate-pulse bg-gray-100"
      >
        <div className="h-52 bg-gray-300"></div>
        <div className="p-4 space-y-3">
          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
          <div className="h-3 bg-gray-300 rounded w-1/2"></div>
          <div className="flex justify-between mt-4">
            <div className="h-3 bg-gray-300 rounded w-1/4"></div>
            <div className="h-3 bg-gray-300 rounded w-1/4"></div>
          </div>
        </div>
      </div>
    ))
  )}
</div>

{/* 🟥 Show "no results" message */}
{!isLoading && motorListings.length === 0 && (
  <div className="text-center py-12">
    <div className="text-gray-500 mb-4">
      <Search className="w-16 h-16 mx-auto mb-4" />
      <h3 className="text-xl font-semibold mb-2">No properties found</h3>
      <p>Try adjusting your search criteria or filters</p>
    </div>
    <button
      onClick={clearFilters}
      className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md transition-colors"
    >
      Clear Filters
    </button>
  </div>
)}

{/* 🔹 Infinite Scroll Trigger */}
      <div ref={observerRef} className="h-10 bg-transparent" />
      </div>
    </div>
  );
};

export default PropertiesClient;
