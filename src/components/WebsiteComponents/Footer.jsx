

import Link from 'next/link';
import React from 'react';
import { useTranslation } from "react-i18next";

const footerData = [
  {
    title: "Marketplace",
    links: [
      "Latest deals",
      "Stores",
      "Closing soon",
      { price: "$", text: "1 reserve" },
      "Home & Living"
    ],
  },
  {
    title: "Jobs",
    links: [
      "Browse Categories",
      "Careers advice",
      "Jobsmart",
      "Advertisers advices",
      "Salary guide",
    ],
  },
  {
    title: "Motors",
    links: ["Browse all cars", "Other vehicles", "Buying & Selling", "Dealer news & info", "Sell your car"],
  },
  {
    title: "Property",
    links: [
      "International property",
      "News & guides",
      "Sold Properties",
      "OneHub Hub agents",
      "Find a Real Estate Agent",
    ],
  },
  {
    title: "Services",
    links: [
      "Trades",
      "Domestic services",
      "Event & entertainment",
      "Health & wellbeing",
      "List my services",
    ],
  },
  {
    title: "Community",
    links: [
      "Help",
      "Announcements",
      "Trust & safety",
      "Seller information",
      "Help center community",
    ],
  },
];

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-white border-t text-sm text-gray-700 mt-10">
      {/* Newsletter Section */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row md:justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <h2 className="text-xl font-semibold mb-1">{t("Join our newsletter")}</h2>
            <p className="text-gray-500">
              {t("Register now to get latest updates on promotions & coupons. Don’t worry, we’re not spam!")}
            </p>
          </div>
          <form className="flex flex-col sm:flex-row items-center gap-2">
            <input
              type="email"
              placeholder={t("Enter your email address")}
              className="border px-4 py-2 rounded-md w-full sm:w-72"
            />
            <button
              type="submit"
              className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-md w-full sm:w-auto"
            >
              {t("SEND")}
            </button>
          </form>
        </div>
        <p className="text-xs text-gray-400 mt-2 text-center md:text-right">
          {t("By subscribing you agree to our")}{" "}
            <Link href="/terms" className="underline">
    {t("Terms & Conditions")}
  </Link>{" "} {t("and")}{" "}
            <Link href="/privacy" className="underline">
    {t("Privacy Policy")}
  </Link>..
        </p>
      </div>

      <hr className="border-gray-200" />

      {/* Footer Links */}
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
        {footerData.map((section) => (
          <div key={section.title}>
            <h4 className="font-semibold mb-2">{t(section.title)}</h4>
            <ul className="space-y-1">
              {section.links.map((link, index) => (
                <li key={index} className="hover:underline cursor-pointer text-gray-500">
                  {typeof link === "string" ? t(link) : (
                    <span>
                      <span className="price">{link.price}</span> {t(link.text)}
                    </span>
                  )}
                </li>
              ))}



            </ul>
          </div>
        ))}
      </div>

      <hr className="border-gray-200" />

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col sm:flex-row justify-between items-center text-xs text-gray-500 gap-2">
        <p>{t("Copyright 2025 © All rights reserved")}</p>
        <div className="flex items-center gap-3">
          <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png" className="h-5" alt="Visa" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" className="h-5" alt="Paypal" />
        </div>
        <div className="flex gap-4 text-gray-500">
          <Link href="/privacy" >{t("Terms and Conditions")}</Link>
          <Link href="/privacy" >{t("Privacy Policy")}</Link>
          <a href="#" className="hover:underline">{t("Order Tracking")}</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
