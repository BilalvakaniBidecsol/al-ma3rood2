"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Button from "@/components/WebsiteComponents/ReuseableComponenets/Button";
import { IoIosArrowForward } from "react-icons/io";
import StepTitleCategory from "@/components/WebsiteComponents/listingforms/StepTitleCategory";
import ItemDetail, {
  categoryFields,
} from "@/components/WebsiteComponents/listingforms/ItemDetail";
import UploadPhotos from "@/components/WebsiteComponents/listingforms/UploadPhotos";
import PriceAndPayment from "@/components/WebsiteComponents/listingforms/PriceAndPayment";
import { useCategoryStore } from "@/lib/stores/categoryStore";
import { listingsApi } from "@/lib/api/listings";
import { useRouter } from "next/navigation";
import SuccessToast from "@/components/WebsiteComponents/listingforms/SuccessToast";
import ListingForm from "@/components/WebsiteComponents/listingforms/ListingForm";
import MotorListingForm from "@/components/WebsiteComponents/listingforms/MotorListingForm";
import { toast } from "react-toastify";
import { Car, Package } from "lucide-react";

export function toFieldName(label) {
  return label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
}

function getCategorySchema(selectedCategoryName) {
  const key = (selectedCategoryName || "").toLowerCase();
  const fields = categoryFields[key] || [];
  const shape = {};
  for (const f of fields) {
    const fieldName = toFieldName(f.field);
    if (f.required) {
      shape[fieldName] = z.string().min(1, `${f.field} is required`);
    } else {
      shape[fieldName] = z.string().optional();
    }
  }
  return z.object(shape);
}

const today = new Date();
const maxDate = new Date();
maxDate.setDate(today.getDate() + 10);

const baseListingSchema = z.object({
  title: z.string().min(1, "Title is required"),
  subtitle: z.string().optional(),
  category_id: z.number({ invalid_type_error: "Category is required" }),
  description: z.string().min(1, "Description is required"),
  condition: z.enum(["new", "used"]),
  images: z.array(z.any()).min(1, "At least one image is required"),
  buy_now_price: z.string().optional(),
  allow_offers: z.boolean().optional(),
  start_price: z.string().optional(),
  reserve_price: z.string().optional(),
  expire_at: z.date().optional(),
  payment_method_id: z.string().optional(),
  quantity: z.number().optional(),
  parentCategoryName: z.string().optional(),
});

const listingSchema = baseListingSchema.superRefine((data, ctx) => {
  // Use parentCategoryName for extra fields
  const key = (data.parentCategoryName || "").toLowerCase();
  const fields = categoryFields[key] || [];
  for (const f of fields) {
    if (f.required) {
      const fieldName = toFieldName(f.field);
      if (!data[fieldName] || data[fieldName] === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: [fieldName],
          message: `${f.field} is required`,
        });
      }
    }
  }
  // Price & Payment conditional validation
  if (data.allow_offers) {
    if (!data.start_price || data.start_price === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["start_price"],
        message: "Start Price is required when offers are allowed",
      });
    }
    if (!data.reserve_price || data.reserve_price === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["reserve_price"],
        message: "Reserve Price is required when offers are allowed",
      });
    }
    if (!data.expire_at) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["expire_at"],
        message: "Offer Expiry Date & Time is required when offers are allowed",
      });
    } else {
      const now = new Date();
      const max = new Date();
      max.setDate(now.getDate() + 10);
      if (data.expire_at < now || data.expire_at > max) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["expire_at"],
          message: "Offer Expiry Date & Time must be within 10 days from today",
        });
      }
    }
  }
});

const steps = [
  { title: "Title & category", key: "title-category" },
  { title: "Item details", key: "item-details" },
  { title: "Photos", key: "photos" },
  { title: "Price & payment", key: "price-payment" },
  // { title: "Shipping & pick-up", key: "shipping & pick-up" },
  // { title: "Promote", key: "promote" },
];

const topCategories = [
  { name: "Ma3rood Motors", color: "text-green-600" },
  { name: "Ma3rood Property", color: "text-green-600" },
  { name: "Ma3rood Jobs", color: "text-orange-600", external: true },
];

const Page = () => {
  const [listingType, setListingType] = useState(null);
  const [showListingTypeSelection, setShowListingTypeSelection] =
    useState(true);
  const router = useRouter();
  const handleCreateListing = async (data) => {
    try {
      const newListing = await listingsApi.createListing(data);
      toast.success("Listing created successfully!");
      if (newListing && newListing.slug) {
        router.push(`/listing/viewlisting?slug=${newListing.slug}`);
      }
    } catch (err) {
      toast.error("Failed to create listing.");
    }
  };

  const handleListingTypeSelect = (type) => {
    setListingType(type);
    setShowListingTypeSelection(false);
  };

  const handleBackToListingType = () => {
    setListingType(null);
    setShowListingTypeSelection(true);
  };

  if (showListingTypeSelection) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Start a Listing
            </h1>
            <p className="text-xl text-gray-600">
              Choose what type of item you want to list
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* General Item Option */}
            <div
              className="bg-white rounded-xl shadow-lg p-8 border-2 border-transparent hover:border-blue-500 transition-all duration-300 cursor-pointer group"
              onClick={() => handleListingTypeSelect("general")}
            >
              <div className="text-center">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-200 transition-colors">
                  <Package className="w-10 h-10 text-blue-600" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  General Item
                </h3>
                <p className="text-gray-600 mb-6">
                  List items for the marketplace - electronics, clothing,
                  furniture, and more
                </p>
                <div className="text-sm text-gray-500">
                  Perfect for selling everyday items, collectibles, and general
                  merchandise
                </div>
              </div>
            </div>

            {/* Motor Option */}
            <div
              className="bg-white rounded-xl shadow-lg p-8 border-2 border-transparent hover:border-green-500 transition-all duration-300 cursor-pointer group"
              onClick={() => handleListingTypeSelect("motor")}
            >
              <div className="text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-green-200 transition-colors">
                  <Car className="w-10 h-10 text-green-600" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  Motor Vehicle
                </h3>
                <p className="text-gray-600 mb-6">
                  List cars, motorbikes, boats, caravans, and other motor
                  vehicles
                </p>
                <div className="text-sm text-gray-500">
                  Specialized forms for vehicle details, specifications, and
                  documentation
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-8">
            <p className="text-sm text-gray-500">
              You can always change your selection later
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Render the appropriate form based on selection
  if (listingType === "motor") {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="mb-6">
            <button
              onClick={handleBackToListingType}
              className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
            >
              <IoIosArrowForward className="w-4 h-4 rotate-180 mr-2" />
              Back to listing type selection
            </button>
          </div>
          <MotorListingForm />
        </div>
      </div>
    );
  }

  // Default to general listing form
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <button
            onClick={handleBackToListingType}
            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <IoIosArrowForward className="w-4 h-4 rotate-180 mr-2" />
            Back to listing type selection
          </button>
        </div>
        <ListingForm mode="create" onSubmit={handleCreateListing} />
      </div>
    </div>
  );
};

export default Page;
