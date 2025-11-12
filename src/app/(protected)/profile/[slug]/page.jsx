"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { userApi } from "@/lib/api/user";
import { Image_URL } from "@/config/constants";
import {
  Mail,
  MapPin,
  User,
  ShieldCheck,
  Calendar,
  BadgeDollarSign,
} from "lucide-react";
import Reviews from "@/components/WebsiteComponents/UserProfile/Reviews";

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await userApi.getProfile();
      setProfile(response.data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p className="text-center py-10 text-gray-500">Loading profile...</p>;
  }

  if (!profile) {
    return <p className="text-center py-10 text-gray-500">No profile found.</p>;
  }

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center py-6 sm:py-10 px-3 sm:px-6 md:px-10">
      <div className="w-full rounded-xl overflow-hidden bg-white">
        {/* Cover Image */}
        <div className="relative h-40 sm:h-48 md:h-56 w-full">
          <Image
            src={
              profile.background_photo
                ? `${Image_URL}${profile.background_photo}`
                : "/images/default-cover.jpg"
            }
            alt="Cover"
            fill
            className="object-cover"
          />
          {/* Profile Image */}
          <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 sm:translate-x-0 sm:left-8">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-white overflow-hidden shadow-md">
              <Image
                src={
                  profile.profile_photo
                    ? `${Image_URL}${profile.profile_photo}`
                    : "/images/default-avatar.jpg"
                }
                alt="Profile"
                width={112}
                height={112}
                className="object-cover"
              />
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="pt-16 sm:pt-20 pb-8 px-4 sm:px-6 text-center sm:text-left">
          <h2 className="text-xl sm:text-2xl font-bold">{profile.username}</h2>

          <div className="mt-5 space-y-5 text-sm sm:text-base">
            {/* Row 1 */}
            <div className="flex flex-col sm:flex-wrap sm:flex-row sm:items-center gap-3 sm:gap-2 justify-center sm:justify-start">
              <div className="flex items-center gap-2">
                <BadgeDollarSign size={18} className="text-green-600" />
                <span className="font-semibold text-gray-700">Name:</span>
                <span className="bg-gray-100 px-2 py-1 rounded-md">
                  {profile.name}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <User size={18} className="text-green-600" />
                <span className="font-semibold text-gray-700">
                  Member Number:
                </span>
                <span className="bg-gray-100 px-2 py-1 rounded-md">
                  {profile.memberId}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <ShieldCheck size={18} className="text-green-600" />
                <span className="font-semibold text-gray-700">
                  Authenticated:
                </span>
                <span className="bg-gray-100 px-2 py-1 rounded-md">
                  {profile.is_verified ? "Yes" : "No"}
                </span>
              </div>
            </div>

            {/* Row 2 */}
            <div className="flex flex-col sm:flex-wrap sm:flex-row sm:items-center gap-3 sm:gap-2 justify-center sm:justify-start">
              <div className="flex items-center gap-2">
                <Mail size={18} className="text-green-600" />
                <span className="font-semibold text-gray-700">Email:</span>
                <span className="bg-gray-100 px-2 py-1 rounded-md break-all">
                  {profile.email}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <MapPin size={18} className="text-green-600" />
                <span className="font-semibold text-gray-700">Location:</span>
                <span className="bg-gray-100 px-2 py-1 rounded-md">
                  {profile.governorate_name
                    ? `${profile.governorate_name}, ${profile.region_name}`
                    : "N/A"}
                </span>
              </div>
            </div>

            {/* Row 3 */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-2 justify-center sm:justify-start">
              <div className="flex items-center gap-2">
                <Calendar size={18} className="text-green-600" />
                <span className="font-semibold text-gray-700">
                  Member Since:
                </span>
                <span className="bg-gray-100 px-2 py-1 rounded-md">
                  {new Date(profile.created_at).toLocaleString("en-US", {
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-10">
        <Reviews />
      </div>
    </div>
  );
}
