
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useTranslation } from "react-i18next";

export default function ListingCard({ listing, actions = [] }) {
  const { t } = useTranslation();

  return (
    <div className="bg-white rounded shadow-sm mb-4 sm:w-[700px] w-full">
      <Link href={listing.link} className="block cursor-pointer">
        <div className="flex flex-col xs:flex-row sm:flex-row p-4 gap-4">
          <div className="relative w-16 h-16 shrink-0 rounded overflow-hidden mx-auto sm:mx-0">
            <Image
              src={listing.image}
              alt={listing.title}
              fill
              className="object-cover"
            />
          </div>

          <div className="flex-1 text-sm text-center sm:text-left">
            <p className="text-xs text-red-600 font-medium mb-1">
              {t("Closed")}:
              {new Date(listing.closingDate).toLocaleDateString("en-NZ", {
                weekday: "short",
                day: "numeric",
                month: "short",
              })}
            </p>
            <p className="font-medium text-gray-800">{listing.title}</p>

            {/* <div className="flex sm:flex-col items-end  w-full sm:w-auto mt-2 sm:mt-0 sm:ml-auto text-sm text-gray-600">
            <span className="text-xs text-gray-500">Offer price</span>
            <span className="font-semibold text-gray-800 text-base">
              ${listing.price}
            </span>
          </div> */}
          </div>
          {listing.offerStatus && (
            <div className="flex-end text-sm text-center sm:text-left">
              <span
                className={` px-2 py-1 rounded ml-2 text-xs font-semibold
                  ${
                    listing.offerStatus === "pending"
                      ? "bg-orange-200 hover:bg-orange-300 text-orange-700"
                      : listing.offerStatus === "accepted"
                      ? "bg-green-200 hover:bg-green-300 text-green-700"
                      : listing.offerStatus === "rejected"
                      ? "bg-red-200 hover:bg-red-300 text-red-700"
                      : "bg-gray-400"
                  }
                `}
              >
                {t(`${listing.offerStatus}`)}
              </span>
              {/* Status: <span className="capitalize">{listing.offerStatus}</span> */}
              {/* <span className="font-semibold text-sm sm:text-base text-gray-800">
        ${listing.price}
      </span> */}
            </div>
          )}
        </div>
      </Link>

      <div className="border-t px-3 flex flex-col sm:flex-row justify-between text-sm text-gray-700">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={action.onClick}
            className="w-full py-2 hover:underline text-center border-t sm:border-none first:border-none"
          >
            {action.label}
          </button>
        ))}
      </div>
    </div>
  );
}
