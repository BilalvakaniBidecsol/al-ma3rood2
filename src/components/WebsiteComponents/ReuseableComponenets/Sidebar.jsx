"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { GoSidebarExpand } from "react-icons/go";

import {
  FaTimes,
  FaBell,
  FaEye,
  FaStar,
  FaShoppingCart,
  FaTags,
  FaUserCog,
  FaQuestionCircle,
  FaPlusCircle,
  FaClipboardList,
  FaCheckCircle,
  FaTimesCircle,
  FaChartBar,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import { useTranslation } from "react-i18next";

const Sidebar = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [showSellingOptions, setShowSellingOptions] = useState(false);
  const [showBuyingOptions, setShowBuyingOptions] = useState(false);
  const pathname = usePathname();

  const isActive = (href) => pathname.startsWith(href);
  const mainLinkClass = (href) =>
    `flex items-center gap-2 cursor-pointer ${
      isActive(href) ? "text-black font-semibold" : "text-green-500"
    }`;
  const subLinkClass = (href) =>
    `flex items-center gap-2 ${
      isActive(href) ? "text-black" : "text-green-500"
    }`;
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  return (
    <>
      {/* Fixed Sidebar Toggle Icon (Mobile Only) */}
      {/* Fixed Sidebar Toggle Icon (Mobile Only) */}
      {!showSidebar && (
        <button
          className={`md:hidden text-green-500 bg-white fixed top-4 ${
            isArabic ? "right-4" : "left-4"
          } z-[999]`}
          onClick={() => setShowSidebar(true)}
        >
          <GoSidebarExpand size={24} />
        </button>
      )}

      {/* Sidebar Panel */}
      <div
        className={`fixed top-0 ${
          isArabic ? "right-0" : "left-0"
        } h-full w-64 bg-[#FAFAFA] p-4 z-40 transition-transform duration-300 transform
    ${
      showSidebar
        ? "translate-x-0"
        : isArabic
        ? "translate-x-full"
        : "-translate-x-full"
    } 
    md:relative md:translate-x-0 md:w-60 md:mt-5 md:rounded-2xl`}
      >
        {/* Close (Mobile Only) */}
        <div className="flex justify-between items-center mb-4 md:hidden">
          <div className="font-bold text-lg">Ma3rood</div>
          <button onClick={() => setShowSidebar(false)}>
            <FaTimes />
          </button>
        </div>

        {/* <div className="font-semibold mb-6 hidden md:block">Ma3rood</div> */}

        {/* Navigation Links */}
        <nav className="space-y-4 text-sm text-gray-700">
          <div>
            <div className="font-bold text-black">{t("Account details")}</div>
          </div>

          <Link href="/notification" className={mainLinkClass("/notification")}>
            <FaBell />
            <span>{t("Notifications")}</span>
          </Link>

          <Link href="/watchlist" className={mainLinkClass("/watchlist")}>
            <FaEye />
            <span>{t("Watchlist")}</span>
          </Link>

          <Link href="/favourite" className={mainLinkClass("/favourites")}>
            <FaStar />
            <span>{t("Favourites")}</span>
          </Link>

          {/* Buying Dropdown */}
          <div>
            <div
              onClick={() => setShowBuyingOptions(!showBuyingOptions)}
              className="flex items-center justify-between cursor-pointer text-green-500"
            >
              <div className="flex items-center gap-2">
                <FaShoppingCart />
                <span>{t("Buying")}</span>
              </div>
              {showBuyingOptions ? <FaChevronUp /> : <FaChevronDown />}
            </div>

            {showBuyingOptions && (
              <div className="ml-6 mt-2 space-y-2">
                <Link
                  href="/account/listoffer"
                  className={subLinkClass("/account/listoffer")}
                >
                  <FaClipboardList />
                  <span>{t("List Offer")}</span>
                </Link>
                <Link
                  href="/account/won"
                  className={subLinkClass("/account/won")}
                >
                  <FaCheckCircle />
                  <span>{t("Won Items")}</span>
                </Link>
                <Link
                  href="/account/lost"
                  className={subLinkClass("/account/lost")}
                >
                  <FaTimesCircle />
                  <span>{t("Lost Bids")}</span>
                </Link>
              </div>
            )}
          </div>

          {/* Selling Dropdown */}
          <div>
            <div
              onClick={() => setShowSellingOptions(!showSellingOptions)}
              className="flex items-center justify-between cursor-pointer text-green-500"
            >
              <div className="flex items-center gap-2">
                <FaTags />
                <span>{t("Selling")}</span>
              </div>
              {showSellingOptions ? <FaChevronUp /> : <FaChevronDown />}
            </div>

            {showSellingOptions && (
              <div className="ml-6 mt-2 space-y-2">
                <Link href="/listing" className={subLinkClass("/listing")}>
                  <FaPlusCircle />
                  <span>{t("Start a listing")}</span>
                </Link>
                <Link
                  href="/account/selling"
                  className={subLinkClass("/account/selling")}
                >
                  <FaClipboardList />
                  <span>{t("Items I'm selling")}</span>
                </Link>
                <Link
                  href="/account/sold"
                  className={subLinkClass("/account/sold")}
                >
                  <FaCheckCircle />
                  <span>{t("Sold")}</span>
                </Link>
                <Link
                  href="/account/unsold"
                  className={subLinkClass("/account/unsold")}
                >
                  <FaTimesCircle />
                  <span>{t("Unsold")}</span>
                </Link>
                <Link
                  // href="/account/selling/summary"
                  href=""
                  //  className={subLinkClass('/account/selling/summary')}
                  className={
                    "flex gap-2 items-center cursor-not-allowed opacity-50"
                  }
                >
                  <FaChartBar />
                  <span>{t("Sales summary")}</span>
                </Link>
              </div>
            )}
          </div>

          {/* <Link
            href={""}
            // href="/products"
            className={"flex gap-2 items-center cursor-not-allowed opacity-50"}
          >
            <FaClipboardList />
            <span>{t("My Products")}</span>
          </Link> */}

          {/* <Link href="/setting" className={mainLinkClass("/setting")}>
            <FaUserCog />
            <span>{t("Setting")}</span>
          </Link> */}

          {/* <Link
            href={""}
            // href="/products"
            className={"flex gap-2 items-center cursor-not-allowed opacity-50"}
          >
            <FaClipboardList />
            <span>{t("Help")}</span>
          </Link> */}
        </nav>
      </div>

      {/* Mobile Overlay */}
      {showSidebar && (
        <div
          className="fixed inset-0 bg-black opacity-40 z-30 md:hidden"
          onClick={() => setShowSidebar(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
