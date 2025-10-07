"use client";
import { useState, useEffect, useRef } from "react";
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

const PropertiesClient = () => {
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const categoryTree = buildCategoryTree(categories);
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'
  const [sortBy, setSortBy] = useState("price_low");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [motorListings, setMotorListings] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
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

  // Load motor listings
  useEffect(() => {
    loadMotorListings();
  }, [filters.category_id, currentPage, searchQuery]);

  const loadMotorListings = async () => {
    setIsLoading(true);
    try {
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
      };

      const response = await propertiesApi.getPropertiesByFilter(payload);
      setMotorListings(response || []);
    } catch (error) {
      console.error("Error loading motor listings:", error);
      toast.error("Failed to load motor listings");
      setMotorListings([]);
      setTotalResults(0);
    } finally {
      setIsLoading(false);
    }
  };

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
  const [activeTab, setActiveTab] = useState("");
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("cars");

  const tabs = allowedTabs.filter((allowed) =>
    categories.some((cat) =>
      cat.name.toLowerCase().includes(allowed.name.toLowerCase())
    )
  );
  // Always include "All categories"
  tabs.push(allowedTabs.find((t) => t.key === "allcat"));

  const toggleMoreOptions = () => {
    setShowMoreOptions(!showMoreOptions);
  };
  const handleFilterChange = (filterName, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: value,
    }));
    setCurrentPage(1); // Reset to first page when filters change
  };

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

  const clearFilters = () => {
    setFilters({
      vehicle_type: "",
      make: "",
      model: "",
      year_min: "",
      year_max: "",
      price_min: "",
      price_max: "",
      fuel_type: "",
      transmission: "",
      body_style: "",
      condition: "",
      odometer_min: "",
      odometer_max: "",
      search: "",
      category_id: null,
    });
    setActiveTab("");
    setSearchQuery("");
    setCurrentPage(1);
    loadMotorListings();
  };

  // Dropdown options
  const conditionOptions = [
    { value: "", label: "Any Condition" },
    { value: "new", label: "New" },
    { value: "used", label: "Used" },
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
    <div className="bg-white min-h-screen">
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
      {/* {t("Your Marketplace. Your Kingdom.")} */}
      {/* Filter Card with Blended Tabs */}
      <div className="max-w-5xl mx-auto -mt-20 relative z-10 px-4">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Tabs section - blended with hero color */}
          <div className="bg-white rounded-lg  overflow-hidden">
            {/* Tabs section - flush with top of card */}
            <div className="flex border-b border-gray-200">
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
                  className={`flex-1 text-sm font-medium h-10 px-4 text-center w-auto
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
                    <span>{tab.name}</span>
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
                <div>
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
              <div className="my-4">
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
                    loadMotorListings();
                  }}
                  type="button"
                  className="w-full sm:w-auto bg-[#175f48] hover:bg-green-700 text-white px-6 py-2 rounded-md transition-colors text-center"
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
            <div className="flex justify-center gap-2">
              <button
                className={`flex items-center gap-1 px-3 py-2 rounded-md text-sm ${
                  viewMode === "list"
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => setViewMode("list")}
                aria-pressed={viewMode === "list"}
              >
                <FaThList />
                <span>{t("Grid")}</span>
              </button>
              <button
                className={`flex items-center gap-1 px-3 py-2 rounded-md text-sm ${
                  viewMode === "grid"
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => setViewMode("grid")}
                aria-pressed={viewMode === "grid"}
              >
                <FaTh />
                <span>{t("Grid")}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Motor listings */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        ) : motorListings.length > 0 ? (
          <div
            className={`grid gap-6 mb-10 ${
              viewMode === "grid"
                ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                : "grid-cols-1 md:mx-10 "
            }`}
          >
            {motorListings.map((property) => (
              <PropertyCard
                key={property.id}
                listing={property}
                viewMode={viewMode}
              />
            ))}
          </div>
        ) : (
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

        {/* Pagination */}
        {totalResults > 12 && (
          <div className="flex justify-center mt-8">
            <div className="flex space-x-2">
              {currentPage > 1 && (
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  {t("Previous")}
                </button>
              )}

              {/* Page numbers */}
              {Array.from(
                { length: Math.min(5, Math.ceil(totalResults / 12)) },
                (_, i) => {
                  const pageNum = currentPage - 2 + i;
                  if (pageNum < 1 || pageNum > Math.ceil(totalResults / 12))
                    return null;

                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-4 py-2 border border-gray-300 rounded-md ${
                        currentPage === pageNum
                          ? "bg-green-600 text-white"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                }
              )}

              {currentPage < Math.ceil(totalResults / 12) && (
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  {t("Next")}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertiesClient;
