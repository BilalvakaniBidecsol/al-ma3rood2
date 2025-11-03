"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import JobListCard from "./JobListCard";
import { listingsApi } from "@/lib/api/listings";
import { Image_URL } from "@/config/constants";
import Breadcrumbs from "@/components/WebsiteComponents/ReuseableComponenets/Breadcrumbs";
import { useTranslation } from "react-i18next";
import WithdrawDialog from "@/components/WebsiteComponents/ReuseableComponenets/WithdrawDialog";
import { JobsApi } from "@/lib/api/job-listing";

const filters = [
  { label: "Last 45 days", value: "45d" },
  { label: "Last 7 days", value: "7d" },
  { label: "Last 24 hours", value: "24h" },
  { label: "Last 1 hours", value: "1h" },
];

export default function JobsListClient() {
  // const [filter, setFilter] = useState("all");
  const router = useRouter();
  const commonActions = (id) => [
    { label: "Promote listing", href: `/promote/${id}` },
    { label: "Edit listing", href: `/listing/viewlisting/${id}` },
    { label: "See similar", onClick: () => alert("Selling similar...") },
  ];

  const [filter, setFilter] = useState("45d");
  const [allListings, setAllListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openWithdrawDialog, setOpenWithdrawDialog] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState(null);

  useEffect(() => {
    fetchListings();
  }, []);


  const fetchListings = async () => {
    try {
      setLoading(true);
      const response = await JobsApi.getUserListings({});
      const listData = response || [];
      setAllListings(listData);
      console.log("User Listings:", listData);
    } catch (error) {
      console.error("Failed to fetch listings:", error);
    } finally {
      setLoading(false);
    }
  };

  async function handleWithdraw(listing) {
    try {
      await listingsApi.withdrawListing(listing.slug);
      setOpenWithdrawDialog(false);
    } catch (error) {
      console.log("error", error);
    }
  }

  const items = [
    { label: "Home", href: "/" },
    { label: "Account", href: "/account" },
    { label: "Job Listings" },
  ];
  const { t } = useTranslation();

  return (
    <div className="min-h-screen  text-gray-800">
      <Breadcrumbs
        items={items}
        styles={{
          nav: "flex justify-start text-sm font-medium bg-white border-b border-gray-200 py-2",
        }}
      />

      <h1 className="text-2xl font-bold text-green-600 uppercase mb-1 mt-5">
 {t("Jobs List")}      </h1>
      <p className="text-sm mb-4 mt-3">{allListings.length}{" "}{t("listings")}</p>

      {/* Listings */}
      {/* {loading ? (
        <p className="text-sm text-gray-500">{t("loadingListings...")}</p>
      ) : allListings.length === 0 ? (
        <p className="text-sm text-gray-500">{t("No listings found.")}</p>
      ) : (
        allListings.map((listing) => (
          <JobListCard
            key={listing.id}
            listing={{
              id: listing.id,
              title: listing.title,
              price: listing.minimum_pay_amount || "N/A",
              views: listing.view_count || 0,
              watchers: 0,
              offers: listing.selling_offers || [],
              slug: listing.slug,
              closingDate: listing.expire_at || "",
    image: cleanedPath
    ? `${Image_URL}${cleanedPath}`
    : "/default-image.jpg",
              link: `/marketplace/${listing.category?.slug?.split("/").pop() || "unknown"}/${
                listing.slug
              }`,
            }}
            actions={[
              // { label: "Promote listing", href: `/promote/${listing?.id}` },
              { label:  t("Edit listing"), href: `/listing/viewJob?slug=${listing?.slug}` },
              
            ]}
          />
        ))
      )} */}
      {loading ? (
    <p className="text-sm text-gray-500">{t("loadingListings...")}</p>
) : allListings.length === 0 ? (
    <p className="text-sm text-gray-500">{t("No listings found.")}</p>
) : (
    allListings.map((listing) => {
        // 1. Get the raw file path from the first media_files item (if it exists)
        const rawPath = listing.media_files?.[0]?.file_path;

        // 2. Clean the path by replacing double backslashes with forward slashes
        const cleanedPath = rawPath ? rawPath.replace(/\\/g, '/') : null;
        
        // 3. Determine the final image URL
        const finalImageUrl = cleanedPath
            ? `${Image_URL}${cleanedPath}` // Use Image_URL base path
            : "/default-image.jpg";        // Use default image

        return (
            <JobListCard
                key={listing.id}
                listing={{
                    id: listing.id,
                    title: listing.title,
                    price: listing.minimum_pay_amount || "N/A",
                    views: listing.view_count || 0,
                    watchers: 0,
                    offers: listing.selling_offers || [],
                    slug: listing.slug,
                    closingDate: listing.created_at || "",
                    // ⭐ UPDATED IMAGE PROP
                    image: finalImageUrl,
                    // ⭐ END UPDATED IMAGE PROP
                    link: `/marketplace/${listing.category?.slug?.split("/").pop() || "unknown"}/${
                        listing.slug
                    }`,
                }}
                actions={[
                    // { label: "Promote listing", href: `/promote/${listing?.id}` },
                    { label: t("Edit listing"), href: `/listing/viewJob?slug=${listing?.slug}` },
                ]}
            />
        );
    })
)}

      <WithdrawDialog
        isOpen={openWithdrawDialog}
        onClose={() => setOpenWithdrawDialog(false)}
        onWithdraw={() => handleWithdraw(selectedListing)}
      />
    </div>
  );
}
