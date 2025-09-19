"use client";
import { useEffect } from "react";
import { X as CloseIcon, Mail, Printer, Copy, Globe } from "lucide-react";
import { FacebookIcon, XIcon } from "../SVGicons/SVGIcons";

const ShareListingModal = ({ isOpen, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => document.body.classList.remove("overflow-hidden");
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/10 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-xl max-h-[80vh] overflow-y-auto scroll-smooth custom-scroll p-4 sm:p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Share this listing
          </h2>
          <button
            onClick={onClose}
            className="text-[#175f48] hover:text-green-600"
          >
            <CloseIcon className="w-5 h-5 t" />
          </button>
        </div>

        <ul className="space-y-4">
          <li className="flex items-center space-x-3 cursor-pointer border-b border-gray-300 pb-3 mb-3">
            <Mail className="w-5 h-5 text-[#175f48]" />
            <span className="text-black">Email</span>
          </li>
          <li className="flex items-center space-x-3 cursor-pointer border-b border-gray-300 pb-3 mb-3">
            <XIcon className="w-5 h-5 text-[#175f48]" />
            <span className="text-black">Share on X (Twitter)</span>
          </li>
          <li className="flex items-center space-x-3 cursor-pointer border-b border-gray-300 pb-3 mb-3">
            <Copy className="w-5 h-5 text-[#175f48]" />
            <span className="text-black">Copy Link</span>
          </li>
          <li className="flex items-center space-x-3 cursor-pointer border-b border-gray-300 pb-3 mb-3">
            <FacebookIcon className="w-5 h-5 text-[#175f48]" />
            <span className="text-black">Facebook</span>
          </li>
          <li
            onClick={() => window.print()}
            className="flex items-center space-x-3 cursor-pointer border-b border-gray-300 pb-3 mb-3"
          >
            <Printer className="w-5 h-5 text-[#175f48]" />
            <span className="text-black">Print</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ShareListingModal;
