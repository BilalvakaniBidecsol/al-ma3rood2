"use client";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import React, { useEffect, useRef, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { listingsApi } from "@/lib/api/listings";
import { useRouter } from "next/navigation";
import { Image_NotFound, Image_URL } from "@/config/constants";
import { useStaticCategoryStore } from "@/lib/stores/staticCategoryStore";

const GridLayout = () => {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const dropdownRef = useRef(null);
  // const [searchTerm, setSearchTerm] = useState("");
  // const [results, setResults] = useState([]);
  // const [loading, setLoading] = useState(false);
  // const [showDropdown, setShowDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
const [results, setResults] = useState([]);
const [pastSearches, setPastSearches] = useState([]);
const [loading, setLoading] = useState(false);
const [showDropdown, setShowDropdown] = useState(false);

  const { staticCategories, setSelectedStaticCategory } =
    useStaticCategoryStore(); // 👈 get from store
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

 // Fetch results when typing
  useEffect(() => {
    if (searchTerm.length > 2) {
      const timer = setTimeout(async () => {
        setLoading(true);
        try {
          const res = await listingsApi.getListingsFilterByAllCategories({query: searchTerm});
          setResults(res?.web_suggestions || []);
          setShowDropdown(true);
          console.log("Search results:", res);
        } catch (error) {
          console.error("Search error:", error);
          setResults([]);
        } finally {
          setLoading(false);
        }
      }, 300); // 300ms debounce

      return () => clearTimeout(timer);
    } else {
      setResults([]);
      setShowDropdown(false);
    }
  }, [searchTerm]);

// Fetch past searches on mount
useEffect(() => {
  const fetchPastSearches = async () => {
    try {
      const res = await listingsApi.getListingsFilterByAllCategories({});
      setPastSearches(res?.past_searches || []);
    } catch (error) {
      console.error("Error fetching past searches:", error);
    }
  };
  fetchPastSearches();
}, []);

// When input is clicked → show dropdown (past searches if no term)
const handleFocus = () => {
  setShowDropdown(true);
};

  const handleSelectProduct = async (listing) => {
    setShowDropdown(false);
    setSearchTerm("");
      try {
    // Call API with title as keyword
    const res = await listingsApi.listingsSearchHistory({
      keyword: listing.title,
    });

    console.log("Search results for clicked product:", res);

  } catch (error) {
    console.error("Error fetching product search:", error);
  }
    router.push(`/marketplace/${listing.category?.slug}/${listing?.slug}`);
  };

  const handleCategoryClick = (card) => {
    setSelectedStaticCategory(card.type); 
    console.log("card", card);

    if (card.route) {
      router.push(card.route);
    }
  };

  return (
    <>
      <div
        className=" px-4 py-16 text-center text-white rounded-b-[80px]"
        style={{
          background: "#175f48", //Dark Green
          // background: '#29a048', //Light Green
          // background: "linear-gradient(to right, #129cbd, #087590)",
        }}
      >
        <div className="mx-auto max-w-4xl">
          <h1 className="mb-4 text-3xl font-bold md:text-4xl">
            {t("FIND EVERYTHING YOU NEED IN ONE PLACE")}
          </h1>
          <p className=" text-sm mb-4 opacity-90">
            {t(
              "Ma3rood — The Kingdom’s marketplace for everything from household items and cars to homes, jobs, and services."
            )}
          </p>

          <div className="relative mx-auto flex max-w-3xl gap-2 mb-14 px-4">
            {/* Input field - grows more */}
            <input
              type="text"
              placeholder={t("What are you looking for?")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={handleFocus}
              className="h-12 w-full md:flex-1 rounded-md border border-gray-300 bg-white px-4 text-gray-900 placeholder:text-gray-500 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500"
            />

            {/* Button: icon only on mobile, icon + text on desktop */}
            <div className="flex justify-center">
              {/* <button
                // className="h-12 rounded-md bg-white text-black flex items-center justify-center w-12 md:w-auto px-0 md:px-6"
                className={`h-12 rounded-md flex items-center justify-center w-12 md:w-auto px-0 md:px-6
                  ${
                    loading
                      ? "bg-gray-100 text-gray-700 cursor-not-allowed"
                      : "bg-white text-black hover:bg-gray-100"
                  }`}
                disabled={loading}
              >
                {loading ? (
                  <span className="hidden md:inline ml-2">
                    {t("Searching")}...
                  </span>
                ) : (
                  <>
                    <FaSearch className="h-5 w-5" />
                    <span className="hidden md:inline ml-2">{t("Search")}</span>
                  </>
                )}
              </button> */}
              <button
                className={`h-12 rounded-md flex items-center justify-center w-12 md:w-auto px-0 md:px-6
    ${
      loading
        ? "bg-gray-100 text-gray-700 cursor-not-allowed"
        : "bg-white text-black hover:bg-gray-100"
    }
  `}
                disabled={loading}
              >
                {loading ? (
                  <span className="hidden md:inline ml-2">
                    {t("Searching")}...
                  </span>
                ) : (
                  <>
                    {/* yahan check kar raha hun ke agar current language Arabic hai toh row reverse */}
                    <span
                      className={`hidden md:inline ${
                        i18n.language === "ar" ? "mr-2" : "ml-2"
                      }`}
                    >
                      {t("Search")}
                    </span>
                    <FaSearch className="h-5 w-5 md:h-4 md:w-4 md:ml-2" />
                  </>
                )}
              </button>
            </div>
            {/* Dropdown */}
            {/* {showDropdown && searchTerm.length > 0 && (
              <div
                ref={dropdownRef}
                className="absolute top-14 w-[82vw] md:w-full md:max-w-[37.5rem] bg-white border rounded-md shadow-lg z-50 max-h-64 overflow-y-auto"
              >
                {results.length > 0 ? (
                  results.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleSelectProduct(item)}
                      className="p-3 hover:bg-gray-100 cursor-pointer flex items-start gap-3 transition-all"
                    >
                      <img
                        src={
                          item.images?.[0]?.image_path
                            ? `${Image_URL}/${item.images[0].image_path}`
                            : "/placeholder.png"
                        }
                        alt={item.title}
                        className="min-w-12 h-12 object-cover rounded"
                      />
                      <div>
                        <p className="text-sm text-start text-black font-medium">
                          {item.title}
                        </p>
                        <p className="text-xs text-start text-black">
                          <span className="price">$</span>
                          {item.start_price}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-gray-500 text-center">
                    {"No results found"}
                  </div>
                )}
              </div>
            )} */}
            {showDropdown && (
  <div
    ref={dropdownRef}
    className={`absolute top-14 w-[82vw] md:w-full md:max-w-[37.5rem] bg-white border rounded-md shadow-lg z-50 max-h-64 overflow-y-auto ${( results.length === 0 && pastSearches.length === 0 ) ? 'hidden' : 'block'}`}  >
    {searchTerm.length > 2 ? (
      results.length > 0 ? (
        results.map((item) => (
          <div
            key={item.id}
            onClick={() => handleSelectProduct(item)}
            className="p-3 hover:bg-gray-100 cursor-pointer flex items-start gap-3 transition-all"
          >
            <img
  src={
    item?.images?.[0]?.image_path
      ? `${Image_URL}/${item.images[0].image_path}`
      : Image_NotFound
  }
  alt={item?.title || "No Image"}
  className="min-w-12 h-12 object-cover rounded"
  onError={(e) => {
    e.target.onerror = null; // Prevent infinite loop
    e.target.src = Image_NotFound; // Show fallback icon if image fails to load
  }}
/>

            <div>
              <p className="text-sm text-start text-black font-medium">
                {item.title}
              </p>
              <p className="text-xs text-start text-black">
                <span className="price">$</span>
                {Number(item.buy_now_price)}
              </p>
            </div>
          </div>
        ))
      ) : (
        <div className="p-4 text-gray-500 text-center">
          {"No results found"}
        </div>
      )
    ) : (
      // Show past searches if no term
      pastSearches.length > 0 ? (
        pastSearches.map((search, index) => (
          <div
            key={index}
            onClick={() => setSearchTerm(search)}
            className="p-3 hover:bg-gray-100 cursor-pointer text-black text-start text-sm"
          >
          {search}
          </div>
        ))
      ) : (
        <div className="p-4 text-gray-500 text-center">
          {/* {"No past searches"} */}
        </div>
        // <></>
      )
    )}
  </div>
)}

          </div>
        </div>
      </div>

      <div className="relative -mt-16 px-4 pb-16">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-12 md:grid-rows-2">
            {staticCategories.map((card, index) => (
              <div
                key={index}
                onClick={() => handleCategoryClick(card)}
                className={`group relative overflow-hidden ${card.colSpan} ${
                  card.rowSpan
                } ${card.rounded} ${
                  card.route
                    ? "cursor-pointer hover:scale-[1.02] hover:shadow-lg transition"
                    : ""
                }`}
              >
                {card.route ? (
                  // <Link href={card.route} className="block h-full">
                    <div className={`relative ${card.height} text-white hover:text-green-600 transition`}>
                      <Image
                        src={card.image}
                        alt={card.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 flex items-start justify-center bg-black/20">
                        <h2 className="text-3xl md:text-4xl font-bold pt-6 drop-shadow-lg tracking-tight">
                          {t(card.title)}
                        </h2>
                      </div>
                    </div>
                  // </Link>
                ) : (
                  <div className={`relative ${card.height}`}>
                    <Image
                      src={card.image}
                      alt={card.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-end bg-black/50">
                      <h2 className="text-2xl md:text-3xl font-bold text-white">
                        {t(card.title)}
                      </h2>
                      <p className="text-sm text-gray-200 italic pb-1">
                        (Coming Soon)
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default GridLayout;
