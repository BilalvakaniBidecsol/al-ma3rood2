"use client";
import { useState } from "react";
import FilterComponent from "../FilterComponent";
import MarketplaceCard from "../MarketplaceCard";
import MarketplaceCategories from "../MarketplaceCategories";
import { IoIosArrowDown } from "react-icons/io";
import { FaThList, FaTh } from "react-icons/fa";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslation } from 'react-i18next';
import { IoClose } from "react-icons/io5";
import Market from "../Market";


export default function CategoryClient({
  slug,
  category,
  initialProducts,
  categoryId,
  pagination,
}) {
  const { t } = useTranslation();
  const [filteredProducts, setFilteredProducts] = useState(null);
  const [sortOption, setSortOption] = useState("featured");
  const [layout, setLayout] = useState("grid"); // 'grid' or 'list'
  const router = useRouter();
  const searchParams = useSearchParams();
  const search = searchParams.get("search");

  // Handler to reset filters and show initial SSR products
  const handleClearFilters = () => setFilteredProducts(null);

  // Sorting logic
  function sortProducts(products, option) {
    if (!products) return [];
    if (option === "low-to-high") {
      return [...products].sort(
        (a, b) => (a.buy_now_price || 0) - (b.buy_now_price || 0)
      );
    }
    if (option === "high-to-low") {
      return [...products].sort(
        (b, a) => (a.buy_now_price || 0) - (b.buy_now_price || 0)
      );
    }
    // Default: featured (no sorting or by some featured flag if available)
    return products;
  }

  // Use SSR data for pagination, not filteredProducts
  const productsToShow = sortProducts(
    filteredProducts || initialProducts,
    sortOption
  );

  // Pagination handler: update URL, triggers SSR reload
  const handlePageChange = (page) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page);
    router.push(`?${params.toString()}`);
  };

  return (
     <div className="flex flex-col gap-6 mt-6">
    {/* 🔹 Filter ko upar full width mai rakha */}
  

    {/* 🔹 Neeche categories aur products */}
    <div className="w-full">
      <MarketplaceCategories
        heading={slug.charAt(0).toUpperCase() + slug.slice(1)}
        categories={category ? category : {}}
        isLoading={false}
        error={null}
      />
        <div className="w-full">
      <FilterComponent
        categoryId={categoryId}
        onResults={(data) => setFilteredProducts(data)}
        onClear={handleClearFilters}
      />
    </div>

      <div className="flex flex-col gap-4 mt-4 mb-4 bg-white p-3 rounded shadow-sm md:flex-row md:justify-between md:items-center">
        {/* Showing Results */}
        <div className="text-center md:text-left">
          <span className="flex justify-center text-base md:text-lg text-gray-800 block">
            {t("Showing")} {productsToShow.length} {t("results")}
            {search && (
              <>
                {" "}{t("for")}{" "} <span className="ml-1">"{search}"</span>
                <button
                  onClick={() => {
                    const params = new URLSearchParams(searchParams.toString());
                    params.delete("search");
                    router.replace(`${window.location.pathname}?${params.toString()}`);
                  }}
                  className="ml-1 text-gray-700 underline text-lg"
                >
                  <IoClose />
                </button>
              </>
            )}
          </span>
        </div>

        {/* Sorting + Layout */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between w-full md:w-auto">
          <div className="relative w-full sm:w-auto">
            <select
              className="appearance-none bg-gray-100 w-full sm:w-auto rounded-md p-2 pr-8 text-sm border border-gray-300"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="featured">{t("Sort Featured First")}</option>
              <option value="low-to-high">{t("Price: Low to High")}</option>
              <option value="high-to-low">{t("Price: High to Low")}</option>
            </select>
            <IoIosArrowDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" />
          </div>

          <div className="flex justify-center gap-2">
            <button
              className={`flex items-center gap-1 px-3 py-2 rounded-md text-sm ${layout === "list"
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              onClick={() => setLayout("list")}
              aria-pressed={layout === "list"}
            >
              <FaThList />
              <span>{t("List")}</span>
            </button>
            <button
              className={`flex items-center gap-1 px-3 py-2 rounded-md text-sm ${layout === "grid"
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              onClick={() => setLayout("grid")}
              aria-pressed={layout === "grid"}
            >
              <FaTh />
              <span>{t("Grid")}</span>
            </button>
          </div>
        </div>
      </div>
      <div className="p-10">
      <Market
        heading={slug}
        cards={productsToShow}
        layout={layout}
        pagination={pagination}
        onPageChange={handlePageChange}
      />
      </div>
    </div>
  </div>

  );
}
