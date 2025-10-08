"use client";
import React, { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { listingsApi } from "@/lib/api/listings";
import ListingForm from "@/components/WebsiteComponents/listingforms/ListingForm";
import { toast } from "react-toastify";
import MotorListingForm from "@/components/WebsiteComponents/listingforms/MotorListingForm";
import Properties from "@/components/WebsiteComponents/listingforms/Properties";


const EditListingPage = ({ params: paramsPromise }) => {
  const params = use(paramsPromise);
  const { slug } = params;
  const [listing, setListing] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (slug) {
      listingsApi.getListingBySlug(slug).then((res) => {
        setListing(res.listing);
      });
    }
  }, [slug]);

  if (!listing) return <div>Loading...</div>;

  const handleUpdate = async (data) => {
    try {
      const updatedListing = await listingsApi.updateListing(slug, data);
      if (updatedListing && updatedListing.slug) {
        toast.success("Listing updated successfully!");
        router.push(`/listing/viewlisting?slug=${updatedListing.slug}`);
      }
    } catch (err) {
      toast.error("Failed to update listing.");
    }
  };

  return (
      <div className="p-6">
      {listing?.listing_type === "marketplace" ? (
        <ListingForm
          initialValues={listing}
          mode="edit"
          onSubmit={handleUpdate}
        />
      ) :  listing?.listing_type === "motors" ?  (
        <MotorListingForm
          initialValues={listing}
          mode="edit"
          onSubmit={handleUpdate}
        />
      ) : 
       (
        <Properties
          initialValues={listing}
          mode="edit"
          onSubmit={handleUpdate}
        />
      )}
    </div>
  );
};

export default EditListingPage; 