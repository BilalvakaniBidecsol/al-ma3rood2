"use client";
import React, { useEffect, useState } from "react";
import Sidebar from "@/components/WebsiteComponents/ReuseableComponenets/Sidebar";
import { FaThList } from "react-icons/fa";
import { useWatchlistStore } from "@/lib/stores/watchlistStore";
import {
  filterCategories,
  Image_NotFound,
  Image_URL,
} from "@/config/constants";
import { useTranslation } from "react-i18next";


const Page = () => {
    const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showListingDropdown, setShowListingDropdown] = useState(false);

  const { watchlist, fetchWatchlist } = useWatchlistStore();

  useEffect(() => {
    fetchWatchlist();
  }, []);
 useEffect(() => {
    console.log("Watchlist from store:", watchlist);
  }, [watchlist]);

  const filteredWatchlist = watchlist.filter((item) =>
    item?.listing?.title?.toLowerCase().includes(search.toLowerCase())
  );
 useEffect(() => {
    console.log("Filtered Watchlist:", filteredWatchlist);
  }, [filteredWatchlist]);
  return (
    <div className="flex items-start md:p-10 text-black">
      <Sidebar />

      <main className="flex-1 p-5">
        <div className="max-w-5xl mx-auto p-4">
          <h2 className="text-2xl font-bold text-green-700">
            {t("Watchlist Listings")}
          </h2>

          <input
            type="text"
            placeholder={t("Search listings...")}
            className="border px-4 py-2 rounded-md mb-4 w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {filteredWatchlist.map((item) => {
            const listing = item?.listing;
            const imageUrl = listing?.images?.[0]?.image_path
              ? `${Image_URL}${listing.images[0].image_path}`
              : Image_NotFound;

            return (
              <div
                key={item.id}
                className="flex flex-col md:flex-row gap-4 items-start border rounded-md p-4 shadow-sm hover:shadow-md transition w-full mb-4"
              >
                <img
                  src={imageUrl}
                  alt={listing?.title || "Watchlist item"}
                  className="w-full md:w-48 h-48 object-cover rounded-md"
                />

                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-1">
                    {listing?.title}
                  </h3>
                  {listing?.subtitle && (
                    <p className="text-sm text-gray-600 mb-2">
                      {listing.subtitle}
                    </p>
                  )}
                  <p className="text-sm text-gray-800">
                    <strong>{t("Starting Price")}:</strong>{listing?.start_price} <span className="price">$</span>
                  </p>
                  <p className="text-sm text-gray-800">
                    <strong>{t("Condition")}:</strong> {listing?.condition}
                  </p>
                  {listing?.subtitle && (
                    <p className="text-sm text-gray-600 mt-2 line-clamp-3">
                      {listing.subtitle}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default Page;
