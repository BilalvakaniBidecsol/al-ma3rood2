"use client";

import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation, Autoplay } from "swiper/modules";
import ShareListingModal from "./modals/share-listing-modal";
import { Image_URL } from "@/config/constants";
import { MapPin, Mail, Phone, Eye } from "lucide-react";
import { CiUser } from "react-icons/ci";

export default function JobDescriptionAndSidebar({ product }) {
  const [showShareModal, setShowShareModal] = useState(false);

  const {
    id,
    title,
    company_name,
    description,
    key_points = [],
    view_count,
    contact_name,
    contact_email,
    contact_phone,
    region,
    governorate,
    media_files = [],
  } = product || {};

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 text-gray-800">
      {/* Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* LEFT: Description */}
        <div className="md:col-span-2">
          <h2 className="text-2xl font-semibold mb-3">{title}</h2>
          <p className="text-gray-600 leading-relaxed mb-5">{description}</p>

          {key_points?.length > 0 && (
            <ul className="space-y-3">
              {key_points.map((point, index) => (
                <li key={index} className="flex items-start">
                  <span className="w-2 h-2 mt-2 mr-3 bg-[#175f48] rounded-full"></span>
                  <span className="text-gray-700">{point}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* RIGHT: Sidebar */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
          {/* Image Carousel */}
          <div className="relative rounded-t-2xl overflow-hidden">
            {media_files?.length > 0 ? (
              <Swiper
                modules={[Navigation, Autoplay]}
                navigation
                autoplay={{ delay: 3500 }}
                loop
                className="w-full h-56"
              >
                {media_files.map((file, index) => (
                  <SwiperSlide key={index}>
                    <img
                      src={`${Image_URL}${file.file_path}`}
                      alt={`Job Image ${index + 1}`}
                      className="w-full h-auto "
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : (
              <div className="h-56 bg-gray-100 flex items-center justify-center">
                <p className="text-gray-400 text-sm">No Images Available</p>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-5 space-y-4">
            {/* Company Info */}
            {company_name && (
              <div className="text-center border-b border-gray-100 pb-3">
                <h3 className="text-lg font-semibold text-[#175f48]">
                  {company_name}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Listing #{id} • <Eye className="inline w-4 h-4" />{" "}
                  {view_count || 0} views
                </p>
              </div>
            )}

            {/* Contact Info */}
            <div className="space-y-2 text-sm text-gray-700">
              {governorate?.name && region?.name && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#175f48]" />
                  <span>
                    {governorate.name}, {region.name}
                  </span>
                </div>
              )}
              {contact_name && (
                <div className="flex items-center gap-2">
                    <CiUser className="text-[#175f48] w-5 h-5" /> <span>{contact_name}</span>
                </div>
              )}
              {contact_email && (
                <div className="flex items-center gap-2 break-all">
                  <Mail className="w-4 h-4 text-[#175f48]" />
                  <span>{contact_email}</span>
                </div>
              )}
              {contact_phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#175f48]" />
                  <span>{contact_phone}</span>
                </div>
              )}
            </div>

            {/* Share Button */}
            <button
              onClick={() => setShowShareModal(true)}
              className="w-full bg-[#175f48] hover:bg-[#0f3c2e] text-white text-sm font-medium rounded-xl py-2 mt-4 transition-colors"
            >
              Share this Listing
            </button>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      <ShareListingModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
      />
    </div>
  );
}
