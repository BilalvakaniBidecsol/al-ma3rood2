"use client";
import { Image_NotFound, Image_URL } from "@/config/constants";
import { useCategoryStore } from "@/lib/stores/categoryStore";
import { useTranslation } from "react-i18next";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";  // 👈 useEffect import karna na bhoolna

function MarketplaceCategories({ heading, categories, isLoading, error }) {
  const { setSelectedCategory, selectedCategory } = useCategoryStore();
  const { t } = useTranslation();
  const router = useRouter();
  useEffect(() => {
    console.log("Categories data 👉", categories);
  }, [categories]);

  if (isLoading) return <div className="p-4 text-center">Loading...</div>;
  if (error) {
    return (
      <div className="p-4 text-red-500">Error loading categories: {error}</div>
    );
  }

  // const handleClick = async (category) => {
  //   setSelectedCategory(category);
  //   router.push(`/marketplace/${category.slug}?categoryId=${category.id}`);
  // };
  const handleClick = async (category) => {
    console.log("category", category);
    setSelectedCategory(category)
    // Extract last part of slug
    const slugParts = category.slug.split("/");
    const lastSlug = slugParts[slugParts.length - 1];

    console.log("lastSlug", lastSlug);

    // Example usage with router
    router.push(`/marketplace/${lastSlug}?categoryId=${category.id}`);
  };
  return (
    <section className="p-1  rounded-lg">
      {/* <div className="bg-white rounded-md py-2 flex justify-between">
        <h3 className="text-lg font-semibold px-5">Marketplace</h3>
        <p className="text-md px-5">ab</p>
      </div> */}
      <div className="bg-white rounded-md shadow-sm p-2 mb-4">
        {/* Heading */}
        <h2 className="text-lg font-semibold text-gray-800 mb-1">
          {t(
            decodeURIComponent(heading)
              .split(" ")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ")
          )}
        </h2>

        {/* Description */}
        {/* <p className="text-sm text-gray-600 mb-2">
  {categories?.data?.[0]?.description
    ? categories.data[0].description
    : t("Here you can explore the listings and find exactly what you need.")}
</p> */}
        <p className="text-sm text-gray-600 mb-2">
          {selectedCategory?.description}
        </p>
        {/* Optional navigation buttons (agar chahiye to uncomment karna) */}
        {/* 
  <div className="flex justify-end space-x-2 mt-2">
    <button className="p-2 rounded hover:bg-gray-100">
      <ChevronLeft size={18} />
    </button>
    <button className="p-2 rounded hover:bg-gray-100">
      <ChevronRight size={18} />
    </button>
  </div> 
  */}
      </div>

      <div className="mt-6">
        {/* ✅ Mobile-only: 2-row horizontal scroll */}
        <div className="block sm:hidden overflow-x-auto scrollbar-hide">
          <div className="flex flex-wrap w-[480px] gap-4">
            {categories?.data?.map((cat, index) => (
              <div
                key={index}
                onClick={() => handleClick(cat)}
                className="w-[22%] flex flex-col items-center justify-center p-1 md:p-3 bg-white rounded-lg hover:shadow cursor-pointer transition"
              >
                {/* <img
            src={
              cat.image_path
                ? `${Image_URL}${cat.image_path}`
                : Image_NotFound
            }
            alt={cat.name}
            className="w-10 h-10 mb-2"
          /> */}
                {cat.parent_id == null && (
                  <img
                    src={`${Image_URL}${cat.image_path || cat.icon}`}
                    alt={cat.name}
                    className="w-10 h-10 mb-2 object-cover"
                  />
                )
                //  : (
                  // <div className="w-10 h-10 mb-2 flex items-center justify-center rounded-md bg-gray-200 text-sm font-semibold text-gray-600">
                  //   {cat.name?.charAt(0).toUpperCase()}
                  // </div>
                // )
              }
                <p className="text-xs text-center font-medium">{cat.name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ✅ Web-only: original layout untouched */}
        <div className={`hidden  ${categories?.data[0]?.parent_id ==null ? " sm:grid grid-cols-6 lg:grid-cols-8 gap-4" : "sm:flex flex-wrap items-center justify-center"}`}>
  {categories?.data?.map((cat, index) => (
    <React.Fragment key={index}>
      <div
        onClick={() => handleClick(cat)}
        className={`flex flex-col items-center justify-center m-0.5 md:m-1 p-1 md:p-3 bg-white rounded-lg ${categories?.data[0]?.parent_id ==null ? "" : "hover:bg-white md:hover:bg-[#12513E] hover:text-black md:hover:text-white" } shadow cursor-pointer transition`}
      >
        {cat.parent_id == null && (
          <img
            src={`${Image_URL}${cat.icon}`}
            alt={cat.name}
            className="w-10 h-10 mb-2"
          />
        )}
        <p
          className={`text-xs text-center ${
            cat.parent_id ? "font-bold" : "font-medium"
          }`}
        >
          {cat.name}
        </p>
      </div>

      {/* Separator except last */}
      {/* {(index !== categories?.data?.length -1  && cat.parent_id !== null) && (
        <div className="w-px h-10 bg-[#1b7050] mx-6 my-1"></div>
      )} */}
    </React.Fragment>
  ))}
</div>

      </div>
    </section>
  );
}

export default MarketplaceCategories;