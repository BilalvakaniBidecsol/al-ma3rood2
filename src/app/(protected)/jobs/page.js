import React from "react";
import JobsClient from "./JobsClient";
import { fetchAllJobCategories } from "@/lib/api/category.server";
import {
  fetchAllListingsByFilter,
} from "@/lib/api/listings.server";

export const metadata = {
  title: "Latest Jobs & Career Opportunities in Saudi Arabia | Ma3rood Jobs",
  description:
    "Explore thousands of the latest job vacancies in Saudi Arabia. Find full-time, part-time, and remote career opportunities across major industries with Ma3rood.",
};

export default async function page () {
    const [catResult, 
      // listings
    ] = await Promise.all([
    fetchAllJobCategories(),
    // fetchAllListingsByFilter({
    //   listing_type: "property",
    //  pagination: {
    //   page: 1,
    //   }
    // }),
  ]);
  // const pagination = {
  //   currentPage: listings?.pagination?.current_page || 1,
  //   totalPages: listings?.pagination?.last_page || 5,
  //   perPage: listings?.pagination?.per_page || 10,
  //   totalItems: listings?.pagination?.total || 1000,
  // };

  const { categories, isLoading, error } = catResult;

  return (
    <div className="bg-white min-h-screen">
      
      <JobsClient 
      category={catResult}
            // initialProducts={listings?.data || []}
            // pagination={pagination}
      />
    </div>
  );
};
