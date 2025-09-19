// src/app/(profile)/account/notification/NotificationClientPage.js

"use client";
import React, { useEffect, useState } from "react";
import { FaBell } from "react-icons/fa";
import Image from "next/image";
import Button from "@/components/WebsiteComponents/ReuseableComponenets/Button";
import { userApi } from "@/lib/api/user";
import { toast } from "react-toastify";
import { Image_NotFound, Image_URL } from "@/config/constants";
import Breadcrumbs from "@/components/WebsiteComponents/ReuseableComponenets/Breadcrumbs";
import { useTranslation } from "react-i18next";

const NotificationClientPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      setLoading(true);
      const response = await userApi.userNotification();
      setNotifications(response.data || []);
    } catch (error) {
      console.error("Failed to fetch listings:", error);
    } finally {
      setLoading(false);
    }
  };

  const items = [
    { label: "Home", href: "/" },
    { label: "Account", href: "/account" },
    { label: "Notification" },
  ];

  const handleRemove = async (id) => {
    try {
      await userApi.userReadNotification(id);
      toast.success(t("Notification marked as read!"));
      setNotifications((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      toast.error(t("Failed to mark notification as read."));
    }
  };
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const markAllAsRead = async () => {
    try {
      const ids = notifications.map((n) => n.id);
      await Promise.all(ids.map((id) => userApi.userReadNotification(id)));
      toast.success(t("Notification marked as read!"));
      setNotifications([]);
    } catch (error) {
      toast.error(t("Failed to mark notification as read."));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen px-4 py-6 text-gray-800">
        <p>{t("Loading Notifications")}</p>
      </div>
    );
  }
  return (
    <>
      <Breadcrumbs
        items={items.map((item) => ({ ...item, label: t(item.label) }))}
        styles={{
          nav: "flex justify-start text-sm font-medium bg-white border-b border-gray-200 py-2",
        }}
      />

      <div className="min-h-screen px-4 py-6 text-gray-800">
        <div className="flex items-center justify-between mb-1 flex-wrap gap-2">
          <h2 className="text-2xl font-bold text-green-700">
            {t("NOTIFICATIONS")}
          </h2>
          <button
            onClick={markAllAsRead}
            className="text-sm text-green-600 hover:underline"
          >
            {t("Mark all as read")}
          </button>
        </div>

        <p className="mb-6">
          {t("You have")} {notifications.length} {t("new notification(s).")}
        </p>

        {notifications.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-md shadow p-4 relative w-full max-w-xl mb-6"
          >
            {/* <button
              onClick={() => handleRemove(item.id)}
              className="absolute top-2 right-2 text-[#469BDB] hover:text-[#469BDB]"
              title={t("Mark as read")}
            >
              <FaBell />
            </button> */}
            <button
              onClick={() => handleRemove(item.id)}
              className={`absolute top-2 ${
                isRTL ? "left-2" : "right-2"
              } text-green-600`}
              title={t("Mark as read")}
            >
              <FaBell />
            </button>

            <p className="text-sm font-semibold text-gray-600 mb-2">
              {item.status}
            </p>

            <div className="flex flex-col sm:flex-row items-start gap-4">
              <Image
                src={
                  item.listing?.images[0]?.image_path
                    ? `${Image_URL}/${item.listing.images[0].image_path}`
                    : Image_NotFound
                }
                alt={item.data?.title}
                width={100}
                height={100}
                className="object-cover rounded"
              />

              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-md text-black mb-1">
                    {item.data?.title}
                  </h3>
                  <p className="text-sm text-gray-700 mb-4">
                    {item.data?.message}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default NotificationClientPage;
